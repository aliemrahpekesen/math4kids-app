/**
 * Compile-time feature flag registry per plan.md §6.8.
 *
 * All flags default to `false` in v1 (KVKK/GDPR-K posture). The parent-area
 * override panel (T-015 / T-036) can flip them in-memory for a session
 * without persisting across refreshes — useful for previewing locked themes
 * or testing the leaderboard adapter against an HTTP backend stub.
 */

export const FLAGS = {
  themes: {
    jungle: false,
    ocean: false,
    candy: false,
  },
  voice: {
    preRecorded: false,
  },
  errorReporting: {
    sentry: false,
  },
  leaderboard: {
    http: false,
  },
  sync: {
    cloud: false,
  },
} as const;

export type FlagPath =
  | 'themes.jungle'
  | 'themes.ocean'
  | 'themes.candy'
  | 'voice.preRecorded'
  | 'errorReporting.sentry'
  | 'leaderboard.http'
  | 'sync.cloud';

/** Mutable in-memory overlay applied on top of the compile-time defaults. */
const overrides = new Map<FlagPath, boolean>();

export function isFlagOn(path: FlagPath): boolean {
  if (overrides.has(path)) {
    return overrides.get(path) ?? false;
  }
  const [group, key] = path.split('.') as [keyof typeof FLAGS, string];
  const compiled = (FLAGS[group] as Record<string, boolean>)[key];
  return compiled ?? false;
}

export function setFlagOverride(path: FlagPath, value: boolean): void {
  overrides.set(path, value);
}

export function clearFlagOverrides(): void {
  overrides.clear();
}
