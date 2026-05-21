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

/**
 * Filter out soft-deleted profiles.
 *
 * ⚠️  DO NOT call this INSIDE a Zustand selector
 *     ❌ `useProfileStore((s) => listVisibleProfiles(s.profiles))`
 *     `.filter` returns a new array each call → React detects a state change
 *     on every render → infinite re-render loop ("Maximum update depth exceeded").
 *
 * ✅  Correct: select the raw array, then filter in the render body.
 *     ```ts
 *     const allProfiles = useProfileStore((s) => s.profiles);
 *     const profiles = listVisibleProfiles(allProfiles);
 *     ```
 *
 * The same rule applies to ANY selector that returns a freshly-built
 * collection (`.filter`, `.map`, `.slice`, `Object.entries`, etc.). Either
 * select the raw reference and derive in the body, OR wrap the selector with
 * `useShallow` from `zustand/react/shallow` if a primitive can't represent it.
 */
export function listVisibleProfiles(profiles: ChildProfile[]): ChildProfile[] {
  return profiles.filter((p) => !p.deletedAt);
}

export const MAX_PROFILES = 4;
