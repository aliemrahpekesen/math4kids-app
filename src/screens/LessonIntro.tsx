import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../themes/ThemeProvider';
import { PageBg, ChunkyButton, CharacterAvatar } from '../ui';
import { IconBack } from '../ui/icons';
import { getLevelById } from '../engines/curriculum';
import { useAudio } from '../audio/AudioProvider';
import { useSettingsStore } from '../state/settingsStore';
import { useProfileStore } from '../state/profileStore';

export function LessonIntro() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tokens } = useTheme();
  const { t } = useTranslation('lesson');
  const audio = useAudio();
  const language = useSettingsStore((s) => s.language);
  const profile = useProfileStore((s) =>
    s.profiles.find((p) => p.id === s.activeProfileId)
  );
  const levelId = Number(id ?? 1);
  const level = getLevelById(levelId);

  const title = level ? t(`levelTitles.${levelId}`) : '';
  const welcome = t('narration.introWelcome');

  useEffect(() => {
    if (level) audio.speak(`${title}. ${welcome}`, language);
    return () => {
      audio.stopSpeaking();
    };
  }, [title, welcome, level, audio, language]);

  if (!level) {
    return (
      <PageBg>
        <div style={{ padding: 24 }}>
          <ChunkyButton onClick={() => void navigate('/map')} variant="primary">
            🏠
          </ChunkyButton>
        </div>
      </PageBg>
    );
  }

  const c = tokens.tokens.color;

  return (
    <PageBg>
      <div
        style={{
          padding: '64px 16px 0',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100dvh',
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '0 6px',
          }}
        >
          <button
            type="button"
            onClick={() => void navigate('/map')}
            aria-label={t('backToMap')}
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              border: 'none',
              background: 'transparent',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            <IconBack size={48} />
          </button>
          <div style={{ flex: 1 }} />
          <div
            style={{
              padding: '6px 12px',
              borderRadius: 999,
              background: '#fff',
              fontFamily: tokens.tokens.font.display,
              fontSize: 12,
              fontWeight: 800,
              color: c.accentDark,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Seviye {levelId}
          </div>
          <div style={{ width: 48 }} />
        </div>

        <div style={{ flex: 1 }} />

        {/* Floating avatar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            position: 'relative',
            marginBottom: 18,
          }}
        >
          <button
            type="button"
            onClick={() => audio.speak(`${title}. ${welcome}`, language)}
            aria-label="Replay narration"
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              padding: 0,
              animation: 'm4k-float 3s ease-in-out infinite',
            }}
          >
            <div
              style={{
                width: 140,
                height: 140,
                borderRadius: 999,
                background: c.accentSoft,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CharacterAvatar
                avatarKey={profile?.avatarKey ?? 'space-astronaut'}
                size="lg"
              />
            </div>
          </button>
          <div
            style={{
              position: 'absolute',
              bottom: -8,
              width: 100,
              height: 14,
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.12)',
              filter: 'blur(6px)',
            }}
          />
        </div>

        {/* Speech bubble */}
        <div
          style={{
            position: 'relative',
            margin: '0 auto 32px',
            maxWidth: 300,
            background: '#fff',
            borderRadius: 22,
            padding: '14px 18px',
            border: '2px solid rgba(0,0,0,0.04)',
            boxShadow:
              'inset 0 -3px 0 rgba(0,0,0,0.04), 0 4px 10px rgba(0,0,0,0.08)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -10,
              left: 60,
              width: 0,
              height: 0,
              borderLeft: '12px solid transparent',
              borderRight: '12px solid transparent',
              borderBottom: '14px solid #fff',
            }}
          />
          <p
            style={{
              fontFamily: tokens.tokens.font.display,
              fontSize: 22,
              fontWeight: 800,
              color: '#0F172A',
              textAlign: 'center',
              margin: 0,
              lineHeight: 1.25,
            }}
          >
            {title}
          </p>
        </div>

        <div style={{ flex: 1 }} />

        {/* CTAs */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            paddingBottom: 30,
            padding: '0 6px 30px',
          }}
        >
          {level.range && (
            <ChunkyButton
              variant="primary"
              size="xl"
              fullWidth
              onClick={() => void navigate(`/lesson/${levelId}/teach`)}
              icon={<span style={{ fontSize: 26 }}>🎯</span>}
            >
              {t('startTeach')}
            </ChunkyButton>
          )}
          <ChunkyButton
            variant="secondary"
            size="lg"
            fullWidth
            onClick={() => void navigate(`/lesson/${levelId}/practice`)}
            icon={<span style={{ fontSize: 22 }}>🎨</span>}
          >
            {t('startPractice')}
          </ChunkyButton>
          <button
            type="button"
            onClick={() => void navigate(`/lesson/${levelId}/quiz`)}
            aria-label={t('skipPractice')}
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              padding: '14px 0',
              fontFamily: tokens.tokens.font.display,
              fontSize: 16,
              fontWeight: 700,
              color: '#64748B',
            }}
          >
            {t('skipPractice')} →
          </button>
        </div>
      </div>
    </PageBg>
  );
}
