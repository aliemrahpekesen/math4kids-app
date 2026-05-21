import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../state/profileStore';

export function Splash() {
  const navigate = useNavigate();
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
    <main className="app-shell">
      <div className="text-6xl mb-4 animate-bounce" aria-hidden="true">
        🚀
      </div>
      <h1 className="font-display text-4xl text-primary-fg">Math4Kids</h1>
      <p className="text-fg/70 mt-2">Hazırlanıyor…</p>
    </main>
  );
}
