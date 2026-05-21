import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, LevelNode, CoinBadge, CharacterAvatar } from '../ui';
import { getCurriculum, isUnlocked } from '../engines/curriculum';
import { useProgressStore } from '../state/progressStore';
import { useRewardStore } from '../state/rewardStore';
import { useProfileStore } from '../state/profileStore';
import type { LevelNodeState } from '../ui/LevelNode';

export function Map() {
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const levels = getCurriculum();
  const progress = useProgressStore((s) => s.levels);
  const coins = useRewardStore((s) => s.coins);
  const profile = useProfileStore((s) =>
    s.profiles.find((p) => p.id === s.activeProfileId)
  );

  const currentLevelId = (() => {
    // First locked (or last completed + 1) — the "active" pulsing node.
    for (const lvl of levels) {
      const prog = progress[lvl.id];
      if ((prog?.bestStars ?? 0) < 3) return lvl.id;
    }
    return levels[levels.length - 1]?.id ?? 1;
  })();

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

      <Card className="w-full max-w-md">
        <h1 className="font-display text-2xl text-primary-fg text-center mb-4">
          {t('map')}
        </h1>
        <div className="grid grid-cols-3 gap-4 justify-items-center">
          {levels.map((lvl) => {
            const prog = progress[lvl.id];
            const stars: 0 | 1 | 2 | 3 = prog?.bestStars ?? 0;
            const completed = stars === 3;
            const unlocked = isUnlocked(progress, lvl.id);
            const isCurrent =
              lvl.id === currentLevelId && unlocked && !completed;
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
                isFinal={lvl.id === 17}
                onSelect={() => goLesson(lvl.id)}
              />
            );
          })}
        </div>
      </Card>

      <div className="mt-4 flex gap-2">
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
