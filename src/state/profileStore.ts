import { create } from 'zustand';
import type { ChildProfile, ProfileId } from './types';

interface ProfileStore {
  activeProfileId: ProfileId | null;
  profiles: ChildProfile[];
  setActive: (id: ProfileId | null) => void;
  upsert: (profile: ChildProfile) => void;
  rename: (id: ProfileId, nickname: string) => void;
  remove: (id: ProfileId) => void;
  hydrate: (input: {
    activeProfileId: ProfileId | null;
    profiles: ChildProfile[];
  }) => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  activeProfileId: null,
  profiles: [],

  setActive: (id) => set({ activeProfileId: id }),

  upsert: (profile) =>
    set((state) => {
      const exists = state.profiles.some((p) => p.id === profile.id);
      const next = exists
        ? state.profiles.map((p) => (p.id === profile.id ? profile : p))
        : [...state.profiles, profile];
      return { profiles: next };
    }),

  rename: (id, nickname) =>
    set((state) => ({
      profiles: state.profiles.map((p) =>
        p.id === id
          ? {
              ...p,
              nickname,
              version: p.version + 1,
              updatedAt: new Date().toISOString(),
              dirty: true,
            }
          : p
      ),
    })),

  remove: (id) =>
    set((state) => ({
      profiles: state.profiles.map((p) =>
        p.id === id
          ? { ...p, deletedAt: new Date().toISOString(), dirty: true }
          : p
      ),
      activeProfileId:
        state.activeProfileId === id ? null : state.activeProfileId,
    })),

  hydrate: ({ activeProfileId, profiles }) =>
    set({ activeProfileId, profiles }),
}));

export function listVisibleProfiles(profiles: ChildProfile[]): ChildProfile[] {
  return profiles.filter((p) => !p.deletedAt);
}

export const MAX_PROFILES = 4;
