import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../themes/ThemeProvider';
import { AppHeader, PageBg, KitLevelNode } from '../ui';
import {
  getLevelsForTrackAndDifficulty,
  isUnlocked,
  FINAL_LEVEL_ID,
} from '../engines/curriculum';
import type { LevelDescriptor, TrackId } from '../engines/types';
import type { LevelProgress } from '../state/types';
import { useProgressStore } from '../state/progressStore';
import { useRewardStore } from '../state/rewardStore';
import { useProfileStore } from '../state/profileStore';
import { useSettingsStore } from '../state/settingsStore';
import { useAudio } from '../audio/AudioProvider';
import { DEFAULT_DIFFICULTY } from '../engines/difficulty';
import type { LevelNodeState } from '../ui/kit';

function isTrackId(s: string | undefined): s is TrackId {
  return s === 'numbers' || s === 'operations';
}

function currentLevelInTier(
  levels: LevelDescriptor[],
  progress: Record<number, LevelProgress | undefined>
): number | null {
  for (const lvl of levels) {
    const stars = progress[lvl.id]?.bestStars ?? 0;
    if (stars < 3) return lvl.id;
  }
  return null;
}

const TRACK_TITLE: Record<TrackId, string> = {
  numbers: 'Sayılar',
  operations: 'İşlemler',
};

const TRACK_GLYPH: Record<TrackId, string> = {
  numbers: '123',
  operations: '+−',
};

interface SectionBannerProps {
  label: string;
  hint?: string;
  state: 'completed' | 'current' | 'locked';
  accent: string;
}

function SectionBanner({ label, hint, state, accent }: SectionBannerProps) {
  const icon =
    state === 'completed' ? (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 12 L10 17 L19 7"
          stroke="#fff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ) : state === 'locked' ? (
      '🔒'
    ) : (
      '▶'
    );
  const bg =
    state === 'completed'
      ? '#22C55E'
      : state === 'current'
        ? accent
        : '#CBD5E1';
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 14px',
        background: 'rgba(255,255,255,0.7)',
        borderRadius: 999,
      }}
    >
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: 999,
          background: bg,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: state === 'completed' ? 0 : 14,
        }}
      >
        {icon}
      </div>
      <span style={{ fontWeight: 800, fontSize: 14, color: '#0F172A' }}>
        {label}
      </span>
      {hint && (
        <span
          style={{
            marginLeft: 'auto',
            fontWeight: 700,
            fontSize: 12,
            color: '#64748B',
          }}
        >
          {hint}
        </span>
      )}
    </div>
  );
}

export function Map() {
  const navigate = useNavigate();
  const { trackId: rawTrackId } = useParams<{ trackId: string }>();
  const trackId: TrackId = isTrackId(rawTrackId) ? rawTrackId : 'numbers';
  const { tokens } = useTheme();
  const { t: tl } = useTranslation('lesson');
  const language = useSettingsStore((s) => s.language);
  const audio = useAudio();
  const progress = useProgressStore((s) => s.levels);
  const coins = useRewardStore((s) => s.coins);
  const profile = useProfileStore((s) =>
    s.profiles.find((p) => p.id === s.activeProfileId)
  );

  const difficulty = profile?.difficulty ?? DEFAULT_DIFFICULTY;
  const tierLevels = getLevelsForTrackAndDifficulty(trackId, difficulty);
  const currentId = currentLevelInTier(tierLevels, progress);
  const totalStars = tierLevels.reduce(
    (sum, l) => sum + (progress[l.id]?.bestStars ?? 0),
    0
  );

  useEffect(() => {
    if (currentId !== null) {
      audio.speak(tl(`levelTitles.${currentId}`), language);
    }
    return () => {
      audio.stopSpeaking();
    };
  }, [audio, language, tl, currentId]);

  const c = tokens.tokens.color;

  // Split into two "sections" of half-tier each for the banners.
  const mid = Math.ceil(tierLevels.length / 2);
  const section1 = tierLevels.slice(0, mid);
  const section2 = tierLevels.slice(mid);

  const section1Complete = section1.every(
    (l) => (progress[l.id]?.bestStars ?? 0) === 3
  );
  const section2Complete = section2.every(
    (l) => (progress[l.id]?.bestStars ?? 0) === 3
  );
  const section1State: 'completed' | 'current' | 'locked' = section1Complete
    ? 'completed'
    : 'current';
  const section2State: 'completed' | 'current' | 'locked' = section2Complete
    ? 'completed'
    : section1Complete
      ? 'current'
      : 'locked';

  return (
    <PageBg>
      <AppHeader
        avatarKey={profile?.avatarKey}
        name={profile?.nickname}
        coins={coins}
        onAvatarTap={() => void navigate('/profile-picker')}
        onLockTap={() => void navigate('/parent/gate')}
        showBack
        onBack={() => void navigate('/map')}
      />
      <div style={{ padding: '6px 22px 0' }}>
        {/* Track title bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginTop: 12,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: `linear-gradient(135deg, ${c.accent} 0%, ${c.accentDark} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontFamily: tokens.tokens.font.display,
              fontWeight: 900,
              fontSize: 20,
              boxShadow: 'inset 0 -4px 0 rgba(0,0,0,0.18)',
            }}
          >
            {TRACK_GLYPH[trackId]}
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: tokens.tokens.font.display,
                fontWeight: 800,
                fontSize: 22,
                color: '#0F172A',
                lineHeight: 1.1,
              }}
            >
              {TRACK_TITLE[trackId]}
            </div>
            <div
              style={{
                fontFamily: tokens.tokens.font.body,
                fontSize: 12,
                fontWeight: 600,
                color: '#64748B',
                marginTop: 2,
              }}
            >
              {difficulty === 'easy'
                ? 'Kolay · 0–9 arası'
                : difficulty === 'medium'
                  ? 'Orta · 2 basamak'
                  : 'Zor · 3 basamak'}
            </div>
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              background: '#FEF3C7',
              color: '#92400E',
              padding: '4px 10px',
              borderRadius: 999,
              fontWeight: 800,
              fontSize: 14,
            }}
          >
            <span aria-hidden="true">⭐</span>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>
              {totalStars}
            </span>
          </div>
        </div>

        {/* Section 1 */}
        <div style={{ marginBottom: 14 }}>
          <SectionBanner
            label={`1. Bölüm · ${section1.length} seviye`}
            hint={section1Complete ? 'Tamamlandı' : 'Devam ediyor'}
            state={section1State}
            accent={c.accent}
          />
          <div
            style={{
              marginTop: 14,
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 18,
              justifyItems: 'center',
            }}
          >
            {section1.map((lvl) => {
              const stars: 0 | 1 | 2 | 3 = progress[lvl.id]?.bestStars ?? 0;
              const completed = stars === 3;
              const unlocked = isUnlocked(progress, lvl.id);
              const isCurrent =
                lvl.id === currentId && unlocked && !completed;
              const state: LevelNodeState = completed
                ? 'done'
                : isCurrent
                  ? 'current'
                  : unlocked
                    ? 'available'
                    : 'locked';
              return (
                <KitLevelNode
                  key={lvl.id}
                  n={lvl.id}
                  state={state}
                  stars={stars}
                  ariaLabel={`Level ${lvl.id} — ${state}, ${stars} of 3 stars${lvl.id === FINAL_LEVEL_ID ? ' (final challenge)' : ''}`}
                  onSelect={() => void navigate(`/lesson/${lvl.id}`)}
                />
              );
            })}
          </div>
        </div>

        {/* Section 2 */}
        {section2.length > 0 && (
          <div>
            <SectionBanner
              label={`2. Bölüm · ${section2.length} seviye`}
              hint={
                section2State === 'completed'
                  ? 'Tamamlandı'
                  : section2State === 'locked'
                    ? '1. Bölüm gerekli'
                    : 'Devam ediyor'
              }
              state={section2State}
              accent={c.accent}
            />
            <div
              style={{
                marginTop: 14,
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 18,
                justifyItems: 'center',
              }}
            >
              {section2.map((lvl) => {
                const stars: 0 | 1 | 2 | 3 = progress[lvl.id]?.bestStars ?? 0;
                const completed = stars === 3;
                const unlocked = isUnlocked(progress, lvl.id);
                const isCurrent =
                  lvl.id === currentId && unlocked && !completed;
                const state: LevelNodeState = completed
                  ? 'done'
                  : isCurrent
                    ? 'current'
                    : unlocked
                      ? 'available'
                      : 'locked';
                return (
                  <KitLevelNode
                    key={lvl.id}
                    n={lvl.id}
                    state={state}
                    stars={stars}
                    ariaLabel={`Level ${lvl.id} — ${state}, ${stars} of 3 stars${lvl.id === FINAL_LEVEL_ID ? ' (final challenge)' : ''}`}
                    onSelect={() => void navigate(`/lesson/${lvl.id}`)}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </PageBg>
  );
}
