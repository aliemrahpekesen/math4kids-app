import { get, set, del, keys, createStore, type UseStore } from 'idb-keyval';
import { QuotaExceededError } from './errors';

const DB_NAME = 'math4kids';
const STORE_NAME = 'm4k-store';

let store: UseStore | null = null;

function getStore(): UseStore {
  store ??= createStore(DB_NAME, STORE_NAME);
  return store;
}

export async function idbGet<T>(key: string): Promise<T | undefined> {
  return await get<T>(key, getStore());
}

export async function idbSet<T>(key: string, value: T): Promise<void> {
  try {
    await set(key, value, getStore());
  } catch (err) {
    if (err instanceof DOMException && err.name === 'QuotaExceededError') {
      throw new QuotaExceededError();
    }
    throw err;
  }
}

export async function idbDel(key: string): Promise<void> {
  await del(key, getStore());
}

export async function idbKeys(): Promise<string[]> {
  const result = await keys(getStore());
  return result.filter((k): k is string => typeof k === 'string');
}

/** Key namespaces — strict prefixes per plan §3.6. */
export const KEY = {
  profile: (uuid: string, domain: string) => `profile:${uuid}:${domain}`,
  global: (domain: string) => `global:${domain}`,
} as const;
