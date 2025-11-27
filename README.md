# Pseudoe

Pseudoe is a tiny, modular TypeScript pseudonym generator. The public API in this repository is implemented as a class named `pseudoe` exposed from `pseudoe/src/index.ts`. This README documents the class-based API, available options, styles, and usage examples.

---

## Quick overview

- API surface: a class `pseudoe` that you instantiate with formatting options.
- Two primary generation methods:
  - `.default(tag?: string)` — generates a base token using a 3-digit token (e.g. `pseudoe-042`) and applies formatting options.
  - `.style(theme?: string)` — picks an adjective + noun from the requested style, appends the 3-digit token, and applies formatting options (e.g. `ripe-mango-042`).

The class keeps an internal `FormatOptions` object you can update after construction using `.options(...)`.

You can inspect the class in source:
```pseudoe/src/index.ts#L1-120
export class pseudoe {
  private opts: FormatOptions;

  constructor(options: FormatOptions) {
    console.log("pseudoe instance created");
    this.opts = options;
  }

  options(options: FormatOptions) {
    this.opts = options;
  }

  default(tag: string = "pseudoe"): string {
    return formatPseudoe(`${tag}-${digits.next()}`, this.opts);
  }

  style(theme?: string): string {
    // selects adjective/noun from chosen style, appends token, calls formatPseudoe(...)
  }
}
```

---

## FormatOptions

Formatting is handled by `formatPseudoe(base, opts)` (see `pseudoe/src/utils/formater.ts`). The available options are:

- `sep?: string` — separator used to join parts (default `'-'`). Example: `sep: '_'`.
- `case?: 'lower' | 'upper' | 'kebab' | 'snake' | 'camel' | 'pascal' | 'none'` — final casing transformation.
- `prefix?: string` — string to prepend to the final pseudo.
- `suffix?: string` — string to append to the final pseudo.
- `tokenLength?: number` — when present, truncates the last token segment to this length.
- `useUUID?: boolean` — reserved for use with UUID/hex token implementations (present in the type for future extensions).

Example (source showing the shape of the type):
```pseudoe/src/utils/formater.ts#L1-80
export interface FormatOptions {
  sep?: string;
  case?: CaseStyle;
  prefix?: string;
  suffix?: string;
  tokenLength?: number;
  useUUID?: boolean;
}
```

---

## Styles

Built-in styles live under `pseudoe/src/styles/`. The available style keys are:

- `african`
- `fruits`
- `galaxy`
- `insect`

Each style exports two read-only arrays: `adjectives` and `nouns`. The `.style(theme?)` method picks one adjective and one noun at random from the selected style and appends the 3-digit token.

Example: (showing where styles are aggregated)
```pseudoe/src/styles/index.ts#L1-80
export const STYLES = {
  african,
  fruits,
  galaxy,
  insect,
} as const;
```

---

## Token behavior

The library uses a `ThreeDigitGenerator` which builds a pool of strings `"000"` through `"999"`, shuffles them, and pops values on each call. This gives short, non-sequential 3-digit tokens for readability. If the pool is exhausted, code paths may fall back to a default token (e.g. `"000"`).

You can inspect the generator here:
```pseudoe/src/utils/digit-generator.ts#L1-120
export class ThreeDigitGenerator {
  private pool: string[];
  constructor() { /* creates ["000","001",...,"999"] and shuffles */ }
  next(): string | null {
    return this.pool.pop() || null;
  }
}
```

---

## Installation

Install the published package from npm:

```pseudoe/README.md#L1-6
# Install from npm (recommended)
npm install pseudoe
```

Or, to test the local repository during development:

```pseudoe/README.md#L1-4
# Install locally (from the project root)
npm install
# Or, link the package for local testing:
npm link
```

## Usage

Below are examples showing how to consume the library in both modern ESM/TypeScript and CommonJS environments.

TypeScript / ESM usage (recommended when using bundlers or native ESM):

```pseudoe/src/examples/usage.ts#L1-40
import { pseudoe } from "pseudoe"; // or import { pseudoe } from "../dist" for local tests

// Create an instance with formatting options:
const api = new pseudoe({ sep: "_", case: "pascal" });

// Generate using default token generator + tag:
const name1 = api.default("user"); // => e.g. "User_123" (after casing/sep applied)
console.log(name1);

// Generate using a named style:
const name2 = api.style("fruits"); // => e.g. "Blushing_Mango_456"
console.log(name2);

// Update options later:
api.options({ sep: "-", case: "kebab", prefix: "app-" });
console.log(api.style("galaxy")); // => e.g. "app-andromeda-walker-789"
```

CommonJS usage (Node.js without ESM / when using the compiled `dist` output):

```pseudoe/test/pseudoe-usage.test.js#L1-12
const { pseudoe } = require("pseudoe"); // or require("../dist") for local test

const pseudo = new pseudoe({ sep: "-", case: "kebab" });
console.log(pseudo.default());      // e.g. "pseudoe-042" transformed by opts
console.log(pseudo.style("african"));// e.g. "ripe-mango-123"
```

Common call patterns:
- Use `new pseudoe({...})` to create an instance configured with `FormatOptions`.
- Use `.default(tag?)` when you want a short tag + token.
- Use `.style(theme?)` to get adjective+noun+token tokens.
- Use `.options({...})` to change formatting options on the instance.

If you prefer a single-call utility (functional style) instead of instantiating a class, you can easily wrap the instance in a small helper.

---

## Running locally

- Quick (no build) with ts-node (if you have it installed):
  - `npx ts-node test/pseudoe-usage.test.ts`
  - When running via `ts-node`, import the TypeScript source (`import { pseudoe } from "../src";`) or compile-first as shown below.

- Build & run:
  - Compile: `npx tsc -p tsconfig.json`
  - Run the compiled test/script (CommonJS): `node dist/test/pseudoe-usage.test.js`
  - Or import the compiled library from `dist` in your app: `const { pseudoe } = require('pseudoe')` (when installed) or `require('./dist')` (local).

Note: the repository's example test may need minor changes depending on whether you run it against the source (TS/ESM) or the compiled `dist` output (CommonJS). If you run the compiled CommonJS output with Node, use `require()`; for native ESM imports use the ESM build or adjust `package.json`/`tsconfig.json` to emit ESM.

---

## Next steps / customization ideas

- Add more styles or allow passing custom adjective/noun lists.

---

## License

MIT
