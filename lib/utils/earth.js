"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNutationInObliquity = exports.getNutationInLongitude = exports.getTrueObliquityOfEcliptic = exports.getMeanObliquityOfEcliptic = exports.getLongitudeOfPerihelionOfOrbit = exports.getEccentricity = exports.getMeanAnomaly = void 0;
var angle_1 = require("./angle");
var moon_1 = require("./moon");
var sun_1 = require("./sun");
var earth_1 = require("../constants/earth");
function getMeanAnomaly(T) {
    var M = 357.5291092
        + 35999.0502909 * T
        - 0.0001536 * Math.pow(T, 2)
        + Math.pow(T, 3) / 2449000;
    return angle_1.normalizeAngle(M);
}
exports.getMeanAnomaly = getMeanAnomaly;
function getEccentricity(T) {
    return 0.016708634
        - 0.000042037 * T
        - 0.0000001267 * Math.pow(T, 2);
}
exports.getEccentricity = getEccentricity;
function getLongitudeOfPerihelionOfOrbit(T) {
    return 102.93735
        + 1.71946 * T
        + 0.00046 * Math.pow(T, 2);
}
exports.getLongitudeOfPerihelionOfOrbit = getLongitudeOfPerihelionOfOrbit;
function getMeanObliquityOfEcliptic(T) {
    var U = T / 100;
    var eps0 = 84381.448
        - 4680.93 * U
        - 1.55 * Math.pow(U, 2)
        + 1999.25 * Math.pow(U, 3)
        - 51.38 * Math.pow(U, 4)
        - 249.67 * Math.pow(U, 5)
        - 39.05 * Math.pow(U, 6)
        + 7.12 * Math.pow(U, 7)
        + 27.87 * Math.pow(U, 8)
        + 5.79 * Math.pow(U, 9)
        + 2.45 * Math.pow(U, 10);
    return eps0 / 3600;
}
exports.getMeanObliquityOfEcliptic = getMeanObliquityOfEcliptic;
function getTrueObliquityOfEcliptic(T) {
    var eps0 = getMeanObliquityOfEcliptic(T);
    var sumEps = getNutationInObliquity(T);
    return eps0 + sumEps;
}
exports.getTrueObliquityOfEcliptic = getTrueObliquityOfEcliptic;
function getNutationInLongitude(T) {
    var D = moon_1.getMeanElongation(T);
    var Msun = sun_1.getMeanAnomaly(T);
    var Mmoon = moon_1.getMeanAnomaly(T);
    var F = moon_1.getArgumentOfLatitude(T);
    var O = 125.04452
        - 1934.136261 * T
        + 0.0020708 * Math.pow(T, 2)
        + Math.pow(T, 3) / 450000;
    var sumPhi = 0;
    earth_1.EARTH_ARGUMENTS_OF_NUTATION.forEach(function (args) {
        var argMmoon = args[0];
        var argMsun = args[1];
        var argF = args[2];
        var argD = args[3];
        var argO = args[4];
        var argPhi1 = args[5];
        var argPhi2 = args[6];
        var tmpSum = argD * D + argMsun * Msun + argMmoon * Mmoon + argF * F + argO * O;
        sumPhi += Math.sin(angle_1.deg2rad(tmpSum)) * (argPhi1 + argPhi2 * T);
    });
    return sumPhi * 0.0001 / 3600;
}
exports.getNutationInLongitude = getNutationInLongitude;
function getNutationInObliquity(T) {
    var D = moon_1.getMeanElongation(T);
    var Msun = sun_1.getMeanAnomaly(T);
    var Mmoon = moon_1.getMeanAnomaly(T);
    var F = moon_1.getArgumentOfLatitude(T);
    var O = 125.04452
        - 1934.136261 * T
        + 0.0020708 * Math.pow(T, 2)
        + Math.pow(T, 3) / 450000;
    var sumEps = 0;
    earth_1.EARTH_ARGUMENTS_OF_NUTATION.forEach(function (args) {
        var argMmoon = args[0];
        var argMsun = args[1];
        var argF = args[2];
        var argD = args[3];
        var argO = args[4];
        var argEps1 = args[7];
        var argEps2 = args[8];
        var tmpSum = argD * D + argMsun * Msun + argMmoon * Mmoon + argF * F + argO * O;
        sumEps += Math.cos(angle_1.deg2rad(tmpSum)) * (argEps1 + argEps2 * T);
    });
    return sumEps * 0.0001 / 3600;
}
exports.getNutationInObliquity = getNutationInObliquity;
