import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, StarRow, CoinBadge } from '../ui';
import { useProgressStore } from '../state/progressStore';
import { useRewardStore } from '../state/rewardStore';
import { getNextLevel, isUnlocked } from '../engines/curriculum';
import { useAudio } from '../audio/AudioProvider';
import { useSettingsStore } from '../state/settingsStore';

export function LessonResult() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('lesson');
  const language = useSettingsStore((s) => s.language);
  const audio = useAudio();
  const levelId = Number(id ?? 1);
  const progress = useProgressStore((s) => s.levels);
  const coins = useRewardStore((s) => s.coins);
  const current = progress[levelId];
  const stars = current?.bestStars ?? 0;
  const next = getNextLevel(levelId);
  const nextUnlocked = next ? isUnlocked(progress, next.id) : false;

  // Sensory feedback — celebrate or encourage via audio.
  useEffect(() => {
    const message =
      stars === 3
        ? t('narration.celebrationPerfect')
        : stars === 2
          ? t('narration.celebrationGreat')
          : t('narration.tryAgainSoft');
    audio.speak(message, language);
    return () => {
      audio.stopSpeaking();
    };
  }, [stars, audio, language, t]);

  return (
    <main className="app-shell">
      <Card className="max-w-md w-full text-center">
        <div className="text-7xl mb-4" aria-hidden="true">
          {stars === 3 ? '🎉' : stars === 2 ? '✨' : '🌱'}
        </div>
        <StarRow stars={stars} size="lg" className="my-6" />
        <CoinBadge count={coins} className="mb-8 mx-auto" />

        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={() => void navigate('/map')}
            aria-label={t('backToMap')}
            className="w-touch h-touch rounded-soft bg-surface/60 text-3xl"
          >
            🏠
          </button>
          {nextUnlocked && next && (
            <button
              type="button"
              onClick={() => void navigate(`/lesson/${next.id}`)}
              aria-label={t('nextLevelUnlocked')}
              className="w-touch h-touch rounded-full bg-accent text-accent-fg text-3xl shadow-glow"
            >
              ▶
            </button>
          )}
        </div>
      </Card>
    </main>
  );
}
