import type { Difficulty } from '../state/types';

/**
 * Difficulty profile: feeds quiz length, hint allowance, and the star rubric.
 *
 * Locked rubric per `medium` (the original v1 rubric):
 *  3★ = ≥85% accuracy AND hintsUsed ≤ 1
 *  2★ = ≥70% accuracy
 *  1★ = any non-zero accuracy
 *  0★ = zero correct
 *
 * Easy relaxes the accuracy bar (3★ at 70%, 2★ at 50%) and allows up to
 * 3 hints without penalty. Hard tightens to "near-perfect with no hints"
 * for 3★ and bumps the quiz length so the rubric has more signal.
 */
export interface DifficultyProfile {
  quizLength: number;
  threeStarAccuracy: number;
  threeStarHintCap: number;
  twoStarAccuracy: number;
}

const PROFILES: Record<Difficulty, DifficultyProfile> = {
  easy: {
    quizLength: 4,
    threeStarAccuracy: 0.7,
    threeStarHintCap: 3,
    twoStarAccuracy: 0.5,
  },
  medium: {
    quizLength: 6,
    threeStarAccuracy: 0.85,
    threeStarHintCap: 1,
    twoStarAccuracy: 0.7,
  },
  hard: {
    quizLength: 8,
    threeStarAccuracy: 0.95,
    threeStarHintCap: 0,
    twoStarAccuracy: 0.8,
  },
};

export function getDifficultyProfile(d: Difficulty): DifficultyProfile {
  return PROFILES[d];
}

export function scoreStars(
  accuracy: number,
  hintsUsed: number,
  difficulty: Difficulty
): 0 | 1 | 2 | 3 {
  const p = PROFILES[difficulty];
  if (accuracy >= p.threeStarAccuracy && hintsUsed <= p.threeStarHintCap)
    return 3;
  if (accuracy >= p.twoStarAccuracy) return 2;
  if (accuracy > 0) return 1;
  return 0;
}

export const DEFAULT_DIFFICULTY: Difficulty = 'medium';
