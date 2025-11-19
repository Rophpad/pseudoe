# Pseudoe

Pseudoe is a tiny, modular TypeScript pseudonym generator. The codebase is intentionally minimal and focused on producing short, readable pseudonyms and providing a small formatting utility.

This README reflects the current source layout and the precise public surface exposed by the code in this repository.

---

## Minimal project layout

- `pseudoe/src/`
  - `index.ts` — public entry (exports `pseudoe` factory)
  - `generator.ts` — generator implementation (currently exposes `generateDefault`)
  - `formater.ts` — formatting helpers and `FormatOptions` types
  - `styles/` — style word lists (e.g. `african`, `fruits`, `galaxy`, `insect`)
  - `utils/` — crypto, random and hash helpers
- `pseudoe/test/` — smoke test: `pseudoe-usage.test.ts`
- `pseudoe/tsconfig.json` — TypeScript configuration

You can inspect the important files directly:

```pseudoe/src/index.ts#L1-40
import { generateDefault } from "./generator";

export const pseudoe = () => {
  return { generateDefault };
};
```

```pseudoe/src/generator.ts#L1-120
import { formatPseudo, FormatOptions } from "./formater";

export function generateDefault(opts?: FormatOptions, tag?: string): string {
  return formatPseudo(`${tag}-${Math.random()}`, opts);
}
```

```pseudoe/src/formater.ts#L1-220
// Exports FormatOptions and formatPseudo(base, opts)
export type CaseStyle = 'lower'|'upper'|'kebab'|'snake'|'camel'|'pascal'|'none';
export interface FormatOptions {
  sep?: string;
  case?: CaseStyle;
  prefix?: string;
  suffix?: string;
  tokenLength?: number;
  useUUID?: boolean;
}
export function formatPseudo(base: string, opts?: FormatOptions): string { ... }
```

---

## Current public API (accurate)

At present the repository exposes a minimal public surface via `pseudoe/src/index.ts`:

- `pseudoe()` — a small factory that returns an object with the `generateDefault` function.

Usage pattern (current code):

```pseudoe/README.md#L1-20
import { pseudoe } from './src'
const api = pseudoe()
const result = api.generateDefault({ sep: '_' }, 'tag')
// result is a formatted string produced by formatPseudo(`${tag}-${Math.random()}`, opts)
```

Notes:
- `generateDefault(opts?: FormatOptions, tag?: string)` constructs a base token using `${tag}-${Math.random()}` and then calls `formatPseudo` with the provided options.
- `FormatOptions` is defined in `formater.ts` and supports `sep`, `case`, `prefix`, `suffix`, and `tokenLength` among others.

---

## Formatting options

Formatting is handled centrally by `formater.ts` via `formatPseudo(base, opts)`.

Key options:
- `sep?: string` — separator used to join tokens (default `'-'`); `''` produces no separator.
- `case?: 'lower'|'upper'|'kebab'|'snake'|'camel'|'pascal'|'none'` — casing transformation applied after joining.
- `prefix` and `suffix` — strings to prepend/append to the final pseudo.
- `tokenLength?: number` — truncates the last token segment to the requested length before applying sep/case.

Because `generateDefault` simply formats a base string built from `tag` and a random number, the formatting options determine the final shape.

---

## Styles & Deterministic generation

- Style lists live under `pseudoe/src/styles/`. Each style exports `adjectives` and `nouns`.
- The current codebase focuses on `generateDefault`; other style-based or deterministic functions were present previously but are not the active minimal API in the code you currently have.

If you want to add `generateFromStyle`, `generateCombo` or `generateCryptedSync` back into `generator.ts`, follow the approach in `formater.ts`:
1. produce the raw base (adjective + noun or deterministic pick)
2. call `formatPseudo(raw, opts)` to produce the final formatted pseudo

---

## Tests / smoke script

A simple smoke/test script exists at:

```pseudoe/test/pseudoe-usage.test.ts#L1-200
// a simple script that imports `pseudoe`, calls the available functions and performs light runtime checks
```

Run it with:
- Quick (no build): `npx ts-node test/pseudoe-usage.test.ts`
- Build & run:
  - `npx tsc -p tsconfig.json`
  - `node dist/test/pseudoe-usage.test.js`

---

## Notes & next steps

- The current code is intentionally minimal. If you want the library to expose a more ergonomic API (for example: `import pseudoe from 'pseudoe'` and then `pseudoe()` directly returning strings rather than a factory), I can update `index.ts` to export `generateDefault` (or `pseudoe`) directly.
- To reintroduce style-based generation or deterministic name hashing, implement the selection logic in `generator.ts` and then reuse `formatPseudo` to ensure consistent formatting.
- If you want, I can:
  - Update `index.ts` to export functions in a more conventional manner,
  - Add `generateFromStyle` and `generateCryptedSync` implementations that use the same formatting pipeline,
  - Or add examples showing the exact shape of `FormatOptions` usage.

---

## License

MIT (add a LICENSE file when you publish)