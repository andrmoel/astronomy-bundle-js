"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEquationOfCenter = exports.getApparentLongitude = exports.getTrueLongitude = exports.getMeanLongitude = exports.getTrueAnomaly = exports.getMeanAnomaly = void 0;
var angle_1 = require("./angle");
function getMeanAnomaly(T) {
    var M = 357.5291092
        + 35999.0502909 * T
        - 0.0001536 * Math.pow(T, 2)
        + Math.pow(T, 3) / 2449000;
    return angle_1.normalizeAngle(M);
}
exports.getMeanAnomaly = getMeanAnomaly;
function getTrueAnomaly(T) {
    var M = getMeanAnomaly(T);
    var C = getEquationOfCenter(T);
    return M + C;
}
exports.getTrueAnomaly = getTrueAnomaly;
function getMeanLongitude(T) {
    var t = T / 10;
    var L0 = 280.4664567
        + 360007.6982779 * t
        + 0.03042028 * Math.pow(t, 2)
        + Math.pow(t, 3) / 49931
        - Math.pow(t, 4) / 15300
        + Math.pow(t, 5) / 2000000;
    return angle_1.normalizeAngle(L0);
}
exports.getMeanLongitude = getMeanLongitude;
function getTrueLongitude(T) {
    var L0 = getMeanLongitude(T);
    var C = getEquationOfCenter(T);
    return L0 + C;
}
exports.getTrueLongitude = getTrueLongitude;
function getApparentLongitude(T) {
    var o = getTrueLongitude(T);
    var omega = 125.04 - 1934.136 * T;
    var omegaRad = angle_1.deg2rad(omega);
    return o - 0.00569 - 0.00478 * Math.sin(omegaRad);
}
exports.getApparentLongitude = getApparentLongitude;
function getEquationOfCenter(T) {
    var M = getMeanAnomaly(T);
    var C = (1.914602 - 0.004817 * T - 0.000014 * Math.pow(T, 2)) * Math.sin(angle_1.deg2rad(M));
    C += (0.019993 - 0.000101 * T) * Math.sin(2 * angle_1.deg2rad(M));
    C += 0.000289 * Math.sin(3 * angle_1.deg2rad(M));
    return C;
}
exports.getEquationOfCenter = getEquationOfCenter;
