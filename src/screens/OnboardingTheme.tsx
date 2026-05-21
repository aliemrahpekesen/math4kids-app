import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Card } from '../ui';
import { useTheme } from '../themes/ThemeProvider';
import type { ThemeKey } from '../themes/types';
import { setOnboardingDraft } from './OnboardingProfile';

const THEME_KEYS: ThemeKey[] = ['space', 'jungle', 'ocean', 'candy'];
const THEME_EMOJI: Record<ThemeKey, string> = {
  space: '🚀',
  jungle: '🌴',
  ocean: '🐟',
  candy: '🍭',
};

export function OnboardingTheme() {
  const navigate = useNavigate();
  const { t } = useTranslation('onboarding');
  const { t: tc } = useTranslation('common');
  const { setTheme } = useTheme();
  const [selected, setSelected] = useState<ThemeKey>('space');

  const choose = (key: ThemeKey) => {
    setSelected(key);
    setTheme(key);
  };

  const submit = () => {
    setOnboardingDraft({});
    // Stash theme in draft via a module-level extension — keep it simple
    // and re-pull from settingsStore for consistency.
    void navigate('/onboarding/parent-email');
  };

  return (
    <main className="app-shell">
      <Card className="max-w-md w-full text-center">
        <h1 className="font-display text-3xl text-primary-fg mb-4">
          {t('chooseTheme')}
        </h1>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {THEME_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => choose(key)}
              aria-label={t(`themes.${key}`)}
              aria-pressed={selected === key}
              className={`p-4 rounded-soft border-4 transition-all min-h-touch ${
                selected === key
                  ? 'border-accent shadow-glow'
                  : 'border-transparent bg-surface'
              }`}
            >
              <div className="text-4xl mb-1" aria-hidden="true">
                {THEME_EMOJI[key]}
              </div>
              <div className="font-display text-sm">{t(`themes.${key}`)}</div>
            </button>
          ))}
        </div>
        <Button variant="primary" onClick={submit} className="w-full">
          {tc('next')}
        </Button>
      </Card>
    </main>
  );
}
