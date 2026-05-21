/**
 * Tiny localStorage driver — for keys that must be available synchronously
 * before any async IDB hydration completes. Per plan §3.6.
 */

export type SingletonKey =
  | 'activeProfileId'
  | 'language'
  | 'installHintDismissedAt'
  | 'schemaVersion';

const PREFIX = 'm4k:';

export function lsGet<T>(key: SingletonKey): T | null {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function lsSet<T>(key: SingletonKey, value: T): void {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // localStorage full or unavailable — swallow per defense-in-depth.
  }
}

export function lsRemove(key: SingletonKey): void {
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    // ignore
  }
}
