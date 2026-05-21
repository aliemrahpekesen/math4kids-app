import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { generate } from '../engines/exercise';
import { ExerciseRunner } from './ExerciseRunner';
import { Toast } from '../ui';
import { useAudio } from '../audio/AudioProvider';

export function LessonPractice() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('lesson');
  const audio = useAudio();
  const levelId = Number(id ?? 1);
  const [round, setRound] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const seed = useMemo(() => 1000 + round, [round]);
  const exercise = useMemo(() => generate(levelId, seed, 0), [levelId, seed]);

  const onAnswer = (correct: boolean) => {
    audio.play(correct ? 'correct' : 'wrong');
    setFeedback(correct ? 'correct' : 'wrong');
    setTimeout(() => {
      setFeedback(null);
      setRound((r) => r + 1);
    }, 800);
  };

  return (
    <>
      <ExerciseRunner exercise={exercise} onAnswer={onAnswer} />
      <Toast
        open={feedback !== null}
        onDismiss={() => setFeedback(null)}
        variant={feedback === 'correct' ? 'success' : 'info'}
        durationMs={800}
      >
        <span className="text-3xl" aria-hidden="true">
          {feedback === 'correct' ? '✨' : '💪'}
        </span>
      </Toast>
      <div className="fixed top-4 right-4">
        <button
          type="button"
          onClick={() => void navigate(`/lesson/${levelId}/quiz`)}
          aria-label={t('startQuiz')}
          className="w-touch h-touch rounded-full bg-accent text-accent-fg text-3xl shadow-glow"
        >
          ▶
        </button>
      </div>
    </>
  );
}
