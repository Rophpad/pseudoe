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

## Usage examples

TypeScript / modern ESM usage:

```pseudoe/src/examples/usage.ts#L1-40
import { pseudoe } from "./src"; // adjust the import path for your build

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

Common call patterns:
- Use `new pseudoe({...})` to create an instance.
- Use `.default(tag?)` when you want a short tag + token.
- Use `.style(theme?)` to get adjective+noun+token tokens.
- Use `.options({...})` to change formatting options on the instance.

If you prefer a single-call utility (functional style) instead of instantiating a class, you can easily wrap the instance in a small helper.

---

## Examples to run (local)

- Quick (no build) with ts-node (if you have it installed):
  - `npx ts-node test/pseudoe-usage.test.ts` (update the test to import/construct the class-based API).

- Build & run:
  - `npx tsc -p tsconfig.json`
  - `node dist/test/pseudoe-usage.test.js`

Note: the repository's example test may need minor changes if it was written for a previous factory-based API. Replace factory usage with `new pseudoe(...)` and method calls as shown above.

---

## Next steps / customization ideas

- Add a convenience default export that constructs a `pseudoe` instance for one-off use.
- Add a seedable RNG to make `.style()` deterministic across runs.
- Add methods that return the raw token parts (object shape) in addition to the formatted string.
- Add more styles or allow passing custom adjective/noun lists.

---

## License

MIT (add a LICENSE file when publishing)