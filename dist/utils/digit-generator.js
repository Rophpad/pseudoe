"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeDigitGenerator = void 0;
var ThreeDigitGenerator = /** @class */ (function () {
    function ThreeDigitGenerator() {
        // create ["000", "001", ..., "999"]
        this.pool = Array.from({ length: 1000 }, function (_, i) {
            return i.toString().padStart(3, "0");
        });
        this.shuffle(this.pool);
    }
    ThreeDigitGenerator.prototype.shuffle = function (arr) {
        var _a;
        for (var i = arr.length - 1; i > 0; i--) {
            var j = Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1));
            _a = [arr[j], arr[i]], arr[i] = _a[0], arr[j] = _a[1];
        }
    };
    ThreeDigitGenerator.prototype.next = function () {
        return this.pool.pop() || null; // null when exhausted
    };
    return ThreeDigitGenerator;
}());
exports.ThreeDigitGenerator = ThreeDigitGenerator;
//# sourceMappingURL=digit-generator.js.map