import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../themes/ThemeProvider';
import {
  AppHeader,
  PageBg,
} from '../ui';
import { useRewardStore } from '../state/rewardStore';
import { useProfileStore } from '../state/profileStore';
import { useSettingsStore } from '../state/settingsStore';
import { useAudio } from '../audio/AudioProvider';
import { useProgressStore } from '../state/progressStore';
import {
  getLevelsForTrackAndDifficulty,
} from '../engines/curriculum';
import { DEFAULT_DIFFICULTY } from '../engines/difficulty';
import type { TrackId } from '../engines/types';

interface TrackCardProps {
  trackId: TrackId;
  title: string;
  glyph: string;
  badge?: string;
  badgeColor?: { bg: string; fg: string };
  hint?: string;
  locked?: boolean;
  progress?: number;
  gradient: { from: string; to: string };
  onTap?: () => void;
}

function TrackCard({
  title,
  glyph,
  badge,
  badgeColor,
  hint,
  locked = false,
  progress = 0,
  gradient,
  onTap,
}: TrackCardProps) {
  const { tokens } = useTheme();
  const c = tokens.tokens.color;
  return (
    <button
      type="button"
      onClick={locked ? undefined : onTap}
      disabled={locked}
      aria-label={title}
      style={{
        appearance: 'none',
        cursor: locked ? 'not-allowed' : 'pointer',
        background: '#fff',
        border: `2px solid ${locked ? 'transparent' : c.accent}`,
        borderRadius: 28,
        padding: 18,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        textAlign: 'left',
        boxShadow: locked
          ? '0 2px 0 rgba(0,0,0,0.03), 0 6px 14px rgba(0,0,0,0.05)'
          : `inset 0 -6px 0 ${c.accentSoft}, 0 4px 0 rgba(0,0,0,0.06), 0 10px 24px rgba(0,0,0,0.08)`,
        opacity: locked ? 0.85 : 1,
        width: '100%',
        transition: 'transform .08s',
      }}
    >
      <div
        style={{
          width: 78,
          height: 78,
          borderRadius: 20,
          background: `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontFamily: tokens.tokens.font.display,
          fontWeight: 900,
          fontSize: 36,
          flexShrink: 0,
          boxShadow: 'inset 0 -5px 0 rgba(0,0,0,0.18)',
        }}
      >
        {glyph}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              fontFamily: tokens.tokens.font.display,
              fontSize: 22,
              fontWeight: 800,
              color: '#0F172A',
              lineHeight: 1.1,
            }}
          >
            {title}
          </span>
          {badge && badgeColor && (
            <span
              style={{
                background: badgeColor.bg,
                color: badgeColor.fg,
                fontSize: 11,
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: 999,
                letterSpacing: '0.04em',
              }}
            >
              {badge}
            </span>
          )}
        </div>
        {hint && (
          <div
            style={{
              marginTop: 6,
              fontFamily: tokens.tokens.font.body,
              fontSize: 13,
              fontWeight: 600,
              color: '#94A3B8',
            }}
          >
            {hint}
          </div>
        )}
        {!locked && (
          <div
            style={{
              marginTop: 10,
              height: 8,
              background: '#F1F5F9',
              borderRadius: 999,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${Math.max(0, Math.min(1, progress)) * 100}%`,
                height: '100%',
                background: c.accent,
                borderRadius: 999,
              }}
            />
          </div>
        )}
      </div>
      <span
        aria-hidden="true"
        style={{
          fontSize: 28,
          color: locked ? '#CBD5E1' : c.accent,
          fontFamily: tokens.tokens.font.display,
          fontWeight: 900,
        }}
      >
        {locked ? '🔒' : '›'}
      </span>
    </button>
  );
}

function BottomTabs({
  active,
  onLearn,
  onStars,
  onRewards,
}: {
  active: 'learn' | 'stars' | 'rewards';
  onLearn?: () => void;
  onStars?: () => void;
  onRewards?: () => void;
}) {
  const { tokens } = useTheme();
  const c = tokens.tokens.color;
  const tabs: { key: 'learn' | 'stars' | 'rewards'; icon: string; onTap?: () => void }[] = [
    { key: 'learn', icon: '🎯', onTap: onLearn },
    { key: 'stars', icon: '⭐', onTap: onStars },
    { key: 'rewards', icon: '🎁', onTap: onRewards },
  ];
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 6,
        background: '#fff',
        borderRadius: 24,
        padding: '12px 6px',
        boxShadow: '0 4px 0 rgba(0,0,0,0.04), 0 10px 24px rgba(0,0,0,0.06)',
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={tab.onTap}
            aria-label={tab.key}
            style={{
              appearance: 'none',
              cursor: 'pointer',
              background: isActive ? c.accentSoft : 'transparent',
              border: 'none',
              borderRadius: 16,
              padding: '10px 6px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              color: isActive ? c.accentDark : '#94A3B8',
              fontFamily: tokens.tokens.font.display,
              fontWeight: 800,
              fontSize: 13,
            }}
          >
            <span style={{ fontSize: 22 }} aria-hidden="true">
              {tab.icon}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function TrackPicker() {
  const navigate = useNavigate();
  const { tokens } = useTheme();
  const { t: tl } = useTranslation('lesson');
  const coins = useRewardStore((s) => s.coins);
  const language = useSettingsStore((s) => s.language);
  const audio = useAudio();
  const profile = useProfileStore((s) =>
    s.profiles.find((p) => p.id === s.activeProfileId)
  );
  const progress = useProgressStore((s) => s.levels);

  const difficulty = profile?.difficulty ?? DEFAULT_DIFFICULTY;
  const numbersLevels = getLevelsForTrackAndDifficulty('numbers', difficulty);
  const opsLevels = getLevelsForTrackAndDifficulty('operations', difficulty);

  const completedNumbers = numbersLevels.filter(
    (l) => (progress[l.id]?.bestStars ?? 0) === 3
  ).length;
  const numbersProgress =
    numbersLevels.length > 0 ? completedNumbers / numbersLevels.length : 0;
  const opsLocked = numbersProgress < 1;

  useEffect(() => {
    audio.speak(tl('pickYourPath'), language);
    return () => {
      audio.stopSpeaking();
    };
  }, [audio, language, tl]);

  return (
    <PageBg>
      <AppHeader
        avatarKey={profile?.avatarKey}
        name={profile?.nickname}
        coins={coins}
        onAvatarTap={() => void navigate('/profile-picker')}
        onLockTap={() => void navigate('/parent/gate')}
      />
      <div style={{ padding: '6px 22px 0', display: 'flex', flexDirection: 'column', minHeight: 'calc(100dvh - 68px)' }}>
        <div style={{ marginTop: 12, marginBottom: 8 }}>
          <div
            style={{
              fontFamily: tokens.tokens.font.display,
              fontSize: 28,
              fontWeight: 800,
              color: '#0F172A',
              lineHeight: 1.1,
            }}
          >
            {profile ? `Merhaba ${profile.nickname}! 👋` : 'Merhaba! 👋'}
          </div>
          <div
            style={{
              marginTop: 6,
              fontFamily: tokens.tokens.font.body,
              fontSize: 15,
              fontWeight: 600,
              color: '#64748B',
            }}
          >
            Bugün ne öğrenmek istersin?
          </div>
        </div>

        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <TrackCard
            trackId="numbers"
            title="Sayılar"
            glyph="123"
            badge={completedNumbers === 0 ? 'YENİ' : undefined}
            badgeColor={{ bg: '#DCFCE7', fg: '#15803D' }}
            hint={`0–9 arasında • ${completedNumbers}/${numbersLevels.length} tamamlandı`}
            progress={numbersProgress}
            gradient={{
              from: tokens.tokens.color.accent,
              to: tokens.tokens.color.accentDark,
            }}
            onTap={() => void navigate('/map/numbers')}
          />
          <TrackCard
            trackId="operations"
            title="İşlemler"
            glyph="+−"
            locked={opsLocked}
            hint={
              opsLocked
                ? 'Sayılar bittiğinde açılacak'
                : `${opsLevels.length} bölüm hazır`
            }
            progress={
              opsLevels.length > 0
                ? opsLevels.filter(
                    (l) => (progress[l.id]?.bestStars ?? 0) === 3
                  ).length / opsLevels.length
                : 0
            }
            gradient={{
              from: tokens.tokens.color.secondary,
              to: '#B45309',
            }}
            onTap={opsLocked ? undefined : () => void navigate('/map/operations')}
          />
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ paddingBottom: 24 }}>
          <BottomTabs
            active="learn"
            onLearn={() => void navigate('/map')}
            onStars={() => void navigate('/leaderboard')}
            onRewards={() => void navigate('/rewards')}
          />
        </div>
      </div>
    </PageBg>
  );
}
