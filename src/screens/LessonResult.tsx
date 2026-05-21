import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../themes/ThemeProvider';
import {
  PageBg,
  SoftCard,
  ChunkyButton,
  CoinIcon,
  Star,
  Sparkle,
  CharacterAvatar,
} from '../ui';
import { useProgressStore } from '../state/progressStore';
import { useRewardStore } from '../state/rewardStore';
import { useProfileStore } from '../state/profileStore';
import { getNextLevel, isUnlocked } from '../engines/curriculum';
import { useAudio } from '../audio/AudioProvider';
import { useSettingsStore } from '../state/settingsStore';

interface ConfettiPieceProps {
  idx: number;
  color: string;
}

function ConfettiPiece({ idx, color }: ConfettiPieceProps) {
  const size = 6 + (idx % 4) * 2; // 6..12
  const x = (idx * 53) % 100;
  const y = 6 + (idx * 11) % 70;
  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        background: color,
        borderRadius: idx % 2 === 0 ? '50%' : 2,
        opacity: 0.85,
        transform: `rotate(${idx * 37}deg)`,
        animation: `m4k-float 3s ${idx * 0.1}s ease-in-out infinite`,
        pointerEvents: 'none',
      }}
    />
  );
}

function Confetti() {
  const { tokens } = useTheme();
  const colors = [
    '#FACC15',
    tokens.tokens.color.accent,
    '#22D3EE',
    '#F472B6',
    '#22C55E',
  ];
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {Array.from({ length: 18 }, (_, i) => (
        <ConfettiPiece
          key={i}
          idx={i}
          color={colors[i % colors.length]!}
        />
      ))}
    </div>
  );
}

export function LessonResult() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('lesson');
  const { tokens } = useTheme();
  const language = useSettingsStore((s) => s.language);
  const audio = useAudio();
  const levelId = Number(id ?? 1);
  const progress = useProgressStore((s) => s.levels);
  const coins = useRewardStore((s) => s.coins);
  const current = progress[levelId];
  const stars = current?.bestStars ?? 0;
  const next = getNextLevel(levelId);
  const nextUnlocked = next ? isUnlocked(progress, next.id) : false;
  const profile = useProfileStore((s) =>
    s.profiles.find((p) => p.id === s.activeProfileId)
  );

  useEffect(() => {
    const msg =
      stars === 3
        ? t('narration.celebrationPerfect')
        : stars === 2
          ? t('narration.celebrationGreat')
          : t('narration.tryAgainSoft');
    audio.speak(msg, language);
    return () => {
      audio.stopSpeaking();
    };
  }, [stars, audio, language, t]);

  const c = tokens.tokens.color;
  const reward = stars * 5 + (stars === 3 ? 5 : 0); // simple display only

  return (
    <PageBg>
      <Confetti />
      <div
        style={{
          padding: '64px 24px 30px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100dvh',
          position: 'relative',
        }}
      >
        {nextUnlocked && next && (
          <div
            style={{
              background: '#fff',
              padding: '8px 14px',
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 800,
              color: c.accentDark,
              marginBottom: 18,
              boxShadow:
                'inset 0 -3px 0 rgba(0,0,0,0.04), 0 4px 8px rgba(0,0,0,0.05)',
            }}
          >
            🎉 Seviye {next.id} açıldı!
          </div>
        )}

        <h1
          style={{
            fontFamily: tokens.tokens.font.display,
            fontSize: 44,
            fontWeight: 900,
            color: c.accentDark,
            margin: 0,
            textShadow: `0 4px 0 ${c.accentSoft}`,
            letterSpacing: '-0.02em',
          }}
        >
          {stars === 3
            ? 'Harikasın!'
            : stars === 2
              ? 'Çok iyi!'
              : stars === 1
                ? 'Aferin!'
                : 'Tekrar dene'}
        </h1>
        <p
          style={{
            margin: '8px 0 0',
            fontFamily: tokens.tokens.font.body,
            fontSize: 16,
            fontWeight: 700,
            color: '#475569',
          }}
        >
          Seviye {levelId} tamamlandı
        </p>

        {/* Stars row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 8,
            marginTop: 28,
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                transform: i === 1 ? 'translateY(-10px) scale(1.15)' : 'none',
                transformOrigin: 'bottom',
              }}
            >
              <Star size={i === 1 ? 100 : 80} on={i < stars} bounce delay={i * 0.18} />
            </div>
          ))}
        </div>

        {/* Coin reward card */}
        <div style={{ marginTop: 24, width: '100%' }}>
          <SoftCard padding={14}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <CoinIcon size={48} />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: '#64748B',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  Kazandığın altın
                </div>
                <div
                  style={{
                    fontFamily: tokens.tokens.font.display,
                    fontWeight: 900,
                    fontSize: 36,
                    color: '#B45309',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  +{reward}
                </div>
              </div>
              <div
                style={{
                  fontFamily: tokens.tokens.font.display,
                  fontWeight: 800,
                  fontSize: 22,
                  color: '#92400E',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {coins}
              </div>
            </div>
          </SoftCard>
        </div>

        {/* Avatar with sparkles */}
        {profile?.avatarKey && (
          <div
            style={{
              position: 'relative',
              marginTop: 22,
              marginBottom: 22,
              animation: 'm4k-bounce-loop 2s ease-in-out infinite',
            }}
          >
            <div
              style={{
                width: 110,
                height: 110,
                borderRadius: 999,
                background: c.accentSoft,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CharacterAvatar avatarKey={profile.avatarKey} size="lg" />
            </div>
            <div style={{ position: 'absolute', top: -8, right: -8 }}>
              <Sparkle size={20} color="#FACC15" />
            </div>
            <div style={{ position: 'absolute', bottom: -4, left: -10 }}>
              <Sparkle size={16} color={c.accent} />
            </div>
            <div style={{ position: 'absolute', top: 8, left: -16 }}>
              <Sparkle size={14} color="#F472B6" />
            </div>
          </div>
        )}

        <div style={{ flex: 1 }} />

        {/* CTAs */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {nextUnlocked && next ? (
            <ChunkyButton
              variant="primary"
              size="xl"
              fullWidth
              onClick={() => void navigate(`/lesson/${next.id}`)}
            >
              Devam et →
            </ChunkyButton>
          ) : (
            <ChunkyButton
              variant="primary"
              size="xl"
              fullWidth
              onClick={() => void navigate('/map')}
            >
              🏠 Haritaya dön
            </ChunkyButton>
          )}
          <button
            type="button"
            onClick={() => void navigate(`/lesson/${levelId}/practice`)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontFamily: tokens.tokens.font.display,
              fontWeight: 700,
              fontSize: 16,
              color: c.accentDark,
              padding: '12px 0',
            }}
          >
            Tekrar oyna
          </button>
        </div>
      </div>
    </PageBg>
  );
}
