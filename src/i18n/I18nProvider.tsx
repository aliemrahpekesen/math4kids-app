import { useEffect, useState, type ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { initI18n, i18n } from './setup';

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void initI18n().then(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <main className="app-shell">
        <div className="text-6xl mb-4 animate-bounce" aria-hidden="true">
          🚀
        </div>
        <p className="text-fg/70">…</p>
      </main>
    );
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
