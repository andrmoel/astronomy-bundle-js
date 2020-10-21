"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spherical2rectangular = exports.rectangular2spherical = void 0;
var angleCalc_1 = require("./angleCalc");
function rectangular2spherical(x, y, z) {
    var lonRad = Math.atan2(y, x);
    var lon = angleCalc_1.normalizeAngle(angleCalc_1.rad2deg(lonRad));
    var latRad = Math.atan(z / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
    var lat = angleCalc_1.rad2deg(latRad);
    var radiusVector = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
    return { lon: lon, lat: lat, radiusVector: radiusVector };
}
exports.rectangular2spherical = rectangular2spherical;
function spherical2rectangular(lon, lat, radiusVector) {
    var lonRad = angleCalc_1.deg2rad(lon);
    var latRad = angleCalc_1.deg2rad(lat);
    var x = radiusVector * Math.cos(latRad) * Math.cos(lonRad);
    var y = radiusVector * Math.cos(latRad) * Math.sin(lonRad);
    var z = radiusVector * Math.sin(latRad);
    return { x: x, y: y, z: z };
}
exports.spherical2rectangular = spherical2rectangular;
