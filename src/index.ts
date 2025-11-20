import { formatPseudoe, FormatOptions } from "./utils/formater";
import { ThreeDigitGenerator } from "./utils/digit-generator";
import STYLES from "./styles";

const digits = new ThreeDigitGenerator();

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
    // Choose a valid style name; fall back to 'african' if the requested one is not available
    const styleName =
      theme && (STYLES as any)[theme]
        ? (theme as keyof typeof STYLES)
        : "african";
    const styles = STYLES[styleName];

    // pick a random adjective and noun from the selected style
    const adjList = styles.adjectives;
    const nounList = styles.nouns;
    const rand = (n: number) => Math.floor(Math.random() * n);

    const adjective = adjList[rand(adjList.length)];
    const noun = nounList[rand(nounList.length)];

    // append a short deterministic token from the 3-digit generator (fallback to '000' if exhausted)
    const token = digits.next() ?? "000";

    // return a composed token like: "adjective-noun-123"
    return formatPseudoe(`${adjective}-${noun}-${token}`, this.opts);
  }
}
