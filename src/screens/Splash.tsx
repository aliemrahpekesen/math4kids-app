import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../state/profileStore';
import { useTheme } from '../themes/ThemeProvider';
import { PageBg } from '../ui';

export function Splash() {
  const navigate = useNavigate();
  const { tokens } = useTheme();
  const c = tokens.tokens.color;
  // Select primitive only — `.length` triggers no derived-array reference churn.
  const visibleProfileCount = useProfileStore(
    (s) => s.profiles.filter((p) => !p.deletedAt).length
  );

  useEffect(() => {
    const t = setTimeout(() => {
      void navigate(
        visibleProfileCount > 0 ? '/profile-picker' : '/onboarding/language'
      );
    }, 1500);
    return () => {
      clearTimeout(t);
    };
  }, [navigate, visibleProfileCount]);

  return (
    <PageBg>
      <div
        style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{ fontSize: 64, marginBottom: 16 }}
          aria-hidden="true"
          className="animate-bounce"
        >
          🚀
        </div>
        <h1
          style={{
            fontFamily: tokens.tokens.font.display,
            fontWeight: 900,
            fontSize: 40,
            color: c.accentDark,
            letterSpacing: '-0.02em',
            margin: 0,
          }}
        >
          Math<span style={{ color: c.accent }}>4</span>Kids
        </h1>
        <p
          style={{
            fontFamily: tokens.tokens.font.body,
            fontWeight: 600,
            fontSize: 14,
            color: '#64748B',
            marginTop: 8,
          }}
        >
          Hazırlanıyor…
        </p>
      </div>
    </PageBg>
  );
}
