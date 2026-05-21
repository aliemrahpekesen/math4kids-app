import spaceTokens from '../../content/themes/space/tokens.json';
import type { ThemeKey, ThemeTokens } from './types';

/**
 * Synchronous registry seeded with Space (the v1 "fully-shipped" theme per
 * ADR-0011 queued + plan.md §10 R1). Jungle/Ocean/Candy are lazy-loaded
 * in T-008 once their feature flag flips on.
 */
const eagerThemes: Partial<Record<ThemeKey, ThemeTokens>> = {
  space: spaceTokens as ThemeTokens,
};

export function getTheme(key: ThemeKey): ThemeTokens | undefined {
  return eagerThemes[key];
}

/** Load a theme lazily (returns the eager copy if already cached). */
export function loadTheme(key: ThemeKey): Promise<ThemeTokens> {
  const eager = eagerThemes[key];
  if (eager) return Promise.resolve(eager);
  // T-008 wires Jungle/Ocean/Candy via dynamic import; placeholder here.
  return Promise.reject(
    new Error(`Theme "${key}" not yet loaded. Wire its lazy import in T-008.`)
  );
}

export const DEFAULT_THEME: ThemeKey = 'space';
