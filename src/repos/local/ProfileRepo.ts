import { idbGet, idbSet, KEY } from '../../persistence/idbDriver';
import type { ProfileRepo } from '../types';
import type { ChildProfile, ProfileId } from '../../state/types';

const INDEX_KEY = KEY.global('profileIndex');

interface ProfileIndex {
  ids: ProfileId[];
}

async function loadIndex(): Promise<ProfileIndex> {
  const idx = await idbGet<ProfileIndex>(INDEX_KEY);
  return idx ?? { ids: [] };
}

async function saveIndex(idx: ProfileIndex): Promise<void> {
  await idbSet(INDEX_KEY, idx);
}

export class LocalProfileRepo implements ProfileRepo {
  async list(): Promise<ChildProfile[]> {
    const { ids } = await loadIndex();
    const profiles = await Promise.all(
      ids.map((id) => idbGet<ChildProfile>(KEY.profile(id, 'profile')))
    );
    return profiles.filter((p): p is ChildProfile => p != null);
  }

  async load(id: ProfileId): Promise<ChildProfile | null> {
    const profile = await idbGet<ChildProfile>(KEY.profile(id, 'profile'));
    return profile ?? null;
  }

  async save(profile: ChildProfile): Promise<void> {
    await idbSet(KEY.profile(profile.id, 'profile'), profile);
    const { ids } = await loadIndex();
    if (!ids.includes(profile.id)) {
      await saveIndex({ ids: [...ids, profile.id] });
    }
  }

  async softDelete(id: ProfileId): Promise<void> {
    const profile = await this.load(id);
    if (!profile) return;
    await this.save({
      ...profile,
      deletedAt: new Date().toISOString(),
      version: profile.version + 1,
      updatedAt: new Date().toISOString(),
      dirty: true,
    });
  }
}
