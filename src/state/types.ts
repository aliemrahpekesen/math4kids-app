import type { AvatarKey } from '../ui';
import type { ThemeKey } from '../themes/types';

export type ProfileId = string; // UUIDv4
export type LevelId = number;

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface ChildProfile {
  id: ProfileId;
  nickname: string;
  avatarKey: AvatarKey;
  themeKey: ThemeKey;
  /** Per-profile difficulty drives quiz length, hint cost, and star rubric. */
  difficulty: Difficulty;
  createdAt: string;
  version: number;
  updatedAt: string;
  dirty: boolean;
  deletedAt?: string;
}

export interface LevelProgress {
  levelId: LevelId;
  attempts: number;
  bestStars: 0 | 1 | 2 | 3;
  bestAccuracy: number;
  lastPlayedAt: string;
  totalTimeMs: number;
}

export interface Streaks {
  dailyCount: number;
  weeklyCount: number;
  lastDay: string; // ISO date
}

export interface Badge {
  key: string;
  earnedAt: string;
  themeKey?: ThemeKey;
}

export interface ParentAuth {
  pinHash: string;
  pinSalt: string;
  failedAttempts: number;
  lockedUntil?: string;
  email?: string;
  version: number;
  updatedAt: string;
  dirty: boolean;
}

export interface ParentPrefs {
  audioOn: boolean;
  musicOn: boolean;
  narrationRepeatOn: boolean;
  leaderboardVisible: boolean;
  reportPreferences: {
    daily: boolean;
    weekly: boolean;
    monthly: boolean;
    yearly: boolean;
  };
  version: number;
  updatedAt: string;
  dirty: boolean;
}

export type Language = 'tr' | 'en' | 'de';
