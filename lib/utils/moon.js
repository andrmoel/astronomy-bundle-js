"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArgumentOfLatitude = exports.getMeanAnomaly = exports.getMeanElongation = void 0;
var angle_1 = require("./angle");
function getMeanElongation(T) {
    var D = 297.8501921
        + 445267.1114034 * T
        - 0.0018819 * Math.pow(T, 2)
        + Math.pow(T, 3) / 545868
        - Math.pow(T, 4) / 113065000;
    return angle_1.normalizeAngle(D);
}
exports.getMeanElongation = getMeanElongation;
function getMeanAnomaly(T) {
    var Mmoon = 134.9633964
        + 477198.8675055 * T
        + 0.0087414 * Math.pow(T, 2)
        + Math.pow(T, 3) / 69699
        - Math.pow(T, 4) / 1471200;
    return angle_1.normalizeAngle(Mmoon);
}
exports.getMeanAnomaly = getMeanAnomaly;
function getArgumentOfLatitude(T) {
    var F = 93.2720950
        + 483202.0175233 * T
        - 0.0036539 * Math.pow(T, 2)
        - Math.pow(T, 3) / 352600
        + Math.pow(T, 4) / 86331000;
    return angle_1.normalizeAngle(F);
}
exports.getArgumentOfLatitude = getArgumentOfLatitude;
