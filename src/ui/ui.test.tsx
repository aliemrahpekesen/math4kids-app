import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  Button,
  TouchTarget,
  Card,
  StarRow,
  CoinBadge,
  ProgressBar,
  CharacterAvatar,
  LevelNode,
  NumeralTile,
} from './index';

describe('design system primitives', () => {
  it('TouchTarget renders with min-w/h-touch utility classes', () => {
    render(<TouchTarget>tap</TouchTarget>);
    const btn = screen.getByRole('button', { name: /tap/i });
    expect(btn.className).toMatch(/min-w-touch/);
    expect(btn.className).toMatch(/min-h-touch/);
  });

  it('Button fires onClick', () => {
    const fn = vi.fn();
    render(<Button onClick={fn}>go</Button>);
    fireEvent.click(screen.getByRole('button', { name: /go/i }));
    expect(fn).toHaveBeenCalledOnce();
  });

  it('Card renders children', () => {
    render(<Card>hello</Card>);
    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  it('StarRow announces star count via aria-label', () => {
    render(<StarRow stars={2} />);
    expect(screen.getByLabelText('2 of 3 stars')).toBeInTheDocument();
  });

  it('CoinBadge shows count with role=status', () => {
    render(<CoinBadge count={42} />);
    expect(screen.getByLabelText('42 coins')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('ProgressBar has correct role + aria values', () => {
    render(<ProgressBar value={50} max={100} label="progress" />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '50');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(bar).toHaveAttribute('aria-label', 'progress');
  });

  it('CharacterAvatar renders emoji for given key', () => {
    render(<CharacterAvatar avatarKey="fox" />);
    expect(screen.getByLabelText('fox avatar')).toBeInTheDocument();
  });

  it('LevelNode disabled when locked', () => {
    render(<LevelNode levelId={5} state="locked" stars={0} />);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
  });

  it('LevelNode enabled when current', () => {
    const onSelect = vi.fn();
    render(
      <LevelNode levelId={3} state="current" stars={1} onSelect={onSelect} />
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it('NumeralTile renders number and pressed state', () => {
    render(<NumeralTile value={7} selected />);
    const tile = screen.getByRole('button', { name: /number 7/i });
    expect(tile).toHaveAttribute('aria-pressed', 'true');
    expect(tile.textContent).toContain('7');
  });
});
