import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('<App />', () => {
  it('renders the splash heading after i18n init', async () => {
    render(<App />);
    expect(
      await screen.findByRole(
        'heading',
        { name: /math4kids/i },
        { timeout: 2000 }
      )
    ).toBeInTheDocument();
  });
});
