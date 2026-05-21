import { idbGet, idbSet, idbDel, KEY } from '../../persistence/idbDriver';
import type { RewardRepo, RewardSnapshot } from '../types';
import type { ProfileId } from '../../state/types';

export class LocalRewardRepo implements RewardRepo {
  async load(profileId: ProfileId): Promise<RewardSnapshot | null> {
    const snap = await idbGet<RewardSnapshot>(
      KEY.profile(profileId, 'rewards')
    );
    return snap ?? null;
  }

  async save(profileId: ProfileId, snap: RewardSnapshot): Promise<void> {
    await idbSet(KEY.profile(profileId, 'rewards'), snap);
  }

  async clear(profileId: ProfileId): Promise<void> {
    await idbDel(KEY.profile(profileId, 'rewards'));
  }
}
