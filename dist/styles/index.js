"use strict";
/**
 * Central styles index for pseudoe
 *
 * Re-exports individual style modules and aggregates them into a single
 * read-only `STYLES` collection.
 *
 * Keep this file minimal — each style's word lists live in their own module.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.STYLES = void 0;
var african_1 = require("./african");
var fruits_1 = require("./fruits");
var galaxy_1 = require("./galaxy");
var insect_1 = require("./insect");
/**
 * STYLES
 *
 * Aggregated, read-only mapping of style name -> style data.
 */
exports.STYLES = {
    african: african_1.african,
    fruits: fruits_1.fruits,
    galaxy: galaxy_1.galaxy,
    insect: insect_1.insect,
};
/**
 * Default export for convenience.
 */
exports.default = exports.STYLES;
//# sourceMappingURL=index.js.map