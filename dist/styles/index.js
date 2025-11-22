/**
 * Central styles index for pseudoe
 *
 * Re-exports individual style modules and aggregates them into a single
 * read-only `STYLES` collection.
 *
 * Keep this file minimal — each style's word lists live in their own module.
 */
import { african } from "./african";
import { fruits } from "./fruits";
import { galaxy } from "./galaxy";
import { insect } from "./insect";
/**
 * STYLES
 *
 * Aggregated, read-only mapping of style name -> style data.
 */
export const STYLES = {
    african,
    fruits,
    galaxy,
    insect,
};
/**
 * Default export for convenience.
 */
export default STYLES;
//# sourceMappingURL=index.js.map