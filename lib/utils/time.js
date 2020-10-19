"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGreenwichMeanSiderealTime = exports.julianMillenniaJ20002julianDay = exports.julianDay2julianMillenniaJ2000 = exports.julianCenturiesJ20002julianDay = exports.julianDay2julianCenturiesJ2000 = exports.julianDay2ModifiedJulianDay = exports.julianDay2julianDay0 = void 0;
var angle_1 = require("./angle");
function julianDay2julianDay0(jd) {
    return Math.floor(jd + 0.5) - 0.5;
}
exports.julianDay2julianDay0 = julianDay2julianDay0;
function julianDay2ModifiedJulianDay(jd) {
    return jd - 2400000.5;
}
exports.julianDay2ModifiedJulianDay = julianDay2ModifiedJulianDay;
function julianDay2julianCenturiesJ2000(jd) {
    return (jd - 2451545.0) / 36525.0;
}
exports.julianDay2julianCenturiesJ2000 = julianDay2julianCenturiesJ2000;
function julianCenturiesJ20002julianDay(T) {
    return T * 36525.0 + 2451545.0;
}
exports.julianCenturiesJ20002julianDay = julianCenturiesJ20002julianDay;
function julianDay2julianMillenniaJ2000(jd) {
    var T = julianDay2julianCenturiesJ2000(jd);
    return T / 10;
}
exports.julianDay2julianMillenniaJ2000 = julianDay2julianMillenniaJ2000;
function julianMillenniaJ20002julianDay(t) {
    var T = t * 10;
    return julianCenturiesJ20002julianDay(T);
}
exports.julianMillenniaJ20002julianDay = julianMillenniaJ20002julianDay;
function getGreenwichMeanSiderealTime(T) {
    var jd = julianCenturiesJ20002julianDay(T);
    var GMST = 280.46061837
        + 360.98564736629 * (jd - 2451545)
        + 0.000387933 * Math.pow(T, 2)
        + Math.pow(T, 3) / 38710000;
    return angle_1.normalizeAngle(GMST);
}
exports.getGreenwichMeanSiderealTime = getGreenwichMeanSiderealTime;
