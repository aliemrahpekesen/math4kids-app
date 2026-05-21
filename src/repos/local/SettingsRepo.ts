import { idbGet, idbSet, KEY } from '../../persistence/idbDriver';
import type { SettingsRepo } from '../types';
import type { ParentAuth, ParentPrefs } from '../../state/types';

const PARENT_AUTH_KEY = KEY.global('parentAuth');
const PARENT_PREFS_KEY = KEY.global('parentPrefs');

export class LocalSettingsRepo implements SettingsRepo {
  async loadParentAuth(): Promise<ParentAuth | null> {
    const v = await idbGet<ParentAuth>(PARENT_AUTH_KEY);
    return v ?? null;
  }

  async saveParentAuth(value: ParentAuth): Promise<void> {
    await idbSet(PARENT_AUTH_KEY, value);
  }

  async loadParentPrefs(): Promise<ParentPrefs | null> {
    const v = await idbGet<ParentPrefs>(PARENT_PREFS_KEY);
    return v ?? null;
  }

  async saveParentPrefs(value: ParentPrefs): Promise<void> {
    await idbSet(PARENT_PREFS_KEY, value);
  }
}
