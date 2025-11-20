import { formatPseudo, FormatOptions } from "./utils/formater";
import { ThreeDigitGenerator } from "./utils/digit-generator";

const gen = new ThreeDigitGenerator();

export function generateDefault(
  opts?: FormatOptions,
  tag: string = "pseudoe",
): string {
  return formatPseudo(`${tag}-${gen.next()}`, opts);
}

// export function generateFromStyle(opts?: FormatOptions, style?: string): string {
//   return
// }
