/**
 * hash.ts
 *
 * Replace ESM-only `uuid` import with a small, dependency-free UUID generator
 * that prefers platform crypto APIs. Exposes `uuidToNumber()` which produces a
 * reproducible numeric value derived from a generated UUID. The implementation
 * avoids BigInt to remain compatible with older TS targets by converting only
 * the first 12 hex characters (48 bits) of the UUID to a Number (safe within
 * JS Number precision).
 *
 * Strategy:
 *  - Prefer `globalThis.crypto.randomUUID()` (browser)
 *  - Then Node's `crypto.randomUUID()` when available
 *  - Then Node's `crypto.randomBytes(16)` and format as UUID v4
 *  - Finally fall back to Math.random-derived hex
 *
 * `uuidToNumber()` returns a positive integer derived from the first 12 hex
 * characters of the UUID (value in range [0, 2^48)).
 */

import { getNodeCrypto } from "./crypto";

/**
 * Build a UUID v4 string from a Node Buffer/Uint8Array of 16 random bytes.
 * Format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 */
function uuidFromBytes(bytes: Uint8Array | Buffer): string {
  // Ensure we have 16 bytes
  const b = bytes instanceof Uint8Array ? bytes : Uint8Array.from(bytes as any);
  if (b.length < 16) {
    const arr = new Uint8Array(16);
    arr.set(b);
    for (let i = b.length; i < 16; i++)
      arr[i] = Math.floor(Math.random() * 256);
    return uuidFromBytes(arr);
  }

  // Set the version to 4 -> xxxx4xxx
  b[6] = (b[6] & 0x0f) | 0x40;
  // Set the variant to 10xx (RFC 4122)
  b[8] = (b[8] & 0x3f) | 0x80;

  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  const hex = Array.from(b).map(toHex).join("");
  return (
    hex.substring(0, 8) +
    "-" +
    hex.substring(8, 12) +
    "-" +
    hex.substring(12, 16) +
    "-" +
    hex.substring(16, 20) +
    "-" +
    hex.substring(20, 32)
  );
}

/**
 * Generate a UUID string using the best available API.
 */
function generateUUID(): string {
  // Browser: globalThis.crypto.randomUUID()
  if (
    typeof globalThis !== "undefined" &&
    (globalThis as any).crypto &&
    typeof (globalThis as any).crypto.randomUUID === "function"
  ) {
    try {
      return (globalThis as any).crypto.randomUUID();
    } catch (e) {
      // fall through
    }
  }

  // Node: prefer node crypto module
  const nodeCrypto = getNodeCrypto();
  if (nodeCrypto) {
    try {
      if (typeof nodeCrypto.randomUUID === "function") {
        return nodeCrypto.randomUUID();
      }
      if (typeof nodeCrypto.randomBytes === "function") {
        const buf: Buffer = nodeCrypto.randomBytes(16);
        return uuidFromBytes(buf);
      }
    } catch (e) {
      // fall through
    }
  }

  // Last-resort fallback: pseudo-random hex via Math.random
  const rndHex = (len: number) =>
    Array.from({ length: len })
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join("");
  // produce UUID-like structure (not cryptographically strong)
  return (
    rndHex(8) +
    "-" +
    rndHex(4) +
    "-" +
    "4" +
    rndHex(3) + // version nibble set to 4
    "-" +
    ((8 + Math.floor(Math.random() * 4)).toString(16) + rndHex(3)) + // variant
    "-" +
    rndHex(12)
  );
}

/**
 * Convert a generated UUID into a numeric value.
 *
 * Implementation note:
 * - We convert only the first 12 hex characters (48 bits) of the UUID to avoid
 *   exceeding the safe integer range for JavaScript Numbers (53 bits).
 * - The returned number will be in range [0, 2^48).
 */
export function uuidToNumber(): number {
  const u = generateUUID();
  const hex = u.replace(/-/g, "");
  const first12 = hex.slice(0, 12); // 12 hex chars -> 48 bits
  // parseInt of 12 hex chars is safe in JS Number
  const n = parseInt(first12, 16);
  // ensure non-NaN
  return Number.isFinite(n) ? n : 0;
}

export default { uuidToNumber };
