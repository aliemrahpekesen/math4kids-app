import { idbGet, idbSet, idbDel, KEY } from '../../persistence/idbDriver';
import type { ProgressRepo, ProgressSnapshot } from '../types';
import type { ProfileId } from '../../state/types';

export class LocalProgressRepo implements ProgressRepo {
  async load(profileId: ProfileId): Promise<ProgressSnapshot | null> {
    const snap = await idbGet<ProgressSnapshot>(
      KEY.profile(profileId, 'progress')
    );
    return snap ?? null;
  }

  async save(profileId: ProfileId, snap: ProgressSnapshot): Promise<void> {
    await idbSet(KEY.profile(profileId, 'progress'), snap);
  }

  async clear(profileId: ProfileId): Promise<void> {
    await idbDel(KEY.profile(profileId, 'progress'));
  }
}
