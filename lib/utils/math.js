"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.round = void 0;
function round(value, decimals) {
    if (decimals === void 0) { decimals = 0; }
    var p = Math.pow(10, decimals);
    return Math.round(value * p) / p;
}
exports.round = round;
