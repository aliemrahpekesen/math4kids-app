/**
 * PIN hashing per ADR-0007 (queued parent-gate): PBKDF2-SHA-256, 210k
 * iterations, 16-byte salt. SubtleCrypto runs off-thread on most browsers
 * — no UI block on a modern device.
 */
const ITERATIONS = 210_000;
const SALT_BYTES = 16;
const HASH_BITS = 256;

function toHex(buf: ArrayBuffer | Uint8Array): string {
  const view = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  return Array.from(view)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function fromHex(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

function uintToArrayBuffer(u: Uint8Array): ArrayBuffer {
  const ab = new ArrayBuffer(u.byteLength);
  new Uint8Array(ab).set(u);
  return ab;
}

async function deriveBits(
  pin: string,
  saltBytes: Uint8Array
): Promise<ArrayBuffer> {
  const enc = new TextEncoder();
  const pinView = enc.encode(pin);
  const pinBuf = uintToArrayBuffer(pinView);
  const saltBuf = uintToArrayBuffer(saltBytes);
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    pinBuf,
    'PBKDF2',
    false,
    ['deriveBits']
  );
  return crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt: saltBuf,
      iterations: ITERATIONS,
    },
    keyMaterial,
    HASH_BITS
  );
}

export async function hashPin(
  pin: string
): Promise<{ hash: string; salt: string }> {
  const saltBytes = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const hashBuf = await deriveBits(pin, saltBytes);
  return { hash: toHex(hashBuf), salt: toHex(saltBytes) };
}

export async function verifyPin(
  pin: string,
  expectedHashHex: string,
  saltHex: string
): Promise<boolean> {
  const saltBytes = fromHex(saltHex);
  const hashBuf = await deriveBits(pin, saltBytes);
  const candidate = toHex(hashBuf);
  if (candidate.length !== expectedHashHex.length) return false;
  let diff = 0;
  for (let i = 0; i < candidate.length; i++) {
    diff |= candidate.charCodeAt(i) ^ expectedHashHex.charCodeAt(i);
  }
  return diff === 0;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEmail(email: string): boolean {
  return EMAIL_RE.test(email);
}

export interface PinLockoutState {
  failedAttempts: number;
  lockedUntil?: string;
}

const FIRST_COOLDOWN_MS = 30_000;
const ESCALATED_COOLDOWN_MS = 5 * 60_000;
const ATTEMPTS_BEFORE_LOCKOUT = 3;
const CYCLES_BEFORE_ESCALATE = 3;

export interface RecordAttemptInput extends PinLockoutState {
  cycleCount?: number;
  now?: number;
}

export interface RecordAttemptResult {
  state: PinLockoutState;
  cooldownMs: number | null;
  cycleCount: number;
}

export function recordFailedAttempt(
  input: RecordAttemptInput
): RecordAttemptResult {
  const now = input.now ?? Date.now();
  const failedAttempts = input.failedAttempts + 1;
  let cycleCount = input.cycleCount ?? 0;
  if (failedAttempts >= ATTEMPTS_BEFORE_LOCKOUT) {
    cycleCount += 1;
    const cooldown =
      cycleCount > CYCLES_BEFORE_ESCALATE
        ? ESCALATED_COOLDOWN_MS
        : FIRST_COOLDOWN_MS;
    return {
      state: {
        failedAttempts: 0,
        lockedUntil: new Date(now + cooldown).toISOString(),
      },
      cooldownMs: cooldown,
      cycleCount,
    };
  }
  return {
    state: { failedAttempts },
    cooldownMs: null,
    cycleCount,
  };
}

export function resetLockout(): PinLockoutState {
  return { failedAttempts: 0 };
}

export function remainingCooldownMs(
  state: PinLockoutState,
  now = Date.now()
): number {
  if (!state.lockedUntil) return 0;
  const until = new Date(state.lockedUntil).getTime();
  return Math.max(0, until - now);
}

/**
 * "Forgot PIN" recovery challenge — a multi-step arithmetic problem
 * a 6-year-old cannot reasonably solve in their head. Generated from
 * a seed so the prompt + answer are deterministic per session.
 *
 * Pattern: (a × b) + c − d
 *   a ∈ [11, 19], b ∈ [3, 9]  → product 33..171
 *   c ∈ [10, 49], d ∈ [10, 49]
 *
 * Adult mental-math feasible, kindergarten reach: no.
 */
export interface ForgotPinChallenge {
  prompt: string;
  answer: number;
}

export function generateForgotPinChallenge(seed: number): ForgotPinChallenge {
  let s = seed >>> 0 || 1;
  const next = (): number => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const pick = (min: number, max: number): number =>
    Math.floor(next() * (max - min + 1)) + min;

  const a = pick(11, 19);
  const b = pick(3, 9);
  const c = pick(10, 49);
  const d = pick(10, 49);
  return {
    prompt: `(${a} × ${b}) + ${c} − ${d}`,
    answer: a * b + c - d,
  };
}
