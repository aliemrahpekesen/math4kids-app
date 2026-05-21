import { describe, it, expect, beforeEach } from 'vitest';
import { isFlagOn, setFlagOverride, clearFlagOverrides } from './index';

describe('feature flag registry', () => {
  beforeEach(() => {
    clearFlagOverrides();
  });

  it('returns false for every flag by default (v1 KVKK/GDPR-K posture)', () => {
    expect(isFlagOn('themes.jungle')).toBe(false);
    expect(isFlagOn('themes.ocean')).toBe(false);
    expect(isFlagOn('themes.candy')).toBe(false);
    expect(isFlagOn('voice.preRecorded')).toBe(false);
    expect(isFlagOn('errorReporting.sentry')).toBe(false);
    expect(isFlagOn('leaderboard.http')).toBe(false);
    expect(isFlagOn('sync.cloud')).toBe(false);
  });

  it('honors session overrides without mutating the compile-time defaults', () => {
    setFlagOverride('themes.jungle', true);
    expect(isFlagOn('themes.jungle')).toBe(true);
    expect(isFlagOn('themes.ocean')).toBe(false);
  });

  it('clears overrides on demand (used on parent-area exit)', () => {
    setFlagOverride('themes.ocean', true);
    expect(isFlagOn('themes.ocean')).toBe(true);
    clearFlagOverrides();
    expect(isFlagOn('themes.ocean')).toBe(false);
  });
});
