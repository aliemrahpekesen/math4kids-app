import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Card } from '../ui';
import { useSettingsStore } from '../state/settingsStore';
import { useTheme } from '../themes/ThemeProvider';
import { createProfile, switchProfile } from '../state/profileActions';
import { getOnboardingDraft, resetOnboardingDraft } from './OnboardingProfile';

export function OnboardingParentEmail() {
  const navigate = useNavigate();
  const { t } = useTranslation('onboarding');
  const { t: tc } = useTranslation('common');
  const { key: activeThemeKey } = useTheme();
  const setParentEmail = useSettingsStore((s) => s.setParentEmail);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const finishOnboarding = (savedEmail: string) => {
    void (async () => {
      try {
        setSubmitting(true);
        const draft = getOnboardingDraft();
        if (savedEmail) setParentEmail(savedEmail);
        const profile = await createProfile({
          nickname: draft.nickname,
          avatarKey: draft.avatarKey,
          themeKey: activeThemeKey,
        });
        await switchProfile(profile.id);
        resetOnboardingDraft();
        await navigate('/map');
      } finally {
        setSubmitting(false);
      }
    })();
  };

  return (
    <main className="app-shell">
      <Card className="max-w-md w-full text-center">
        <h1 className="font-display text-2xl text-primary-fg mb-2">
          {t('parentEmail')}
        </h1>
        <p className="text-fg/70 text-sm mb-4">{t('parentEmailOptional')}</p>

        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="parent@example.com"
          className="w-full px-4 py-3 mb-3 rounded-soft bg-bg/40 text-fg border-2 border-fg/30 focus:border-accent focus:outline-none"
          aria-label={t('parentEmail')}
        />

        <p className="text-fg/60 text-xs text-left mb-6">
          {t('parentEmailDisclosure')}
        </p>

        <div className="flex flex-col gap-2">
          <Button
            variant="primary"
            onClick={() => finishOnboarding(email.trim())}
            disabled={submitting}
            className="w-full"
          >
            {t('start')}
          </Button>
          <Button
            variant="ghost"
            onClick={() => finishOnboarding('')}
            disabled={submitting}
            className="w-full"
          >
            {tc('skip')}
          </Button>
        </div>
      </Card>
    </main>
  );
}
