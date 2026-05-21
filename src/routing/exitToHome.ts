import type { NavigateFunction } from 'react-router-dom';
import { useProfileStore } from '../state/profileStore';

/**
 * Resolve the "home" route based on current profile state.
 *  - profiles exist + one is active → /map (active child's home)
 *  - profiles exist + none active   → /profile-picker
 *  - no profiles                    → /onboarding/language
 */
export function resolveHomeRoute(): string {
  const state = useProfileStore.getState();
  const visible = state.profiles.filter((p) => !p.deletedAt);
  if (visible.length === 0) return '/onboarding/language';
  if (state.activeProfileId) return '/map';
  return '/profile-picker';
}

export async function exitToHome(navigate: NavigateFunction): Promise<void> {
  await navigate(resolveHomeRoute());
}
