import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,html}',
    './.storybook/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: 'var(--color-accent)',
          dark: 'var(--color-accent-dark)',
          soft: 'var(--color-accent-soft)',
          fg: 'var(--color-accent-fg)',
        },
        deep: 'var(--color-deep)',
        light: 'var(--color-light)',
        card: {
          bg: 'var(--color-card-bg)',
          tint: 'var(--color-card-tint)',
        },
        secondary: 'var(--color-secondary)',
        success: 'var(--color-success)',
        fg: 'var(--color-fg)',
        muted: 'var(--color-muted)',
        star: {
          filled: 'var(--color-star-filled)',
          empty: 'var(--color-star-empty)',
        },
        /* Legacy compat — keep old screens compiling while we migrate. */
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        primary: {
          DEFAULT: 'var(--color-primary)',
          fg: 'var(--color-primary-fg)',
        },
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',
      },
      borderRadius: {
        soft: 'var(--radius-soft)',
        round: 'var(--radius-round)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        glow: 'var(--shadow-glow)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body)',
      },
      minHeight: { touch: '64px' },
      minWidth: { touch: '64px' },
      width: { touch: '64px' },
      height: { touch: '64px' },
    },
  },
  plugins: [],
};

export default config;
