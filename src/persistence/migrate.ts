import { lsGet, lsSet } from './localStorageDriver';
import { MigrationError } from './errors';

export const CURRENT_SCHEMA_VERSION = 1;

type MigrationFn = () => Promise<void>;

const migrations: Record<number, MigrationFn> = {
  // Future: 1: async () => { /* v0 → v1 transform */ },
};

/**
 * Boot-time migration runner. Per plan.md §3.6 + R8:
 *  - absent → seed at current version
 *  - older → run sequential transforms
 *  - irrecoverable → throw MigrationError (GlobalErrorBoundary surfaces it)
 */
export async function runMigrations(): Promise<void> {
  const recorded = lsGet<number>('schemaVersion');
  if (recorded === null) {
    lsSet('schemaVersion', CURRENT_SCHEMA_VERSION);
    return;
  }
  if (recorded === CURRENT_SCHEMA_VERSION) return;
  if (recorded > CURRENT_SCHEMA_VERSION) {
    throw new MigrationError(
      `Local schema v${recorded} is newer than app v${CURRENT_SCHEMA_VERSION}`
    );
  }
  for (let v = recorded + 1; v <= CURRENT_SCHEMA_VERSION; v++) {
    const fn = migrations[v];
    if (!fn) {
      throw new MigrationError(`No migration registered for v${v}`);
    }
    await fn();
  }
  lsSet('schemaVersion', CURRENT_SCHEMA_VERSION);
}
