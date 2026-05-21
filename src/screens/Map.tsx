import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Card, LevelNode, CoinBadge, CharacterAvatar } from '../ui';
import {
  getLevelsForTrackAndDifficulty,
  getTracks,
  isUnlocked,
  FINAL_LEVEL_ID,
} from '../engines/curriculum';
import type { LevelDescriptor, TrackId } from '../engines/types';
import type { LevelProgress } from '../state/types';
import { useProgressStore } from '../state/progressStore';
import { useRewardStore } from '../state/rewardStore';
import { useProfileStore } from '../state/profileStore';
import { DEFAULT_DIFFICULTY } from '../engines/difficulty';
import type { LevelNodeState } from '../ui/LevelNode';

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

export function Map() {
  const navigate = useNavigate();
  const { trackId: rawTrackId } = useParams<{ trackId: string }>();
  const trackId: TrackId = isTrackId(rawTrackId) ? rawTrackId : 'numbers';
  const { t } = useTranslation('common');
  const { t: tl } = useTranslation('lesson');
  const { t: tp } = useTranslation('parent');
  const progress = useProgressStore((s) => s.levels);
  const coins = useRewardStore((s) => s.coins);
  const profile = useProfileStore((s) =>
    s.profiles.find((p) => p.id === s.activeProfileId)
  );

  const difficulty = profile?.difficulty ?? DEFAULT_DIFFICULTY;
  const tierLevels = getLevelsForTrackAndDifficulty(trackId, difficulty);
  const trackLabel = tl(
    getTracks().find((tr) => tr.id === trackId)?.labelKey ?? `tracks.${trackId}`
  );
  const currentId = currentLevelInTier(tierLevels, progress);

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

      <div className="w-full max-w-md flex justify-between items-center mb-3 px-2">
        <Button variant="ghost" onClick={() => void navigate('/map')}>
          ← {tl('pickPathBack')}
        </Button>
        <span className="font-display text-fg/70 text-sm">
          {tp(`difficulty.${difficulty}`)}
        </span>
      </div>

      <Card className="w-full max-w-md mb-4" data-track={trackId}>
        <h2 className="font-display text-xl text-primary-fg text-center mb-3">
          {trackLabel}
        </h2>
        {tierLevels.length === 0 ? (
          <p className="text-fg/60 text-center py-6">
            {tl('noLevelsForTier')}
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-4 justify-items-center">
            {tierLevels.map((lvl) => {
              const stars: 0 | 1 | 2 | 3 = progress[lvl.id]?.bestStars ?? 0;
              const completed = stars === 3;
              const unlocked = isUnlocked(progress, lvl.id);
              const isCurrent =
                lvl.id === currentId && unlocked && !completed;
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
                  onSelect={() => goLesson(lvl.id)}
                />
              );
            })}
          </div>
        )}
      </Card>

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
