import { create } from 'zustand';
import type { LevelId, LevelProgress, Streaks } from './types';

interface ProgressStore {
  levels: Record<LevelId, LevelProgress>;
  currentLevelId: LevelId;
  streaks: Streaks;
  recordResult: (input: {
    levelId: LevelId;
    accuracy: number;
    hintsUsed: number;
    elapsedMs: number;
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

function computeStars(accuracy: number, hintsUsed: number): 0 | 1 | 2 | 3 {
  if (accuracy >= 0.85 && hintsUsed <= 1) return 3;
  if (accuracy >= 0.7) return 2;
  if (accuracy > 0) return 1;
  return 0;
}

export const useProgressStore = create<ProgressStore>((set, get) => ({
  levels: {},
  currentLevelId: 1,
  streaks: initialStreaks,

  recordResult: ({ levelId, accuracy, hintsUsed, elapsedMs }) => {
    const stars = computeStars(accuracy, hintsUsed);
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

    // Unlock logic: if the just-completed level earned 3 stars, the next
    // level becomes available. Caller decides whether to navigate.
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
