import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Card, TouchTarget } from '../ui';
import {
  hashPin,
  verifyPin,
  recordFailedAttempt,
  resetLockout,
  remainingCooldownMs,
  generateForgotPinChallenge,
  type PinLockoutState,
  type ForgotPinChallenge,
} from '../engines/parentSettings';
import { useSessionStore } from '../state/sessionStore';
import { useSettingsStore } from '../state/settingsStore';
import { repos } from '../repos';

type Mode = 'loading' | 'set' | 'verify' | 'cooldown' | 'forgot';

export function ParentGateScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation('parent');
  const { t: tc } = useTranslation('common');
  const authorize = useSessionStore((s) => s.authorizeParentGate);
  const setParentPinSet = useSettingsStore((s) => s.setParentPinSet);

  // Boot as 'loading' until we know whether IDB already has a pinHash.
  const [mode, setMode] = useState<Mode>('loading');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'enter' | 'confirm'>('enter');
  const [lockout, setLockout] = useState<PinLockoutState>({
    failedAttempts: 0,
  });
  const [cycleCount, setCycleCount] = useState(0);
  const [cooldownSec, setCooldownSec] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Forgot-PIN challenge state — generated lazily inside an effect so render
  // remains pure. Stable for the lifetime of this gate screen.
  const [forgotInput, setForgotInput] = useState('');
  const challengeRef = useRef<ForgotPinChallenge | null>(null);
  const [challenge, setChallenge] = useState<ForgotPinChallenge | null>(null);

  // Boot: peek IDB to decide initial mode.
  useEffect(() => {
    void (async () => {
      const auth = await repos.settings.loadParentAuth();
      if (auth) {
        setLockout({
          failedAttempts: auth.failedAttempts,
          lockedUntil: auth.lockedUntil,
        });
        if (auth.lockedUntil) {
          const rem = remainingCooldownMs({
            lockedUntil: auth.lockedUntil,
            failedAttempts: 0,
          });
          if (rem > 0) {
            setMode('cooldown');
            setCooldownSec(Math.ceil(rem / 1000));
            return;
          }
        }
      }
      // PIN already on disk → VERIFY; else first-time SET.
      setMode(auth?.pinHash ? 'verify' : 'set');
    })();
  }, []);

  // Generate the forgot-PIN math challenge lazily on first mount.
  useEffect(() => {
    if (challengeRef.current) return;
    const c = generateForgotPinChallenge(Math.floor(Date.now() / 60_000));
    challengeRef.current = c;
    setChallenge(c);
  }, []);

  // Cooldown tick.
  useEffect(() => {
    if (mode !== 'cooldown') return;
    const id = setInterval(() => {
      setCooldownSec((s) => {
        if (s <= 1) {
          setMode('verify');
          setLockout(resetLockout());
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [mode]);

  const tap = (digit: string) => {
    if (mode === 'cooldown' || mode === 'loading' || mode === 'forgot') return;
    const current = step === 'enter' ? pin : confirmPin;
    if (current.length >= 4) return;
    const next = current + digit;
    if (step === 'enter') setPin(next);
    else setConfirmPin(next);
  };

  const clear = () => {
    if (step === 'enter') setPin('');
    else setConfirmPin('');
  };

  const saveNewPin = async (rawPin: string): Promise<void> => {
    const { hash, salt } = await hashPin(rawPin);
    const now = new Date().toISOString();
    const existing = await repos.settings.loadParentAuth();
    await repos.settings.saveParentAuth({
      pinHash: hash,
      pinSalt: salt,
      failedAttempts: 0,
      lockedUntil: undefined,
      email: existing?.email,
      version: (existing?.version ?? 0) + 1,
      updatedAt: now,
      dirty: true,
    });
    setParentPinSet(true);
  };

  const submit = () => {
    if (mode === 'loading') return;

    if (mode === 'set') {
      if (step === 'enter') {
        if (pin.length === 4) setStep('confirm');
        return;
      }
      if (pin !== confirmPin) {
        setError(t('wrongPin'));
        setPin('');
        setConfirmPin('');
        setStep('enter');
        return;
      }
      void (async () => {
        await saveNewPin(pin);
        authorize();
        await navigate('/parent/dashboard');
      })();
      return;
    }

    if (mode === 'verify' && pin.length === 4) {
      void (async () => {
        const auth = await repos.settings.loadParentAuth();
        if (!auth) {
          setMode('set');
          setPin('');
          return;
        }
        const ok = await verifyPin(pin, auth.pinHash, auth.pinSalt);
        if (ok) {
          await repos.settings.saveParentAuth({
            ...auth,
            failedAttempts: 0,
            lockedUntil: undefined,
            updatedAt: new Date().toISOString(),
            dirty: true,
          });
          authorize();
          setError(null);
          await navigate('/parent/dashboard');
          return;
        }
        const result = recordFailedAttempt({
          failedAttempts: lockout.failedAttempts,
          cycleCount,
        });
        await repos.settings.saveParentAuth({
          ...auth,
          failedAttempts: result.state.failedAttempts,
          lockedUntil: result.state.lockedUntil,
          updatedAt: new Date().toISOString(),
          dirty: true,
        });
        setLockout(result.state);
        setCycleCount(result.cycleCount);
        setPin('');
        if (result.cooldownMs) {
          setMode('cooldown');
          setCooldownSec(Math.ceil(result.cooldownMs / 1000));
        } else {
          setError(t('wrongPin'));
        }
      })();
    }
  };

  const submitForgotChallenge = () => {
    const current = challengeRef.current;
    if (!current) return;
    const trimmed = forgotInput.trim();
    if (!/^-?\d+$/.test(trimmed)) {
      setError(t('forgotPinWrongAnswer'));
      return;
    }
    if (Number(trimmed) !== current.answer) {
      setError(t('forgotPinWrongAnswer'));
      setForgotInput('');
      return;
    }
    // Correct adult-math → allow re-set without knowing old PIN.
    setError(null);
    setForgotInput('');
    setMode('set');
    setStep('enter');
    setPin('');
    setConfirmPin('');
  };

  const displayPin = step === 'enter' ? pin : confirmPin;

  // Loading skeleton (auth peek pending).
  if (mode === 'loading') {
    return (
      <main className="app-shell">
        <p className="text-fg/60">…</p>
      </main>
    );
  }

  // Forgot-PIN math-challenge UI.
  if (mode === 'forgot') {
    return (
      <main className="app-shell">
        <Card className="max-w-sm w-full text-center">
          <h1 className="font-display text-2xl text-primary-fg mb-2">
            {t('forgotPinTitle')}
          </h1>
          <p className="text-fg/80 mb-4">{t('forgotPinInstructions')}</p>
          <p className="font-display text-3xl text-accent mb-4 tabular-nums">
            {challenge ? `${challenge.prompt} = ?` : '…'}
          </p>
          <input
            type="number"
            inputMode="numeric"
            value={forgotInput}
            onChange={(e) => setForgotInput(e.target.value)}
            placeholder="?"
            className="w-full px-4 py-3 mb-3 rounded-soft bg-bg/40 text-fg border-2 border-fg/30 focus:border-accent focus:outline-none text-center text-2xl tabular-nums"
            aria-label={t('forgotPinAnswer')}
          />
          {error && (
            <p className="text-danger mb-3" role="alert">
              {error}
            </p>
          )}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setError(null);
                setForgotInput('');
                setMode('verify');
              }}
            >
              {tc('back')}
            </Button>
            <Button
              variant="primary"
              onClick={submitForgotChallenge}
              disabled={!forgotInput.trim()}
            >
              {tc('confirm')}
            </Button>
          </div>
        </Card>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <Card className="max-w-sm w-full text-center">
        <h1 className="font-display text-2xl text-primary-fg mb-2">
          {t('gate')}
        </h1>
        <p className="text-fg/80 mb-4">
          {mode === 'set'
            ? step === 'enter'
              ? t('setPin')
              : t('confirmPin')
            : mode === 'cooldown'
              ? t('cooldown', { seconds: cooldownSec })
              : t('enterPin')}
        </p>

        <div className="text-3xl font-display tracking-widest mb-4 h-10">
          {'•'.repeat(displayPin.length)}
          {' '.repeat(4 - displayPin.length)}
        </div>

        {error && (
          <p className="text-danger mb-3" role="alert">
            {error}
          </p>
        )}

        <div className="grid grid-cols-3 gap-2 mb-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
            <TouchTarget
              key={d}
              onClick={() => tap(d)}
              disabled={mode === 'cooldown'}
              className="bg-surface text-fg text-2xl"
            >
              {d}
            </TouchTarget>
          ))}
          <TouchTarget
            onClick={clear}
            disabled={mode === 'cooldown'}
            className="bg-surface text-fg"
            aria-label="clear"
          >
            ⌫
          </TouchTarget>
          <TouchTarget
            onClick={() => tap('0')}
            disabled={mode === 'cooldown'}
            className="bg-surface text-fg text-2xl"
          >
            0
          </TouchTarget>
          <TouchTarget
            onClick={submit}
            disabled={mode === 'cooldown' || displayPin.length < 4}
            className="bg-accent text-accent-fg"
            aria-label={tc('confirm')}
          >
            ✓
          </TouchTarget>
        </div>

        {mode === 'verify' && (
          <Button
            variant="ghost"
            onClick={() => {
              setError(null);
              setMode('forgot');
              setPin('');
            }}
            className="w-full mb-2"
          >
            {t('forgotPinLink')}
          </Button>
        )}

        <Button
          variant="ghost"
          onClick={() => void navigate('/map')}
          className="w-full"
        >
          {tc('back')}
        </Button>
      </Card>
    </main>
  );
}
