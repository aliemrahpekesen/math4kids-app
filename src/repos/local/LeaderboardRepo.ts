import type {
  LeaderboardEntry,
  LeaderboardRepo,
  RankEntry,
  ScorePayload,
} from '../types';
import type { ProfileId } from '../../state/types';
import seed from '../../../content/leaderboard-seed.json';

/**
 * v1 local-fake leaderboard. Reads from a bundled seed JSON; ignores submits
 * (interface satisfied for future HTTP impl swap). `getMyRank` looks the
 * active profile up in the seeded daily list as if it were submitted.
 */
export class LocalLeaderboardRepo implements LeaderboardRepo {
  query({
    cadence,
    limit = 20,
  }: {
    cadence: 'daily' | 'weekly' | 'monthly' | 'yearly';
    limit?: number;
  }): Promise<LeaderboardEntry[]> {
    const entries = (seed as Record<string, LeaderboardEntry[]>)[cadence] ?? [];
    return Promise.resolve(entries.slice(0, limit));
  }

  submit(score: ScorePayload): Promise<void> {
    // local mock: no-op (HTTP impl would dispatch in v2)
    void score;
    return Promise.resolve();
  }

  getMyRank(profileId: ProfileId): Promise<RankEntry | null> {
    const daily = (seed as Record<string, LeaderboardEntry[]>).daily ?? [];
    const total = daily.length;
    // Synthetic "your rank" — for v1 we always slot the active profile at #3.
    const synthetic: RankEntry = { rank: 3, stars: 28, total };
    return Promise.resolve(profileId ? synthetic : null);
  }
}
