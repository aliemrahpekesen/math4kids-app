import { describe, it, expect, beforeEach } from 'vitest';
import { useProgressStore } from './progressStore';

describe('progressStore — balanced 3-star rubric', () => {
  beforeEach(() => {
    useProgressStore.getState().reset();
  });

  it('grants 3 stars at ≥85% accuracy with ≤1 hint', () => {
    const { stars, unlocked } = useProgressStore.getState().recordResult({
      levelId: 1,
      accuracy: 0.85,
      hintsUsed: 1,
      elapsedMs: 60_000,
    });
    expect(stars).toBe(3);
    expect(unlocked).toBe(2);
  });

  it('grants 2 stars at ≥85% accuracy with 2 hints (hint cap broken)', () => {
    const { stars, unlocked } = useProgressStore.getState().recordResult({
      levelId: 1,
      accuracy: 0.85,
      hintsUsed: 2,
      elapsedMs: 60_000,
    });
    expect(stars).toBe(2);
    expect(unlocked).toBeNull();
  });

  it('grants 2 stars at 70% accuracy', () => {
    const { stars } = useProgressStore.getState().recordResult({
      levelId: 1,
      accuracy: 0.7,
      hintsUsed: 0,
      elapsedMs: 60_000,
    });
    expect(stars).toBe(2);
  });

  it('grants 1 star below 70% accuracy', () => {
    const { stars } = useProgressStore.getState().recordResult({
      levelId: 1,
      accuracy: 0.5,
      hintsUsed: 0,
      elapsedMs: 60_000,
    });
    expect(stars).toBe(1);
  });

  it('grants 0 stars for zero accuracy', () => {
    const { stars } = useProgressStore.getState().recordResult({
      levelId: 1,
      accuracy: 0,
      hintsUsed: 0,
      elapsedMs: 60_000,
    });
    expect(stars).toBe(0);
  });

  it('keeps best stars when replayed', () => {
    const store = useProgressStore.getState();
    store.recordResult({
      levelId: 1,
      accuracy: 0.85,
      hintsUsed: 0,
      elapsedMs: 60_000,
    });
    store.recordResult({
      levelId: 1,
      accuracy: 0.5,
      hintsUsed: 0,
      elapsedMs: 30_000,
    });
    expect(useProgressStore.getState().levels[1]?.bestStars).toBe(3);
    expect(useProgressStore.getState().levels[1]?.attempts).toBe(2);
  });
});
