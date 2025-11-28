"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pseudoe = void 0;
var formater_1 = require("./utils/formater");
var digit_generator_1 = require("./utils/digit-generator");
var styles_1 = __importDefault(require("./styles"));
var digits = new digit_generator_1.ThreeDigitGenerator();
var pseudoe = /** @class */ (function () {
    function pseudoe(options) {
        this.opts = options;
    }
    pseudoe.prototype.options = function (options) {
        this.opts = options;
    };
    pseudoe.prototype.default = function (tag) {
        if (tag === void 0) { tag = "pseudoe"; }
        return (0, formater_1.formatPseudoe)("".concat(tag, "-").concat(digits.next()), this.opts);
    };
    pseudoe.prototype.style = function (theme) {
        var _a;
        // Choose a valid style name; fall back to 'african' if the requested one is not available
        var styleName = theme && styles_1.default[theme]
            ? theme
            : "african";
        var styles = styles_1.default[styleName];
        // pick a random adjective and noun from the selected style
        var adjList = styles.adjectives;
        var nounList = styles.nouns;
        var rand = function (n) { return Math.floor(Math.random() * n); };
        var adjective = adjList[rand(adjList.length)];
        var noun = nounList[rand(nounList.length)];
        // append a short deterministic token from the 3-digit generator (fallback to '000' if exhausted)
        var token = (_a = digits.next()) !== null && _a !== void 0 ? _a : "000";
        // return a composed token like: "adjective-noun-123"
        return (0, formater_1.formatPseudoe)("".concat(adjective, "-").concat(noun, "-").concat(token), this.opts);
    };
    pseudoe.prototype.random = function () {
        var themes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            themes[_i] = arguments[_i];
        }
        var rand = function (n) { return Math.floor(Math.random() * n); };
        var style = themes[rand(themes.length)];
        var styleName = style ? style : "african";
        var pseudo = this.style(styleName);
        return pseudo;
    };
    return pseudoe;
}());
exports.pseudoe = pseudoe;
//# sourceMappingURL=index.js.map