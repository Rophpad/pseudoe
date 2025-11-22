import { formatPseudoe } from "./utils/formater";
import { ThreeDigitGenerator } from "./utils/digit-generator";
import STYLES from "./styles";
const digits = new ThreeDigitGenerator();
export class pseudoe {
    constructor(options) {
        console.log("pseudoe instance created");
        this.opts = options;
    }
    options(options) {
        this.opts = options;
    }
    default(tag = "pseudoe") {
        return formatPseudoe(`${tag}-${digits.next()}`, this.opts);
    }
    style(theme) {
        var _a;
        // Choose a valid style name; fall back to 'african' if the requested one is not available
        const styleName = theme && STYLES[theme]
            ? theme
            : "african";
        const styles = STYLES[styleName];
        // pick a random adjective and noun from the selected style
        const adjList = styles.adjectives;
        const nounList = styles.nouns;
        const rand = (n) => Math.floor(Math.random() * n);
        const adjective = adjList[rand(adjList.length)];
        const noun = nounList[rand(nounList.length)];
        // append a short deterministic token from the 3-digit generator (fallback to '000' if exhausted)
        const token = (_a = digits.next()) !== null && _a !== void 0 ? _a : "000";
        // return a composed token like: "adjective-noun-123"
        return formatPseudoe(`${adjective}-${noun}-${token}`, this.opts);
    }
}
//# sourceMappingURL=index.js.map