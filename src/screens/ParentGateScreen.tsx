import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Card, TouchTarget } from '../ui';
import {
  hashPin,
  verifyPin,
  recordFailedAttempt,
  resetLockout,
  remainingCooldownMs,
  type PinLockoutState,
} from '../engines/parentSettings';
import { useSessionStore } from '../state/sessionStore';
import { useSettingsStore } from '../state/settingsStore';
import { repos } from '../repos';

type Mode = 'set' | 'verify' | 'cooldown';

export function ParentGateScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation('parent');
  const { t: tc } = useTranslation('common');
  const authorize = useSessionStore((s) => s.authorizeParentGate);
  const parentPinSet = useSettingsStore((s) => s.parentPinSet);
  const setParentPinSet = useSettingsStore((s) => s.setParentPinSet);

  const [mode, setMode] = useState<Mode>(parentPinSet ? 'verify' : 'set');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'enter' | 'confirm'>('enter');
  const [lockout, setLockout] = useState<PinLockoutState>({
    failedAttempts: 0,
  });
  const [cycleCount, setCycleCount] = useState(0);
  const [cooldownSec, setCooldownSec] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Hydrate parent auth lockout state on mount.
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
          }
        }
      }
    })();
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
    return () => clearInterval(id);
  }, [mode]);

  const tap = (digit: string) => {
    if (mode === 'cooldown') return;
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

  const submit = () => {
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
        const { hash, salt } = await hashPin(pin);
        const now = new Date().toISOString();
        await repos.settings.saveParentAuth({
          pinHash: hash,
          pinSalt: salt,
          failedAttempts: 0,
          version: 1,
          updatedAt: now,
          dirty: true,
        });
        setParentPinSet(true);
        authorize();
        await navigate('/parent/dashboard');
      })();
      return;
    }

    if (mode === 'verify' && pin.length === 4) {
      void (async () => {
        const auth = await repos.settings.loadParentAuth();
        if (!auth) {
          // Edge: shouldn't happen because parentPinSet should be true.
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

  const displayPin = step === 'enter' ? pin : confirmPin;

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
