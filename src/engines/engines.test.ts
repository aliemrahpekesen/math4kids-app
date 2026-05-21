import { describe, it, expect } from 'vitest';
import {
  getCurriculum,
  getLevelById,
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
  it('exposes 17 levels in order', () => {
    const levels = getCurriculum();
    expect(levels).toHaveLength(17);
    expect(levels[0]?.id).toBe(1);
    expect(levels[16]?.id).toBe(17);
  });

  it('level 1 is unlocked unconditionally', () => {
    expect(isUnlocked({}, FIRST_LEVEL_ID)).toBe(true);
  });

  it('level N+1 is locked until N has 3 stars', () => {
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

  it('final level (17) gates only on level 16 = 3 stars', () => {
    expect(isUnlocked({}, FINAL_LEVEL_ID)).toBe(false);
  });

  it('getNextLevel returns the next ordered level or undefined at the end', () => {
    expect(getNextLevel(1)?.id).toBe(2);
    expect(getNextLevel(17)).toBeUndefined();
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

  it('all 17 level types produce a valid Exercise', () => {
    for (let id = 1; id <= 17; id++) {
      const ex = generate(id, 7, 0);
      expect(ex.prompt).toBeTruthy();
      expect(ex.correctAnswer).toBeTruthy();
      expect(ex.options.length).toBeGreaterThan(0);
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
  it('builds a quiz with 6 items', () => {
    const q = buildQuiz(1, 1);
    expect(q.items).toHaveLength(6);
  });

  it('score boundaries: 85% + 0 hints = 3 stars', () => {
    const answers = Array.from({ length: 20 }, (_, i) => ({ correct: i < 17 }));
    expect(score(answers, 0).stars).toBe(3);
  });

  it('score boundaries: 85% + 2 hints = 2 stars (hint cap broken)', () => {
    const answers = Array.from({ length: 20 }, (_, i) => ({ correct: i < 17 }));
    expect(score(answers, 2).stars).toBe(2);
  });

  it('score boundaries: 69% = 1 star', () => {
    const answers: { correct: boolean }[] = [
      ...Array.from({ length: 13 }, () => ({ correct: true })),
      ...Array.from({ length: 7 }, () => ({ correct: false })),
    ];
    expect(score(answers, 0).stars).toBe(1);
  });

  it('score boundaries: 0% = 0 stars', () => {
    const answers: { correct: boolean }[] = Array.from({ length: 6 }, () => ({
      correct: false,
    }));
    expect(score(answers, 0).stars).toBe(0);
  });
});

describe('reward engine', () => {
  it('awards 20 coins for 3 stars, 10 for 2, 5 for 1, 0 for 0', () => {
    expect(awardForStars(3, 1).coins).toBe(20);
    expect(awardForStars(2, 1).coins).toBe(10);
    expect(awardForStars(1, 1).coins).toBe(5);
    expect(awardForStars(0, 1).coins).toBe(0);
  });

  it('final-challenge badge unlocks at level 17 with 3 stars only', () => {
    expect(awardForStars(3, 17).badge).toBe('final-challenge');
    expect(awardForStars(2, 17).badge).toBeUndefined();
    expect(awardForStars(3, 16).badge).toBeUndefined();
  });

  it('section chests unlock at levels 4, 9, 13, 15, 17 with 3 stars', () => {
    expect(awardForStars(3, 4).chest).toBe('chest-section-4');
    expect(awardForStars(3, 9).chest).toBe('chest-section-9');
    expect(awardForStars(3, 5).chest).toBeUndefined();
  });
});
