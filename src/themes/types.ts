/**
 * Theme registry types. The actual tokens live as JSON under
 * content/themes/<key>/tokens.json and are imported lazily.
 */

export const THEME_KEYS = ['space', 'jungle', 'ocean', 'candy'] as const;
export type ThemeKey = (typeof THEME_KEYS)[number];

export interface ThemeTokens {
  key: ThemeKey;
  name: { tr: string; en: string; de: string };
  tokens: {
    color: {
      bg: string;
      surface: string;
      primary: string;
      primaryFg: string;
      accent: string;
      accentFg: string;
      success: string;
      warning: string;
      danger: string;
      fg: string;
      muted: string;
      starFilled: string;
      starEmpty: string;
    };
    radius: {
      soft: string;
      round: string;
    };
    shadow: {
      card: string;
      glow: string;
    };
    font: {
      display: string;
      body: string;
    };
    motion: {
      celebrationMs: string;
      transitionMs: string;
    };
  };
  illustration: {
    background: string;
    characterPrefix: string;
  };
}

/** Flatten a theme into the CSS-custom-property strings applied to `:root`. */
export function tokensToCSSVars(theme: ThemeTokens): Record<string, string> {
  const { color, radius, shadow, font, motion } = theme.tokens;
  return {
    '--color-bg': color.bg,
    '--color-surface': color.surface,
    '--color-primary': color.primary,
    '--color-primary-fg': color.primaryFg,
    '--color-accent': color.accent,
    '--color-accent-fg': color.accentFg,
    '--color-success': color.success,
    '--color-warning': color.warning,
    '--color-danger': color.danger,
    '--color-fg': color.fg,
    '--color-muted': color.muted,
    '--color-star-filled': color.starFilled,
    '--color-star-empty': color.starEmpty,
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
