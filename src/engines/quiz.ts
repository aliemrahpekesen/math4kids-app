import type { Quiz, QuizScore } from './types';
import type { Difficulty } from '../state/types';
import { generateBatch } from './exercise';
import {
  getDifficultyProfile,
  scoreStars,
  DEFAULT_DIFFICULTY,
} from './difficulty';

export function buildQuiz(
  levelId: number,
  seed: number,
  difficulty: Difficulty = DEFAULT_DIFFICULTY
): Quiz {
  const items = generateBatch(
    levelId,
    seed,
    getDifficultyProfile(difficulty).quizLength
  );
  return { levelId, seed, items };
}

/**
 * Score a set of answers and compute stars per the active difficulty profile.
 *
 *  - **easy**:   3★ = ≥70% (≤3 hints); 2★ = ≥50%; 1★ = any
 *  - **medium**: 3★ = ≥85% AND ≤1 hint; 2★ = ≥70%; 1★ = any  (original v1 rubric)
 *  - **hard**:   3★ = ≥95% AND no hints; 2★ = ≥80%; 1★ = any
 */
export function score(
  answers: { correct: boolean }[],
  hintsUsed: number,
  difficulty: Difficulty = DEFAULT_DIFFICULTY
): QuizScore {
  const total = answers.length;
  const correct = answers.filter((a) => a.correct).length;
  const accuracy = total > 0 ? correct / total : 0;
  const stars = scoreStars(accuracy, hintsUsed, difficulty);
  return { accuracy, correct, total, stars };
}
