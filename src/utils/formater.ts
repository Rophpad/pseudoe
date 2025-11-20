// Add near the top of the file (after imports) --------------------------------
export type CaseStyle =
  | "lower"
  | "upper"
  | "kebab"
  | "snake"
  | "camel"
  | "pascal"
  | "none";

export interface FormatOptions {
  // separator between adjective and noun (or parts of the token)
  sep?: string;
  // casing transformation to apply after joining
  case?: CaseStyle;
  // optional prefix and suffix
  prefix?: string;
  suffix?: string;
  // when using UUID/hex tokens, how many characters to keep from the token segment
  tokenLength?: number;
  // if true, remove the hyphen that generateDefault uses (or use sep when provided)
  useUUID?: boolean;
}

// small utility to convert strings to camel/pascal/etc.
function applyCase(s: string, style?: CaseStyle): string {
  if (!style || style === "none") return s;
  if (style === "lower") return s.toLowerCase();
  if (style === "upper") return s.toUpperCase();
  // normalize: split on non-alphanum and on hyphen/underscore
  const parts = s.split(/[^A-Za-z0-9]+/).filter(Boolean);
  if (style === "kebab") return parts.map((p) => p.toLowerCase()).join("-");
  if (style === "snake") return parts.map((p) => p.toLowerCase()).join("_");
  if (style === "camel") {
    return parts
      .map((p, i) =>
        i === 0
          ? p.toLowerCase()
          : p.charAt(0).toUpperCase() + p.slice(1).toLowerCase(),
      )
      .join("");
  }
  if (style === "pascal") {
    return parts
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
      .join("");
  }
  return s;
}

// format a generated base string according to options
export function formatPseudoe(base: string, opts?: FormatOptions): string {
  const o: FormatOptions = opts || {};
  // If a tokenLength was requested and the base contains sections, apply to the last part.
  if (typeof o.tokenLength === "number" && o.tokenLength > 0) {
    // apply tokenLength to last hyphen/sep segment if present
    const parts = base.split(/[-_ ]+/);
    const last = parts[parts.length - 1];
    if (last && last.length > o.tokenLength) {
      parts[parts.length - 1] = last.slice(0, o.tokenLength);
      base = parts.join(o.sep ?? "-");
    }
  }

  // If a specific sep was requested, replace default separators with the requested one
  if (o.sep !== undefined) {
    // replace any common separators with the requested one
    base = base.replace(/[-_\s]+/g, o.sep);
  }

  // apply casing last (so separators are applied first)
  const cased = applyCase(base, o.case);

  // add prefix / suffix
  const pref = o.prefix ?? "";
  const suf = o.suffix ?? "";
  return `${pref}${cased}${suf}`;
}
