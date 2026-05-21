import type { Quiz, QuizScore } from './types';
import { generateBatch } from './exercise';

const QUIZ_LENGTH = 6;

export function buildQuiz(levelId: number, seed: number): Quiz {
  const items = generateBatch(levelId, seed, QUIZ_LENGTH);
  return { levelId, seed, items };
}

/**
 * Score a set of answers and compute stars per the balanced rubric.
 * Locked in T-024 / ADR-0008: 3★ = ≥85% AND hints ≤ 1; 2★ = ≥70%; 1★ = any.
 */
export function score(
  answers: { correct: boolean }[],
  hintsUsed: number
): QuizScore {
  const total = answers.length;
  const correct = answers.filter((a) => a.correct).length;
  const accuracy = total > 0 ? correct / total : 0;
  let stars: 0 | 1 | 2 | 3;
  if (accuracy >= 0.85 && hintsUsed <= 1) stars = 3;
  else if (accuracy >= 0.7) stars = 2;
  else if (accuracy > 0) stars = 1;
  else stars = 0;
  return { accuracy, correct, total, stars };
}
