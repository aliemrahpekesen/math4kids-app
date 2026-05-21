import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Card } from '../ui';
import { setLocale } from '../i18n/setup';
import { useSettingsStore } from '../state/settingsStore';
import type { Language } from '../state/types';

const LANG_LABEL: Record<Language, string> = {
  tr: 'Türkçe',
  en: 'English',
  de: 'Deutsch',
};

export function OnboardingLanguage() {
  const navigate = useNavigate();
  const { t } = useTranslation('onboarding');
  const setLanguage = useSettingsStore((s) => s.setLanguage);

  const choose = (lang: Language) => {
    void (async () => {
      await setLocale(lang);
      setLanguage(lang);
      await navigate('/onboarding/profile');
    })();
  };

  return (
    <main className="app-shell">
      <Card className="max-w-md w-full text-center">
        <h1 className="font-display text-3xl text-primary-fg mb-2">
          {t('selectLanguage')}
        </h1>
        <p className="text-fg/80 mb-6">{t('chooseLanguage')}</p>
        <div className="flex flex-col gap-3">
          {(['tr', 'en', 'de'] as const).map((lang) => (
            <Button key={lang} variant="primary" onClick={() => choose(lang)}>
              {LANG_LABEL[lang]}
            </Button>
          ))}
        </div>
      </Card>
    </main>
  );
}
