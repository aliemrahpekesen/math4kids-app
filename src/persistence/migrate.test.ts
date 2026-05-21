import { describe, it, expect, beforeEach } from 'vitest';
import { runMigrations, CURRENT_SCHEMA_VERSION } from './migrate';
import { lsGet } from './localStorageDriver';
import { MigrationError } from './errors';

describe('runMigrations', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('seeds schemaVersion on first run', async () => {
    expect(lsGet<number>('schemaVersion')).toBeNull();
    await runMigrations();
    expect(lsGet<number>('schemaVersion')).toBe(CURRENT_SCHEMA_VERSION);
  });

  it('is a no-op when schemaVersion already matches', async () => {
    window.localStorage.setItem(
      'm4k:schemaVersion',
      String(CURRENT_SCHEMA_VERSION)
    );
    await runMigrations();
    expect(lsGet<number>('schemaVersion')).toBe(CURRENT_SCHEMA_VERSION);
  });

  it('throws MigrationError if recorded > current (downgrade)', async () => {
    window.localStorage.setItem(
      'm4k:schemaVersion',
      String(CURRENT_SCHEMA_VERSION + 5)
    );
    await expect(runMigrations()).rejects.toBeInstanceOf(MigrationError);
  });
});
