import spaceTokens from '../../content/themes/space/tokens.json';
import jungleTokens from '../../content/themes/jungle/tokens.json';
import oceanTokens from '../../content/themes/ocean/tokens.json';
import candyTokens from '../../content/themes/candy/tokens.json';
import type { ThemeKey, ThemeTokens } from './types';

/**
 * Theme registry. Space is the v1 "fully shipped" theme (artwork complete);
 * Jungle/Ocean/Candy are "preview" — tokens land in v1 but artwork sits behind
 * feature flags (FLAGS.themes.{jungle,ocean,candy}) per ADR-0011 (queued)
 * and plan.md §10 R1.
 *
 * All four token JSONs are bundled at build time. The runtime cost is
 * negligible (each token file < 1 KB) and the simpler eager registry beats
 * lazy chunks for a 4-theme set.
 */
const themes: Record<ThemeKey, ThemeTokens> = {
  space: spaceTokens as ThemeTokens,
  jungle: jungleTokens as ThemeTokens,
  ocean: oceanTokens as ThemeTokens,
  candy: candyTokens as ThemeTokens,
};

export function getTheme(key: ThemeKey): ThemeTokens | undefined {
  return themes[key];
}

/** Kept for forward-compat with a future lazy-load strategy. */
export function loadTheme(key: ThemeKey): Promise<ThemeTokens> {
  return Promise.resolve(themes[key]);
}

export const DEFAULT_THEME: ThemeKey = 'space';
