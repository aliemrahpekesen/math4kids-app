import type {
  ChildProfile,
  LevelProgress,
  Badge,
  ParentAuth,
  ParentPrefs,
  Streaks,
  ProfileId,
  LevelId,
} from '../state/types';

export interface ProgressSnapshot {
  levels: Record<LevelId, LevelProgress>;
  currentLevelId: LevelId;
  streaks: Streaks;
}

export interface RewardSnapshot {
  coins: number;
  badges: Badge[];
  chestUnlockedKeys: string[];
}

export interface ProfileRepo {
  list(): Promise<ChildProfile[]>;
  load(id: ProfileId): Promise<ChildProfile | null>;
  save(profile: ChildProfile): Promise<void>;
  softDelete(id: ProfileId): Promise<void>;
}

export interface ProgressRepo {
  load(profileId: ProfileId): Promise<ProgressSnapshot | null>;
  save(profileId: ProfileId, snap: ProgressSnapshot): Promise<void>;
  clear(profileId: ProfileId): Promise<void>;
}

export interface RewardRepo {
  load(profileId: ProfileId): Promise<RewardSnapshot | null>;
  save(profileId: ProfileId, snap: RewardSnapshot): Promise<void>;
  clear(profileId: ProfileId): Promise<void>;
}

export interface SettingsRepo {
  loadParentAuth(): Promise<ParentAuth | null>;
  saveParentAuth(value: ParentAuth): Promise<void>;
  loadParentPrefs(): Promise<ParentPrefs | null>;
  saveParentPrefs(value: ParentPrefs): Promise<void>;
}

export interface LeaderboardEntry {
  rank: number;
  nickname: string;
  avatarKey: string;
  stars: number;
  cadence: 'daily' | 'weekly' | 'monthly' | 'yearly';
  isSelf?: boolean;
}

export interface ScorePayload {
  profileId: ProfileId;
  nickname: string;
  avatarKey: string;
  stars: number;
}

export interface RankEntry {
  rank: number;
  stars: number;
  total: number;
}

export interface LeaderboardRepo {
  query(filter: {
    cadence: 'daily' | 'weekly' | 'monthly' | 'yearly';
    limit?: number;
  }): Promise<LeaderboardEntry[]>;
  submit(score: ScorePayload): Promise<void>;
  getMyRank(profileId: ProfileId): Promise<RankEntry | null>;
}
