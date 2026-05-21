import { describe, it, expect } from 'vitest';
import {
  hashPin,
  verifyPin,
  validateEmail,
  recordFailedAttempt,
  resetLockout,
} from './parentSettings';

describe('parentSettings engine', () => {
  it('hashes a PIN and verifies it round-trip', async () => {
    const { hash, salt } = await hashPin('1234');
    expect(await verifyPin('1234', hash, salt)).toBe(true);
    expect(await verifyPin('5678', hash, salt)).toBe(false);
  });

  it('validates email RFC-shaped strings', () => {
    expect(validateEmail('foo@bar.com')).toBe(true);
    expect(validateEmail('foo+a@b.co.uk')).toBe(true);
    expect(validateEmail('not-an-email')).toBe(false);
    expect(validateEmail('foo@bar')).toBe(false);
    expect(validateEmail('')).toBe(false);
  });

  it('records first attempt without lockout', () => {
    const r = recordFailedAttempt({ failedAttempts: 0 });
    expect(r.state.failedAttempts).toBe(1);
    expect(r.cooldownMs).toBeNull();
  });

  it('triggers 30s cooldown on 3rd failed attempt', () => {
    const r = recordFailedAttempt({ failedAttempts: 2, cycleCount: 0 });
    expect(r.cooldownMs).toBe(30_000);
    expect(r.state.lockedUntil).toBeTruthy();
    expect(r.cycleCount).toBe(1);
  });

  it('escalates to 5-minute cooldown after 3 cooldown cycles', () => {
    const r = recordFailedAttempt({ failedAttempts: 2, cycleCount: 3 });
    expect(r.cooldownMs).toBe(5 * 60_000);
    expect(r.cycleCount).toBe(4);
  });

  it('resetLockout clears attempts', () => {
    expect(resetLockout()).toEqual({ failedAttempts: 0 });
  });
});
