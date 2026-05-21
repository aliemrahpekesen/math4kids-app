import { describe, it, expect } from 'vitest';
import {
  getCurriculum,
  getLevelById,
  getLevelsForTrackAndDifficulty,
  getNextLevel,
  isUnlocked,
  FIRST_LEVEL_ID,
  FINAL_LEVEL_ID,
} from './curriculum';
import { generate, generateBatch } from './exercise';
import { buildQuiz, score } from './quiz';
import { awardForStars } from './reward';
import type { LevelProgress } from '../state/types';

describe('curriculum engine', () => {
  it('exposes all path.json levels in declaration order', () => {
    const levels = getCurriculum();
    // Tier sizes: numbers easy 9 + medium 7 + hard 7; operations easy 7 + medium 7 + hard 7.
    expect(levels).toHaveLength(44);
    expect(levels[0]?.id).toBe(1);
    expect(FIRST_LEVEL_ID).toBe(1);
    expect(FINAL_LEVEL_ID).toBe(217);
  });

  it('level 1 is unlocked unconditionally', () => {
    expect(isUnlocked({}, FIRST_LEVEL_ID)).toBe(true);
  });

  it('level N+1 within a tier is locked until prereq has 3 stars', () => {
    const progress: Record<number, LevelProgress> = {
      1: {
        levelId: 1,
        attempts: 1,
        bestStars: 2,
        bestAccuracy: 0.8,
        lastPlayedAt: '',
        totalTimeMs: 0,
      },
    };
    expect(isUnlocked(progress, 2)).toBe(false);
    progress[1] = { ...progress[1]!, bestStars: 3 };
    expect(isUnlocked(progress, 2)).toBe(true);
  });

  it('first level of every tier has no prereq', () => {
    for (const id of [1, 101, 201, 11, 111, 211]) {
      expect(isUnlocked({}, id)).toBe(true);
    }
  });

  it('final level (217) gates only on level 216 = 3 stars', () => {
    expect(isUnlocked({}, FINAL_LEVEL_ID)).toBe(false);
  });

  it('getNextLevel returns the next ordered level WITHIN the same tier', () => {
    expect(getNextLevel(1)?.id).toBe(2);
    // Last level of numbers-easy tier: no next within tier.
    expect(getNextLevel(9)).toBeUndefined();
    // Medium tier starts at 101.
    expect(getNextLevel(101)?.id).toBe(102);
    // Final level of hard operations.
    expect(getNextLevel(217)).toBeUndefined();
  });

  it('getLevelsForTrackAndDifficulty filters correctly', () => {
    const numbersEasy = getLevelsForTrackAndDifficulty('numbers', 'easy');
    expect(numbersEasy).toHaveLength(9);
    const opsHard = getLevelsForTrackAndDifficulty('operations', 'hard');
    expect(opsHard).toHaveLength(7);
  });

  it('getLevelById returns undefined for unknown ids', () => {
    expect(getLevelById(99)).toBeUndefined();
  });
});

describe('exercise engine', () => {
  it('generates a deterministic exercise for the same seed', () => {
    const a = generate(1, 42, 0);
    const b = generate(1, 42, 0);
    expect(a).toEqual(b);
  });

  it('generates a different exercise for a different seed', () => {
    const a = generate(1, 1, 0);
    const b = generate(1, 2, 0);
    expect(a.id).not.toBe(b.id);
  });

  it('every level in path.json produces a valid Exercise', () => {
    for (const level of getCurriculum()) {
      const ex = generate(level.id, 7, 0);
      expect(ex.prompt, `level ${level.id} prompt`).toBeTruthy();
      expect(ex.correctAnswer, `level ${level.id} answer`).toBeTruthy();
      expect(
        ex.options.length,
        `level ${level.id} options`
      ).toBeGreaterThan(0);
    }
  });

  it('L14 (groups-of) never emits ×/÷ in prompts or options', () => {
    const batch = generateBatch(14, 1, 12);
    for (const ex of batch) {
      expect(ex.prompt).not.toContain('×');
      expect(ex.prompt).not.toContain('÷');
      expect(ex.options.join(' ')).not.toContain('×');
      expect(ex.options.join(' ')).not.toContain('÷');
    }
  });

  it('L15 (share-equally) never emits ×/÷ in prompts or options', () => {
    const batch = generateBatch(15, 1, 12);
    for (const ex of batch) {
      expect(ex.prompt).not.toContain('×');
      expect(ex.prompt).not.toContain('÷');
    }
  });
});

describe('quiz engine', () => {
  it('builds a quiz with 6 items on medium difficulty', () => {
    const q = buildQuiz(1, 1, 'medium');
    expect(q.items).toHaveLength(6);
  });

  it('builds a 4-item quiz on easy and 8-item on hard', () => {
    expect(buildQuiz(1, 1, 'easy').items).toHaveLength(4);
    expect(buildQuiz(1, 1, 'hard').items).toHaveLength(8);
  });

  it('medium rubric: 85% + 0 hints = 3 stars', () => {
    const answers = Array.from({ length: 20 }, (_, i) => ({ correct: i < 17 }));
    expect(score(answers, 0, 'medium').stars).toBe(3);
  });

  it('medium rubric: 85% + 2 hints = 2 stars (hint cap broken)', () => {
    const answers = Array.from({ length: 20 }, (_, i) => ({ correct: i < 17 }));
    expect(score(answers, 2, 'medium').stars).toBe(2);
  });

  it('medium rubric: 69% = 1 star', () => {
    const answers: { correct: boolean }[] = [
      ...Array.from({ length: 13 }, () => ({ correct: true })),
      ...Array.from({ length: 7 }, () => ({ correct: false })),
    ];
    expect(score(answers, 0, 'medium').stars).toBe(1);
  });

  it('0% = 0 stars on every difficulty', () => {
    const answers: { correct: boolean }[] = Array.from({ length: 6 }, () => ({
      correct: false,
    }));
    expect(score(answers, 0, 'easy').stars).toBe(0);
    expect(score(answers, 0, 'medium').stars).toBe(0);
    expect(score(answers, 0, 'hard').stars).toBe(0);
  });
});

describe('reward engine', () => {
  it('awards 20 coins for 3 stars, 10 for 2, 5 for 1, 0 for 0', () => {
    expect(awardForStars(3, 1).coins).toBe(20);
    expect(awardForStars(2, 1).coins).toBe(10);
    expect(awardForStars(1, 1).coins).toBe(5);
    expect(awardForStars(0, 1).coins).toBe(0);
  });

  it('final-challenge badge unlocks at FINAL_LEVEL_ID with 3 stars only', () => {
    expect(awardForStars(3, FINAL_LEVEL_ID).badge).toBe('final-challenge');
    expect(awardForStars(2, FINAL_LEVEL_ID).badge).toBeUndefined();
    expect(awardForStars(3, FINAL_LEVEL_ID - 1).badge).toBeUndefined();
  });

  it('section chests unlock at tier-final levels with 3 stars', () => {
    expect(awardForStars(3, 9).chest).toBe('chest-section-9');
    expect(awardForStars(3, 17).chest).toBe('chest-section-17');
    expect(awardForStars(3, 107).chest).toBe('chest-section-107');
    expect(awardForStars(3, 5).chest).toBeUndefined();
  });
});
