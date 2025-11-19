/**
 * crypto.ts
 *
 * Small, self-contained utilities for detecting Node's crypto, performing a
 * synchronous sha256-style fallback, and a few helpers to support deterministic
 * selection from byte buffers.
 *
 * The module intentionally avoids importing ESM-only packages and is safe to
 * require() in CommonJS contexts.
 */

/* eslint-disable @typescript-eslint/no-var-requires */

type MaybeNodeCrypto = any;

let _nodeCrypto: MaybeNodeCrypto | null | undefined = undefined;

/**
 * Detects whether a Node-like `crypto` module is available synchronously.
 *
 * This function caches the detection result on the first call.
 */
export function hasNodeCrypto(): boolean {
  if (typeof _nodeCrypto !== "undefined") {
    return _nodeCrypto !== null;
  }

  try {
    // Quick heuristic: if process.versions.node exists it's likely Node.
    if (
      typeof process !== "undefined" &&
      (process as any).versions &&
      (process as any).versions.node
    ) {
      // Use require wrapped in try/catch so bundlers that don't provide require won't crash.
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const c = require("crypto");
      _nodeCrypto = c || null;
      return !!_nodeCrypto;
    }
  } catch (e) {
    _nodeCrypto = null;
    return false;
  }

  // Not Node (likely browser); mark as null to avoid repeated checks.
  _nodeCrypto = null;
  return false;
}

/**
 * Return the Node crypto module when available, otherwise `null`.
 * The result is cached after the first call.
 */
export function getNodeCrypto(): MaybeNodeCrypto | null {
  if (typeof _nodeCrypto !== "undefined") return _nodeCrypto ?? null;
  // Ensure detection runs
  hasNodeCrypto();
  return _nodeCrypto ?? null;
}

/**
 * Synchronous SHA-256-like function.
 *
 * - In Node.js (when available) it returns a Buffer containing the actual SHA-256 digest.
 * - Otherwise it returns a deterministic, non-cryptographic Uint8Array of length 32
 *   derived from a DJB2-inspired mixing routine. This is deterministic and useful
 *   for generating repeatable pseudonyms in browsers when sync hashing isn't available.
 */
export function sha256SyncFallback(input: string): Uint8Array | Buffer {
  const nodeCrypto = getNodeCrypto();
  if (nodeCrypto && typeof nodeCrypto.createHash === "function") {
    // Node path: return real sha256 Buffer
    return nodeCrypto
      .createHash("sha256")
      .update(String(input), "utf8")
      .digest();
  }

  // Deterministic DJB2-style fallback -> produce 32 bytes
  let h = 5381 >>> 0;
  for (let i = 0; i < input.length; i++) {
    h = ((h << 5) + h + input.charCodeAt(i)) >>> 0; // h * 33 + c
  }

  const out = new Uint8Array(32);
  let v = h >>> 0;
  for (let i = 0; i < out.length; i++) {
    // Simple LCG-style mixing to fill more bytes deterministically
    v = (v * 1664525 + 1013904223) >>> 0;
    out[i] = v & 0xff;
  }

  return out;
}

/**
 * Pick a random element from an array.
 * - If `rnd` provided, it should be a function returning numbers in [0,1).
 * - Returns `undefined` for empty arrays.
 */
export function randomPick<T>(
  arr: ReadonlyArray<T>,
  rnd?: () => number,
): T | undefined {
  if (!arr || arr.length === 0) return undefined;
  const r = typeof rnd === "function" ? rnd() : Math.random();
  const idx = Math.floor(r * arr.length);
  return arr[idx];
}

/**
 * Convert up to the first 6 bytes of a bytes-like value to an index in [0, max).
 * This function is used for deterministic selection from style lists.
 */
export function bytesToIndices(
  bytes: Uint8Array | Buffer | number[],
  max: number,
): number {
  if (!bytes || max <= 0) return 0;
  let n = 0 >>> 0;
  const limit = Math.min(bytes.length, 6);
  for (let i = 0; i < limit; i++) {
    const b = (bytes as any)[i] as number;
    n = ((n * 256) >>> 0) + (b & 0xff);
    n = n >>> 0;
  }
  return n % max;
}

/**
 * Deterministically select an adjective and noun from a style object using a
 * bytes-like buffer. Returns a joined string using `sep` (default '-').
 *
 * - `styleObj` must have `adjectives` and `nouns` arrays.
 * - `bytes` may be a Buffer, Uint8Array or number[].
 * - `sep` can be '' to join without separator.
 */
export function pickFromStyleDeterministic(
  styleObj: { adjectives: ReadonlyArray<string>; nouns: ReadonlyArray<string> },
  bytes: Uint8Array | Buffer | number[],
  sep: string = "-",
): string {
  const adjLen = styleObj.adjectives.length || 1;
  const nounLen = styleObj.nouns.length || 1;

  const adjBytes = (bytes as any).subarray
    ? (bytes as Uint8Array).subarray(0, 6)
    : (bytes as number[]).slice(0, 6);
  const nounBytes = (bytes as any).subarray
    ? (bytes as Uint8Array).subarray(6, 12)
    : (bytes as number[]).slice(6, 12);

  const adjIdx = bytesToIndices(adjBytes as any, adjLen);
  const nounIdx = bytesToIndices(nounBytes as any, nounLen);

  const adj = styleObj.adjectives[adjIdx] ?? styleObj.adjectives[0];
  const noun = styleObj.nouns[nounIdx] ?? styleObj.nouns[0];

  return `${adj}${sep}${noun}`;
}

/**
 * Convenience export grouping common utilities.
 */
export const utils = {
  hasNodeCrypto,
  getNodeCrypto,
  sha256SyncFallback,
  randomPick,
  bytesToIndices,
  pickFromStyleDeterministic,
};

export default utils;
