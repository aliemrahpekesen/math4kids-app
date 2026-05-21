import { create } from 'zustand';
import type { Difficulty, LevelId, LevelProgress, Streaks } from './types';
import { scoreStars, DEFAULT_DIFFICULTY } from '../engines/difficulty';

interface ProgressStore {
  levels: Record<LevelId, LevelProgress>;
  currentLevelId: LevelId;
  streaks: Streaks;
  recordResult: (input: {
    levelId: LevelId;
    accuracy: number;
    hintsUsed: number;
    elapsedMs: number;
    difficulty?: Difficulty;
  }) => { stars: 0 | 1 | 2 | 3; unlocked: LevelId | null };
  hydrate: (input: {
    levels: Record<LevelId, LevelProgress>;
    currentLevelId: LevelId;
    streaks: Streaks;
  }) => void;
  reset: () => void;
}

const initialStreaks: Streaks = {
  dailyCount: 0,
  weeklyCount: 0,
  lastDay: '',
};

export const useProgressStore = create<ProgressStore>((set, get) => ({
  levels: {},
  currentLevelId: 1,
  streaks: initialStreaks,

  recordResult: ({
    levelId,
    accuracy,
    hintsUsed,
    elapsedMs,
    difficulty = DEFAULT_DIFFICULTY,
  }) => {
    const stars = scoreStars(accuracy, hintsUsed, difficulty);
    const now = new Date().toISOString();
    set((state) => {
      const prev = state.levels[levelId];
      const next: LevelProgress = {
        levelId,
        attempts: (prev?.attempts ?? 0) + 1,
        bestStars: Math.max(stars, prev?.bestStars ?? 0) as 0 | 1 | 2 | 3,
        bestAccuracy: Math.max(accuracy, prev?.bestAccuracy ?? 0),
        lastPlayedAt: now,
        totalTimeMs: (prev?.totalTimeMs ?? 0) + elapsedMs,
      };
      return { levels: { ...state.levels, [levelId]: next } };
    });

    // Unlock signal: 3 stars on this level → its in-track successor becomes
    // available. Caller (LessonQuiz) computes the actual next-level ID via
    // `getNextLevel(levelId)` — we return only a boolean-ish hint here.
    const newRecord = get().levels[levelId];
    const unlocked = newRecord?.bestStars === 3 ? levelId + 1 : null;
    return { stars, unlocked };
  },

  hydrate: ({ levels, currentLevelId, streaks }) =>
    set({ levels, currentLevelId, streaks }),

  reset: () =>
    set({
      levels: {},
      currentLevelId: 1,
      streaks: initialStreaks,
    }),
}));
