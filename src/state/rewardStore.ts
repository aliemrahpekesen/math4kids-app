import { create } from 'zustand';
import type { Badge } from './types';

const COIN_PER_STAR: Record<0 | 1 | 2 | 3, number> = {
  0: 0,
  1: 5,
  2: 10,
  3: 20,
};

interface RewardStore {
  coins: number;
  badges: Badge[];
  chestUnlockedKeys: string[];
  awardForStars: (stars: 0 | 1 | 2 | 3) => number;
  earnBadge: (key: string) => void;
  unlockChest: (key: string) => void;
  hydrate: (input: {
    coins: number;
    badges: Badge[];
    chestUnlockedKeys: string[];
  }) => void;
  reset: () => void;
}

export const useRewardStore = create<RewardStore>((set) => ({
  coins: 0,
  badges: [],
  chestUnlockedKeys: [],

  awardForStars: (stars) => {
    const amount = COIN_PER_STAR[stars];
    set((state) => ({ coins: state.coins + amount }));
    return amount;
  },

  earnBadge: (key) =>
    set((state) =>
      state.badges.some((b) => b.key === key)
        ? state
        : {
            badges: [
              ...state.badges,
              { key, earnedAt: new Date().toISOString() },
            ],
          }
    ),

  unlockChest: (key) =>
    set((state) =>
      state.chestUnlockedKeys.includes(key)
        ? state
        : { chestUnlockedKeys: [...state.chestUnlockedKeys, key] }
    ),

  hydrate: ({ coins, badges, chestUnlockedKeys }) =>
    set({ coins, badges, chestUnlockedKeys }),

  reset: () => set({ coins: 0, badges: [], chestUnlockedKeys: [] }),
}));
