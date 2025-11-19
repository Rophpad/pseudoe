import { formatPseudo, FormatOptions } from "./formater";

export function generateDefault(opts?: FormatOptions, tag?: string): string {
  return formatPseudo(`${tag}-${Math.random()}`, opts);
}

// export function generateFromStyle(opts?: FormatOptions, style?: string): string {
//   return
// }
