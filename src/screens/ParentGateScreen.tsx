import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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

  const wrapStyle: React.CSSProperties = {
    minHeight: '100dvh',
    background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
    padding: '70px 26px 28px',
    display: 'flex',
    flexDirection: 'column',
  };

  // Loading skeleton.
  if (mode === 'loading') {
    return (
      <div style={wrapStyle}>
        <p style={{ color: '#94A3B8' }}>…</p>
      </div>
    );
  }

  // Forgot-PIN math-challenge UI.
  if (mode === 'forgot') {
    return (
      <div style={wrapStyle}>
        <div
          style={{
            background: '#1E293B',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 24,
            padding: 22,
            maxWidth: 340,
            width: '100%',
            margin: '0 auto',
            color: '#F8FAFC',
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 22,
              fontWeight: 700,
              margin: '0 0 8px',
            }}
          >
            {t('forgotPinTitle')}
          </h1>
          <p style={{ color: '#94A3B8', fontSize: 14, margin: '0 0 14px' }}>
            {t('forgotPinInstructions')}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 30,
              fontWeight: 800,
              textAlign: 'center',
              color: '#38BDF8',
              fontVariantNumeric: 'tabular-nums',
              margin: '0 0 16px',
            }}
          >
            {challenge ? `${challenge.prompt} = ?` : '…'}
          </p>
          <input
            type="number"
            inputMode="numeric"
            value={forgotInput}
            onChange={(e) => setForgotInput(e.target.value)}
            placeholder="?"
            aria-label={t('forgotPinAnswer')}
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: 14,
              background: 'rgba(255,255,255,0.06)',
              color: '#F8FAFC',
              border: '2px solid rgba(255,255,255,0.12)',
              fontSize: 22,
              textAlign: 'center',
              fontVariantNumeric: 'tabular-nums',
              marginBottom: 12,
            }}
          />
          {error && (
            <p
              style={{ color: '#F87171', fontSize: 13, marginBottom: 8 }}
              role="alert"
            >
              {error}
            </p>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setForgotInput('');
                setMode('verify');
              }}
              style={{
                background: 'rgba(255,255,255,0.06)',
                color: '#F8FAFC',
                border: 'none',
                borderRadius: 14,
                padding: '12px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {tc('back')}
            </button>
            <button
              type="button"
              onClick={submitForgotChallenge}
              disabled={!forgotInput.trim()}
              style={{
                background: '#0EA5E9',
                color: '#fff',
                border: 'none',
                borderRadius: 14,
                padding: '12px',
                fontWeight: 800,
                cursor: forgotInput.trim() ? 'pointer' : 'not-allowed',
                opacity: forgotInput.trim() ? 1 : 0.5,
              }}
            >
              {tc('confirm')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main keypad mode.
  return (
    <div style={wrapStyle}>
      {/* Badge */}
      <div
        style={{
          alignSelf: 'center',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(255,255,255,0.08)',
          color: '#94A3B8',
          border: '1px solid rgba(255,255,255,0.08)',
          padding: '6px 12px',
          borderRadius: 999,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: 18,
        }}
      >
        🔒 Ebeveyn Bölümü
      </div>

      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 26,
          fontWeight: 700,
          color: '#F8FAFC',
          textAlign: 'center',
          letterSpacing: '-0.01em',
          margin: '0 0 8px',
        }}
      >
        {mode === 'set'
          ? step === 'enter'
            ? t('setPin')
            : t('confirmPin')
          : mode === 'cooldown'
            ? t('cooldown', { seconds: cooldownSec })
            : t('gate')}
      </h1>
      <p
        style={{
          fontSize: 14,
          color: '#94A3B8',
          textAlign: 'center',
          lineHeight: 1.4,
          margin: 0,
        }}
      >
        Bu alan çocuklar için değildir.
        <br />4 haneli ebeveyn PIN&apos;ini gir.
      </p>

      {/* PIN dots */}
      <div
        style={{
          display: 'flex',
          gap: 14,
          marginTop: 30,
          justifyContent: 'center',
        }}
      >
        {[0, 1, 2, 3].map((i) => {
          const filled = i < displayPin.length;
          return (
            <div
              key={i}
              style={{
                width: 18,
                height: 18,
                borderRadius: 999,
                background: filled ? '#38BDF8' : 'transparent',
                border: `2px solid ${
                  filled ? '#38BDF8' : 'rgba(255,255,255,0.25)'
                }`,
                transition: 'all 0.15s',
              }}
            />
          );
        })}
      </div>

      {error && (
        <p
          style={{
            color: '#F87171',
            textAlign: 'center',
            marginTop: 14,
            fontSize: 13,
          }}
          role="alert"
        >
          {error}
        </p>
      )}

      {/* Keypad */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 10,
          marginTop: 26,
        }}
      >
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => tap(d)}
            disabled={mode === 'cooldown'}
            style={{
              height: 64,
              borderRadius: 16,
              background: 'rgba(255,255,255,0.06)',
              color: '#F8FAFC',
              border: 'none',
              fontFamily: 'var(--font-display)',
              fontSize: 26,
              fontWeight: 600,
              cursor: mode === 'cooldown' ? 'not-allowed' : 'pointer',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)',
            }}
          >
            {d}
          </button>
        ))}
        <button
          type="button"
          onClick={clear}
          disabled={mode === 'cooldown'}
          aria-label="clear"
          style={{
            height: 64,
            borderRadius: 16,
            background: 'rgba(255,255,255,0.06)',
            color: '#94A3B8',
            border: 'none',
            fontSize: 22,
            cursor: mode === 'cooldown' ? 'not-allowed' : 'pointer',
          }}
        >
          ⌫
        </button>
        <button
          type="button"
          onClick={() => tap('0')}
          disabled={mode === 'cooldown'}
          style={{
            height: 64,
            borderRadius: 16,
            background: 'rgba(255,255,255,0.06)',
            color: '#F8FAFC',
            border: 'none',
            fontFamily: 'var(--font-display)',
            fontSize: 26,
            fontWeight: 600,
            cursor: mode === 'cooldown' ? 'not-allowed' : 'pointer',
          }}
        >
          0
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={mode === 'cooldown' || displayPin.length < 4}
          aria-label={tc('confirm')}
          style={{
            height: 64,
            borderRadius: 16,
            background:
              displayPin.length < 4
                ? 'rgba(56,189,248,0.3)'
                : '#0EA5E9',
            color: '#fff',
            border: 'none',
            fontSize: 22,
            cursor:
              mode === 'cooldown' || displayPin.length < 4
                ? 'not-allowed'
                : 'pointer',
          }}
        >
          ✓
        </button>
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        {mode === 'verify' && (
          <button
            type="button"
            onClick={() => {
              setError(null);
              setMode('forgot');
              setPin('');
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748B',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              padding: '8px 0',
            }}
          >
            {t('forgotPinLink')}
          </button>
        )}
        <button
          type="button"
          onClick={() => void navigate('/map')}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94A3B8',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            padding: '8px 0',
            display: 'block',
            margin: '0 auto',
          }}
        >
          {tc('back')}
        </button>
      </div>
    </div>
  );
}
