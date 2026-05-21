import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Card, StarRow, CoinBadge } from '../ui';
import { useProgressStore } from '../state/progressStore';
import { useRewardStore } from '../state/rewardStore';
import { getLevelById, getNextLevel, isUnlocked } from '../engines/curriculum';

export function LessonResult() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('lesson');
  const levelId = Number(id ?? 1);
  const progress = useProgressStore((s) => s.levels);
  const coins = useRewardStore((s) => s.coins);
  const current = progress[levelId];
  const stars = current?.bestStars ?? 0;
  const next = getNextLevel(levelId);
  const nextUnlocked = next ? isUnlocked(progress, next.id) : false;
  const level = getLevelById(levelId);

  const message =
    stars === 3
      ? t('narration.celebrationPerfect')
      : stars === 2
        ? t('narration.celebrationGreat')
        : t('narration.tryAgainSoft');

  return (
    <main className="app-shell">
      <Card className="max-w-md w-full text-center">
        <div className="text-6xl mb-4" aria-hidden="true">
          {stars === 3 ? '🎉' : stars === 2 ? '✨' : '🌱'}
        </div>
        <h1 className="font-display text-3xl text-primary-fg mb-2">
          {level ? t(`levelTitles.${levelId}`) : ''}
        </h1>
        <StarRow stars={stars} size="lg" className="my-4" />
        <p className="text-fg/80 mb-4">{message}</p>
        <p className="text-fg/70 mb-4">{t('earnedStars', { count: stars })}</p>
        <CoinBadge count={coins} className="mb-6" />

        {nextUnlocked && next ? (
          <Button
            variant="accent"
            onClick={() => void navigate(`/lesson/${next.id}`)}
            className="w-full mb-2"
          >
            {t('nextLevelUnlocked')}
          </Button>
        ) : stars < 3 ? (
          <p className="text-fg/70 text-sm mb-2">{t('needThreeStars')}</p>
        ) : null}

        <Button
          variant="ghost"
          onClick={() => void navigate('/map')}
          className="w-full"
        >
          {t('backToMap')}
        </Button>
      </Card>
    </main>
  );
}
