import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../themes/ThemeProvider';
import { PageBg, ChunkyButton, CharacterAvatar } from '../ui';
import {
  AVATARS_BY_THEME,
  AVATAR_THEME_KEYS,
  type AvatarKey,
} from '../ui/CharacterAvatar';

interface DraftProfile {
  nickname: string;
  avatarKey: AvatarKey;
}

const DEFAULT_AVATAR: AvatarKey = 'space-astronaut';

/* eslint-disable react-refresh/only-export-components -- module-level draft state colocated with the onboarding screens that share it. */
let draft: DraftProfile = { nickname: '', avatarKey: DEFAULT_AVATAR };
export function getOnboardingDraft(): DraftProfile {
  return { ...draft };
}
export function setOnboardingDraft(next: Partial<DraftProfile>): void {
  draft = { ...draft, ...next };
}
export function resetOnboardingDraft(): void {
  draft = { nickname: '', avatarKey: DEFAULT_AVATAR };
}
/* eslint-enable react-refresh/only-export-components */

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

export function OnboardingProfile() {
  const navigate = useNavigate();
  const { tokens } = useTheme();
  const { t } = useTranslation('onboarding');
  const [nickname, setNickname] = useState(draft.nickname);
  const c = tokens.tokens.color;

  const submit = () => {
    if (!nickname.trim()) return;
    setOnboardingDraft({ nickname: nickname.trim() });
    void navigate('/onboarding/avatar');
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
        <Stepper step={1} />
        <div
          style={{
            fontFamily: tokens.tokens.font.display,
            fontWeight: 800,
            fontSize: 28,
            color: '#0F172A',
            textAlign: 'center',
          }}
        >
          Ben kimim?
        </div>
        <div
          style={{
            fontFamily: tokens.tokens.font.body,
            fontWeight: 600,
            fontSize: 14,
            color: '#64748B',
            textAlign: 'center',
            marginBottom: 22,
          }}
        >
          Adını yaz.
        </div>

        <div
          style={{
            background: '#fff',
            borderRadius: 20,
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            boxShadow:
              'inset 0 -4px 0 rgba(0,0,0,0.04), 0 4px 10px rgba(0,0,0,0.06)',
            border: `2.5px solid ${c.accent}`,
          }}
        >
          <div
            style={{
              fontFamily: tokens.tokens.font.display,
              fontWeight: 700,
              fontSize: 13,
              color: '#94A3B8',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            {t('nickname')}
          </div>
          <input
            id="nickname-input"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder={t('nicknamePlaceholder')}
            maxLength={20}
            style={{
              flex: 1,
              fontFamily: tokens.tokens.font.display,
              fontWeight: 800,
              fontSize: 22,
              color: '#0F172A',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              padding: 0,
            }}
          />
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ paddingBottom: 30 }}>
          <ChunkyButton
            variant="primary"
            size="xl"
            fullWidth
            onClick={submit}
            disabled={!nickname.trim()}
          >
            Devam et →
          </ChunkyButton>
        </div>
      </div>
    </PageBg>
  );
}

export function OnboardingAvatar() {
  const navigate = useNavigate();
  const { tokens } = useTheme();
  const { t } = useTranslation('onboarding');
  const [selected, setSelected] = useState<AvatarKey>(draft.avatarKey);
  const c = tokens.tokens.color;

  const submit = () => {
    setOnboardingDraft({ avatarKey: selected });
    void navigate('/onboarding/theme');
  };

  // Flatten all avatars
  const allAvatars: AvatarKey[] = AVATAR_THEME_KEYS.flatMap(
    (themeKey) => AVATARS_BY_THEME[themeKey]
  );

  return (
    <PageBg>
      <div
        style={{
          padding: '64px 22px 0',
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Stepper step={1} />
        <div
          style={{
            fontFamily: tokens.tokens.font.display,
            fontWeight: 800,
            fontSize: 26,
            color: '#0F172A',
            textAlign: 'center',
            marginBottom: 6,
          }}
        >
          {t('chooseAvatar')}
        </div>
        <div
          style={{
            fontFamily: tokens.tokens.font.body,
            fontWeight: 600,
            fontSize: 13,
            color: '#64748B',
            textAlign: 'center',
            marginBottom: 16,
          }}
        >
          Bir karakter seç.
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 8,
          }}
        >
          {allAvatars.map((key) => {
            const sel = key === selected;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelected(key)}
                aria-label={key}
                aria-pressed={sel}
                style={{
                  aspectRatio: '1 / 1',
                  borderRadius: 18,
                  padding: 3,
                  background: sel ? c.accent : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  boxShadow: sel
                    ? `0 4px 0 ${c.accentDark}, 0 6px 12px rgba(0,0,0,0.12)`
                    : 'none',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 15,
                    overflow: 'hidden',
                    background: c.accentSoft,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: sel
                      ? '2px solid #fff'
                      : '2px solid rgba(0,0,0,0.04)',
                  }}
                >
                  <CharacterAvatar avatarKey={key} size="md" />
                </div>
                {sel && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -6,
                      right: -6,
                      width: 22,
                      height: 22,
                      borderRadius: 999,
                      background: '#22C55E',
                      border: '2px solid #fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12">
                      <path
                        d="M2 6 L5 9 L10 3"
                        stroke="#fff"
                        strokeWidth="2.5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', gap: 10, paddingBottom: 30 }}>
          <div style={{ flex: 1 }}>
            <ChunkyButton
              variant="secondary"
              size="lg"
              fullWidth
              onClick={() => void navigate('/onboarding/profile')}
            >
              ← Geri
            </ChunkyButton>
          </div>
          <div style={{ flex: 2 }}>
            <ChunkyButton variant="primary" size="lg" fullWidth onClick={submit}>
              Devam et →
            </ChunkyButton>
          </div>
        </div>
      </div>
    </PageBg>
  );
}
