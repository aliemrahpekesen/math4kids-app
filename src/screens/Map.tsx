import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, LevelNode, CoinBadge, CharacterAvatar } from '../ui';
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

  // Speak the current-level cue on entry so the child knows where to tap.
  useEffect(() => {
    if (currentId !== null) {
      audio.speak(tl(`levelTitles.${currentId}`), language);
    }
    return () => {
      audio.stopSpeaking();
    };
  }, [audio, language, tl, currentId]);

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

      <div className="w-full max-w-md flex justify-start items-center mb-3 px-2">
        <button
          type="button"
          onClick={() => void navigate('/map')}
          className="min-w-touch min-h-touch px-3 rounded-soft bg-surface/60 text-fg text-2xl font-display"
          aria-label={tl('pickPathBack')}
        >
          ←
        </button>
      </div>

      <Card className="w-full max-w-md mb-4" data-track={trackId}>
        {tierLevels.length === 0 ? (
          <p className="text-center py-6 text-4xl" aria-label={tl('noLevelsForTier')}>
            🚧
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

      <div className="mt-2 flex gap-3">
        <button
          type="button"
          onClick={() => void navigate('/leaderboard')}
          className="w-touch h-touch rounded-soft bg-surface/60 text-2xl"
          aria-label="leaderboard"
        >
          🏆
        </button>
        <button
          type="button"
          onClick={() => void navigate('/rewards')}
          className="w-touch h-touch rounded-soft bg-surface/60 text-2xl"
          aria-label="rewards"
        >
          🎁
        </button>
      </div>
    </main>
  );
}
