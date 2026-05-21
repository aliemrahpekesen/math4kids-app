import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { buildQuiz, score } from '../engines/quiz';
import { ExerciseRunner } from './ExerciseRunner';
import { Toast, ProgressBar } from '../ui';
import { useSessionStore } from '../state/sessionStore';
import { useProgressStore } from '../state/progressStore';
import { useRewardStore } from '../state/rewardStore';
import { useProfileStore } from '../state/profileStore';
import { repos } from '../repos';
import { awardForStars } from '../engines/reward';

export function LessonQuiz() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('lesson');
  const levelId = Number(id ?? 1);

  const session = useSessionStore();
  const profileId = useProfileStore((s) => s.activeProfileId);
  const recordResult = useProgressStore((s) => s.recordResult);
  const awardStars = useRewardStore((s) => s.awardForStars);
  const earnBadge = useRewardStore((s) => s.earnBadge);
  const unlockChest = useRewardStore((s) => s.unlockChest);

  const seed = useMemo(() => 9000 + levelId, [levelId]);
  const quiz = useMemo(() => buildQuiz(levelId, seed), [levelId, seed]);

  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const done = index >= quiz.items.length;

  useEffect(() => {
    if (!done) return;
    const answers = session.lessonAnswers;
    const result = score(answers, session.lessonHintsUsed);
    const elapsedMs = session.lessonStartedAt
      ? Date.now() - session.lessonStartedAt
      : 0;

    // Persist via repos asynchronously.
    void (async () => {
      const { stars } = recordResult({
        levelId,
        accuracy: result.accuracy,
        hintsUsed: session.lessonHintsUsed,
        elapsedMs,
      });
      const delta = awardForStars(stars, levelId);
      awardStars(stars);
      if (delta.badge) earnBadge(delta.badge);
      if (delta.chest) unlockChest(delta.chest);

      if (profileId) {
        const progressSnap = useProgressStore.getState();
        await repos.progress.save(profileId, {
          levels: progressSnap.levels,
          currentLevelId: progressSnap.currentLevelId,
          streaks: progressSnap.streaks,
        });
        const rewardSnap = useRewardStore.getState();
        await repos.reward.save(profileId, {
          coins: rewardSnap.coins,
          badges: rewardSnap.badges,
          chestUnlockedKeys: rewardSnap.chestUnlockedKeys,
        });
      }

      await navigate(`/lesson/${levelId}/result`);
    })();
  }, [
    done,
    levelId,
    navigate,
    profileId,
    recordResult,
    awardStars,
    earnBadge,
    unlockChest,
    session.lessonAnswers,
    session.lessonHintsUsed,
    session.lessonStartedAt,
  ]);

  const currentExercise = quiz.items[index];

  if (!currentExercise || done) {
    return (
      <main className="app-shell">
        <p className="text-fg/80 font-display">{t('complete')}</p>
      </main>
    );
  }

  const onAnswer = (correct: boolean) => {
    session.recordAnswer(correct);
    setFeedback(correct ? 'correct' : 'wrong');
    setTimeout(() => {
      setFeedback(null);
      setIndex((i) => i + 1);
    }, 700);
  };

  return (
    <>
      <div className="px-6 pt-4">
        <ProgressBar
          value={index}
          max={quiz.items.length}
          label="quiz progress"
        />
        <div className="text-fg/60 text-sm mt-1 text-center">
          {index + 1} / {quiz.items.length}
        </div>
      </div>
      <ExerciseRunner
        exercise={currentExercise}
        onAnswer={onAnswer}
        hintsUsed={session.lessonHintsUsed}
      />
      <Toast
        open={feedback !== null}
        onDismiss={() => setFeedback(null)}
        variant={feedback === 'correct' ? 'success' : 'warning'}
        durationMs={700}
      >
        {feedback === 'correct' ? t('correct') : t('tryAgain')}
      </Toast>
    </>
  );
}
