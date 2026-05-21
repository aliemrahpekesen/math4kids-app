import { LocalProfileRepo } from './local/ProfileRepo';
import { LocalProgressRepo } from './local/ProgressRepo';
import { LocalRewardRepo } from './local/RewardRepo';
import { LocalSettingsRepo } from './local/SettingsRepo';
import { LocalLeaderboardRepo } from './local/LeaderboardRepo';
import type {
  ProfileRepo,
  ProgressRepo,
  RewardRepo,
  SettingsRepo,
  LeaderboardRepo,
} from './types';

/**
 * Singleton repository factory. Future HTTP impls will swap behind
 * these getters once a backend lands — no consumer changes.
 */
interface Repos {
  profile: ProfileRepo;
  progress: ProgressRepo;
  reward: RewardRepo;
  settings: SettingsRepo;
  leaderboard: LeaderboardRepo;
}

export const repos: Repos = {
  profile: new LocalProfileRepo(),
  progress: new LocalProgressRepo(),
  reward: new LocalRewardRepo(),
  settings: new LocalSettingsRepo(),
  leaderboard: new LocalLeaderboardRepo(),
};

export type {
  ProfileRepo,
  ProgressRepo,
  RewardRepo,
  SettingsRepo,
  LeaderboardRepo,
};
export type {
  ProgressSnapshot,
  RewardSnapshot,
  LeaderboardEntry,
  RankEntry,
  ScorePayload,
} from './types';
