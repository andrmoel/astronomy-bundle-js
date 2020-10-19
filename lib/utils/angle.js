"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeAngle = exports.rad2deg = exports.deg2rad = void 0;
function deg2rad(degrees) {
    return degrees * (Math.PI / 180);
}
exports.deg2rad = deg2rad;
function rad2deg(radians) {
    return radians * (180 / Math.PI);
}
exports.rad2deg = rad2deg;
function normalizeAngle(degrees, baseAngle) {
    if (baseAngle === void 0) { baseAngle = 360.0; }
    var angle = degrees % baseAngle;
    if (angle < 0) {
        angle = angle + baseAngle;
    }
    return angle;
}
exports.normalizeAngle = normalizeAngle;
