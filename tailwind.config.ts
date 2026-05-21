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
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        primary: {
          DEFAULT: 'var(--color-primary)',
          fg: 'var(--color-primary-fg)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          fg: 'var(--color-accent-fg)',
        },
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',
        fg: 'var(--color-fg)',
        muted: 'var(--color-muted)',
        star: {
          filled: 'var(--color-star-filled)',
          empty: 'var(--color-star-empty)',
        },
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
      minHeight: {
        touch: '56px',
      },
      minWidth: {
        touch: '56px',
      },
    },
  },
  plugins: [],
};

export default config;
