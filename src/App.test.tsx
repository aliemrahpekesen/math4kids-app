import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('<App />', () => {
  it('renders the Math4Kids heading', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { name: /math4kids/i })
    ).toBeInTheDocument();
  });

  it('renders inside the .app-shell container', () => {
    const { container } = render(<App />);
    const shell = container.querySelector('.app-shell');
    expect(shell).not.toBeNull();
  });
});
