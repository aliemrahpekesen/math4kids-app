import { v4 as uuid } from 'uuid';
import { useProfileStore, MAX_PROFILES } from './profileStore';
import { useProgressStore } from './progressStore';
import { useRewardStore } from './rewardStore';
import { useSettingsStore } from './settingsStore';
import { repos } from '../repos';
import { lsGet, lsSet, lsRemove } from '../persistence/localStorageDriver';
import type { ChildProfile, Difficulty, ProfileId } from './types';
import type { AvatarKey } from '../ui';
import type { ThemeKey } from '../themes/types';

/**
 * Hydrate from repos at app boot. Idempotent; safe to call multiple times.
 */
export async function hydrateFromRepos(): Promise<void> {
  const rawAll = await repos.profile.list();
  // Migrate old profiles that pre-date the difficulty field.
  const all = rawAll.map((p) => ({
    ...p,
    difficulty: p.difficulty ?? ('medium' as const),
  }));
  const activeId = lsGet<ProfileId>('activeProfileId');
  useProfileStore.getState().hydrate({
    activeProfileId: activeId,
    profiles: all,
  });

  if (activeId) {
    await hydrateProfileScopedStores(activeId);
  }

  // Reflect "PIN was set on a previous session" so the gate boots into
  // VERIFY mode instead of SET mode after refresh / install.
  const auth = await repos.settings.loadParentAuth();
  if (auth?.pinHash) {
    useSettingsStore.getState().setParentPinSet(true);
  }

  // Reflect any saved parent email so settings + email-preview show it.
  if (auth?.email) {
    useSettingsStore.getState().setParentEmail(auth.email);
  }
}

/** Re-hydrate per-profile stores after a profile switch. */
export async function hydrateProfileScopedStores(
  profileId: ProfileId
): Promise<void> {
  const [progress, rewards] = await Promise.all([
    repos.progress.load(profileId),
    repos.reward.load(profileId),
  ]);

  if (progress) {
    useProgressStore.getState().hydrate(progress);
  } else {
    useProgressStore.getState().reset();
  }

  if (rewards) {
    useRewardStore.getState().hydrate(rewards);
  } else {
    useRewardStore.getState().reset();
  }
}

interface CreateInput {
  nickname: string;
  avatarKey: AvatarKey;
  themeKey: ThemeKey;
  difficulty?: Difficulty;
}

export async function createProfile({
  nickname,
  avatarKey,
  themeKey,
  difficulty = 'medium',
}: CreateInput): Promise<ChildProfile> {
  const profiles = useProfileStore
    .getState()
    .profiles.filter((p) => !p.deletedAt);
  if (profiles.length >= MAX_PROFILES) {
    throw new Error(`Max ${MAX_PROFILES} profiles per device`);
  }
  const now = new Date().toISOString();
  const profile: ChildProfile = {
    id: uuid(),
    nickname,
    avatarKey,
    themeKey,
    difficulty,
    createdAt: now,
    version: 1,
    updatedAt: now,
    dirty: true,
  };
  await repos.profile.save(profile);
  useProfileStore.getState().upsert(profile);
  return profile;
}

export async function switchProfile(id: ProfileId): Promise<void> {
  lsSet('activeProfileId', id);
  useProfileStore.getState().setActive(id);
  await hydrateProfileScopedStores(id);

  const profile = useProfileStore.getState().profiles.find((p) => p.id === id);
  if (profile) {
    useSettingsStore.getState().setTheme(profile.themeKey);
  }
}

export async function renameProfile(
  id: ProfileId,
  nickname: string
): Promise<void> {
  useProfileStore.getState().rename(id, nickname);
  const updated = useProfileStore.getState().profiles.find((p) => p.id === id);
  if (updated) await repos.profile.save(updated);
}

export async function setProfileDifficulty(
  id: ProfileId,
  difficulty: Difficulty
): Promise<void> {
  const current = useProfileStore.getState().profiles.find((p) => p.id === id);
  if (!current) return;
  const updated: ChildProfile = {
    ...current,
    difficulty,
    version: current.version + 1,
    updatedAt: new Date().toISOString(),
    dirty: true,
  };
  useProfileStore.getState().upsert(updated);
  await repos.profile.save(updated);
}

export async function deleteProfile(id: ProfileId): Promise<void> {
  useProfileStore.getState().remove(id);
  await repos.profile.softDelete(id);

  const active = useProfileStore.getState().activeProfileId;
  if (active === id) {
    lsRemove('activeProfileId');
  }
}

export async function resetProfileProgress(id: ProfileId): Promise<void> {
  await Promise.all([repos.progress.clear(id), repos.reward.clear(id)]);
  if (useProfileStore.getState().activeProfileId === id) {
    useProgressStore.getState().reset();
    useRewardStore.getState().reset();
  }
}
