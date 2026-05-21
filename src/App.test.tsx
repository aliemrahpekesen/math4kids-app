import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('<App />', () => {
  it('renders the splash heading on mount', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { name: /math4kids/i })
    ).toBeInTheDocument();
  });
});
