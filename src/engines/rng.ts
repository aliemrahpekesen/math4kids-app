/**
 * Tiny seeded PRNG (mulberry32). Same seed → same sequence, which keeps
 * quiz/exercise generators replayable for the same level.
 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickInt(rand: () => number, min: number, max: number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}

export function shuffle<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = a[i] as T;
    a[i] = a[j] as T;
    a[j] = tmp;
  }
  return a;
}

export function pickN<T>(arr: T[], n: number, rand: () => number): T[] {
  return shuffle(arr, rand).slice(0, n);
}
