/**
 * Theme registry — the rich token shape introduced by the design overhaul.
 *
 * Components consume tokens BOTH via React context (for inline-SVG fills and
 * shadow strings the design uses literally) AND via CSS custom properties
 * applied to `:root` (for Tailwind utilities).
 */

export const THEME_KEYS = ['space', 'jungle', 'ocean', 'candy'] as const;
export type ThemeKey = (typeof THEME_KEYS)[number];

export const REWARD = {
  star: '#FACC15',
  starShade: '#CA8A04',
  starEmpty: '#E5E7EB',
  coin: '#F59E0B',
  coinShade: '#B45309',
  chest: '#D97706',
} as const;

export interface ThemeTokens {
  key: ThemeKey;
  name: { tr: string; en: string; de: string };
  tokens: {
    color: {
      accent: string;
      accentDark: string;
      accentSoft: string;
      deep: string;
      light: string;
      bgGrad: string;
      bgDeep: string;
      cardBg: string;
      cardTint: string;
      secondary: string;
      success: string;
      fg: string;
      muted: string;
    };
    radius: { soft: string; round: string };
    shadow: { card: string; glow: string };
    font: { display: string; body: string };
    motion: { celebrationMs: string; transitionMs: string };
  };
  illustration: {
    object: string;
    objectLabel: { tr: string; en: string; de: string };
  };
}

/** Flatten a theme into the CSS custom properties applied to `:root`. */
export function tokensToCSSVars(theme: ThemeTokens): Record<string, string> {
  const { color, radius, shadow, font, motion } = theme.tokens;
  return {
    '--color-accent': color.accent,
    '--color-accent-dark': color.accentDark,
    '--color-accent-soft': color.accentSoft,
    '--color-deep': color.deep,
    '--color-light': color.light,
    '--color-card-bg': color.cardBg,
    '--color-card-tint': color.cardTint,
    '--color-secondary': color.secondary,
    '--color-success': color.success,
    '--color-fg': color.fg,
    '--color-muted': color.muted,
    '--color-star-filled': REWARD.star,
    '--color-star-empty': REWARD.starEmpty,
    '--radius-soft': radius.soft,
    '--radius-round': radius.round,
    '--shadow-card': shadow.card,
    '--shadow-glow': shadow.glow,
    '--font-display': font.display,
    '--font-body': font.body,
    '--motion-celebration-ms': motion.celebrationMs,
    '--motion-transition-ms': motion.transitionMs,
  };
}
