import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '../state/settingsStore';
import { useTheme } from '../themes/ThemeProvider';
import { PageBg, ChunkyButton, SoftCard } from '../ui';
import { createProfile, switchProfile } from '../state/profileActions';
import { getOnboardingDraft, resetOnboardingDraft } from './OnboardingProfile';

function Stepper({ step }: { step: number }) {
  const { tokens } = useTheme();
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 6,
        marginBottom: 18,
      }}
    >
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            width: i === step ? 22 : 8,
            height: 8,
            borderRadius: 999,
            background: i <= step ? tokens.tokens.color.accent : '#E5E7EB',
          }}
        />
      ))}
    </div>
  );
}

export function OnboardingParentEmail() {
  const navigate = useNavigate();
  const { tokens, key: activeThemeKey } = useTheme();
  const { t } = useTranslation('onboarding');
  const { t: tc } = useTranslation('common');
  const setParentEmail = useSettingsStore((s) => s.setParentEmail);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const c = tokens.tokens.color;

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
    <PageBg>
      <div
        style={{
          padding: '64px 26px 0',
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Stepper step={3} />

        <div
          style={{
            alignSelf: 'center',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: '#FEF3C7',
            color: '#92400E',
            padding: '6px 12px',
            borderRadius: 999,
            fontFamily: tokens.tokens.font.display,
            fontWeight: 800,
            fontSize: 12,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: 14,
          }}
        >
          <span aria-hidden="true">⭐</span>
          Anne-baba için
        </div>

        <div
          style={{
            fontFamily: tokens.tokens.font.display,
            fontWeight: 800,
            fontSize: 26,
            color: '#0F172A',
            textAlign: 'center',
            lineHeight: 1.15,
          }}
        >
          {t('parentEmail')}
        </div>
        <div
          style={{
            fontFamily: tokens.tokens.font.body,
            fontWeight: 500,
            fontSize: 14,
            color: '#64748B',
            textAlign: 'center',
            marginTop: 8,
            marginBottom: 22,
            lineHeight: 1.4,
          }}
        >
          {t('parentEmailOptional')}
        </div>

        <SoftCard padding={16}>
          <div
            style={{
              fontFamily: tokens.tokens.font.display,
              fontWeight: 700,
              fontSize: 12,
              color: '#64748B',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: 6,
            }}
          >
            E-posta
          </div>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="parent@example.com"
            aria-label={t('parentEmail')}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 14,
              background: '#F8FAFC',
              border: '2px solid #E2E8F0',
              fontFamily: tokens.tokens.font.body,
              fontSize: 17,
              color: '#0F172A',
              outline: 'none',
            }}
          />
          <div
            style={{
              marginTop: 14,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
            }}
          >
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                background: c.accent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: 1,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16">
                <path
                  d="M3 8 L7 12 L13 4"
                  stroke="#fff"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div
              style={{
                fontFamily: tokens.tokens.font.body,
                fontSize: 13,
                color: '#475569',
                lineHeight: 1.4,
              }}
            >
              {t('parentEmailDisclosure')}
            </div>
          </div>
        </SoftCard>

        <div style={{ flex: 1 }} />

        <div style={{ paddingBottom: 18 }}>
          <ChunkyButton
            variant="primary"
            size="xl"
            fullWidth
            onClick={() => finishOnboarding(email.trim())}
            disabled={submitting}
          >
            {t('start')} 🎉
          </ChunkyButton>
          <button
            type="button"
            onClick={() => finishOnboarding('')}
            disabled={submitting}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontFamily: tokens.tokens.font.display,
              fontWeight: 700,
              fontSize: 16,
              color: '#64748B',
              padding: '14px 0',
              width: '100%',
            }}
          >
            {tc('skip')}
          </button>
        </div>
      </div>
    </PageBg>
  );
}
