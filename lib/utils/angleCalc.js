"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeAngle = exports.time2deg = exports.deg2time = exports.angle2deg = exports.deg2angle = exports.rad2deg = exports.deg2rad = void 0;
var math_1 = require("./math");
function deg2rad(degrees) {
    return degrees * (Math.PI / 180);
}
exports.deg2rad = deg2rad;
function rad2deg(radians) {
    return radians * (180 / Math.PI);
}
exports.rad2deg = rad2deg;
function deg2angle(deg) {
    var sign = deg < 0 ? '-' : '';
    deg = Math.abs(deg);
    var degPart = Math.floor(deg);
    var minPart = Math.floor((deg - degPart) * 60);
    var secPart = math_1.round((deg - degPart - minPart / 60) * 3600, 3);
    return sign + degPart + '°' + minPart + '\'' + secPart + '"';
}
exports.deg2angle = deg2angle;
function angle2deg(angle) {
    var matches = angle.match(/(-?)([0-9]+)°.*?([0-9]+)'.*?([0-9.]+)"/);
    if (!matches) {
        throw new Error('false angle format');
    }
    var sign = matches[1].trim() === '-' ? -1 : 1;
    var deg = parseInt(matches[2]);
    var min = parseInt(matches[3]);
    var sec = parseFloat(matches[4]);
    return sign * (deg + min / 60 + sec / 3600);
}
exports.angle2deg = angle2deg;
function deg2time(angle) {
    var sign = angle < 0 ? '-' : '';
    var time = Math.abs(angle / 15);
    var hour = Math.floor(time);
    var min = Math.floor((time - hour) * 60);
    var sec = math_1.round((time - hour - min / 60) * 3600, 3);
    return sign + hour + 'h' + min + 'm' + sec + 's';
}
exports.deg2time = deg2time;
function time2deg(timeAngle) {
    var matches = timeAngle.match(/(-?)([0-9]+)h.*?([0-9]+)m.*?([0-9.]+)s/);
    if (!matches) {
        throw new Error('false time angle format');
    }
    var sign = matches[1].trim() === '-' ? -1 : 1;
    var deg = parseInt(matches[2]);
    var min = parseInt(matches[3]);
    var sec = parseFloat(matches[4]);
    var angleDeg = sign * (deg + min / 60 + sec / 3600);
    return angleDeg * 15;
}
exports.time2deg = time2deg;
function normalizeAngle(degrees, baseAngle) {
    if (baseAngle === void 0) { baseAngle = 360.0; }
    var angle = degrees % baseAngle;
    if (angle < 0) {
        angle = angle + baseAngle;
    }
    return angle;
}
exports.normalizeAngle = normalizeAngle;
