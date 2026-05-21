import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeProvider';

function Probe() {
  const { key, tokens } = useTheme();
  return (
    <div>
      <span data-testid="theme-key">{key}</span>
      <span data-testid="primary">{tokens.tokens.color.primary}</span>
      <span data-testid="name-tr">{tokens.name.tr}</span>
    </div>
  );
}

describe('<ThemeProvider />', () => {
  it('defaults to the Space theme', () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme-key').textContent).toBe('space');
  });

  it('exposes Space token values', () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>
    );
    // Space primary is purple #7c3aed per tokens.json
    expect(screen.getByTestId('primary').textContent).toBe('#7c3aed');
    expect(screen.getByTestId('name-tr').textContent).toBe('Uzay Macerası');
  });

  it('applies CSS custom properties to :root', () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>
    );
    const value =
      document.documentElement.style.getPropertyValue('--color-primary');
    expect(value).toBe('#7c3aed');
  });
});
