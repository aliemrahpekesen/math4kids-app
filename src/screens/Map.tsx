import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, LevelNode, CoinBadge, CharacterAvatar } from '../ui';
import {
  getLevelsByTrack,
  getTracks,
  isUnlocked,
  FINAL_LEVEL_ID,
} from '../engines/curriculum';
import type { LevelDescriptor, TrackId } from '../engines/types';
import type { LevelProgress } from '../state/types';
import { useProgressStore } from '../state/progressStore';
import { useRewardStore } from '../state/rewardStore';
import { useProfileStore } from '../state/profileStore';
import type { LevelNodeState } from '../ui/LevelNode';

interface TrackSectionProps {
  trackId: TrackId;
  label: string;
  levels: LevelDescriptor[];
  progress: Record<number, LevelProgress | undefined>;
  onSelect: (levelId: number) => void;
}

function currentLevelInTrack(
  levels: LevelDescriptor[],
  progress: Record<number, LevelProgress | undefined>
): number | null {
  for (const lvl of levels) {
    const stars = progress[lvl.id]?.bestStars ?? 0;
    if (stars < 3) return lvl.id;
  }
  return null;
}

function TrackSection({
  trackId,
  label,
  levels,
  progress,
  onSelect,
}: TrackSectionProps) {
  const currentId = currentLevelInTrack(levels, progress);
  return (
    <Card className="w-full max-w-md mb-4" data-track={trackId}>
      <h2 className="font-display text-lg text-primary-fg text-center mb-3">
        {label}
      </h2>
      <div className="grid grid-cols-3 gap-4 justify-items-center">
        {levels.map((lvl) => {
          const stars: 0 | 1 | 2 | 3 = progress[lvl.id]?.bestStars ?? 0;
          const completed = stars === 3;
          const unlocked = isUnlocked(progress, lvl.id);
          const isCurrent = lvl.id === currentId && unlocked && !completed;
          const state: LevelNodeState = completed
            ? 'completed'
            : isCurrent
              ? 'current'
              : unlocked
                ? 'available'
                : 'locked';
          return (
            <LevelNode
              key={lvl.id}
              levelId={lvl.id}
              state={state}
              stars={stars}
              isFinal={lvl.id === FINAL_LEVEL_ID}
              onSelect={() => onSelect(lvl.id)}
            />
          );
        })}
      </div>
    </Card>
  );
}

export function Map() {
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const { t: tl } = useTranslation('lesson');
  const tracks = getTracks();
  const progress = useProgressStore((s) => s.levels);
  const coins = useRewardStore((s) => s.coins);
  const profile = useProfileStore((s) =>
    s.profiles.find((p) => p.id === s.activeProfileId)
  );

  const goLesson = (levelId: number) => {
    void navigate(`/lesson/${levelId}`);
  };

  return (
    <main className="app-shell !justify-start !pt-6 !pb-12">
      <div className="w-full max-w-md flex items-center justify-between mb-4 px-2">
        {profile ? (
          <button
            type="button"
            onClick={() => void navigate('/profile-picker')}
            className="flex items-center gap-2 min-h-touch px-2"
            aria-label={profile.nickname}
          >
            <CharacterAvatar avatarKey={profile.avatarKey} size="sm" />
            <span className="font-display">{profile.nickname}</span>
          </button>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-3">
          <CoinBadge count={coins} />
          <button
            type="button"
            onClick={() => void navigate('/parent/gate')}
            className="min-w-touch min-h-touch px-3 rounded-soft bg-surface/60 text-fg"
            aria-label={t('parent')}
          >
            🔒
          </button>
        </div>
      </div>

      {tracks
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((tr) => (
          <TrackSection
            key={tr.id}
            trackId={tr.id}
            label={tl(tr.labelKey)}
            levels={getLevelsByTrack(tr.id)}
            progress={progress}
            onSelect={goLesson}
          />
        ))}

      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={() => void navigate('/leaderboard')}
          className="px-4 py-2 rounded-soft bg-surface/60 text-fg font-display min-h-touch"
        >
          🏆
        </button>
        <button
          type="button"
          onClick={() => void navigate('/rewards')}
          className="px-4 py-2 rounded-soft bg-surface/60 text-fg font-display min-h-touch"
        >
          🎁
        </button>
      </div>
    </main>
  );
}
