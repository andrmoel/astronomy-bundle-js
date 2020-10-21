"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLatitude = exports.getApparentLongitude = exports.getLongitude = exports.getDistanceToEarth = exports.getEquatorialHorizontalParallax = exports.getMeanLongitude = exports.getArgumentOfLatitude = exports.getMeanAnomaly = exports.getMeanElongation = void 0;
var moon_1 = require("../constants/moon");
var angleCalc_1 = require("./angleCalc");
var sunCalc_1 = require("./sunCalc");
var earthCalc_1 = require("./earthCalc");
function getMeanElongation(T) {
    var D = 297.8501921
        + 445267.1114034 * T
        - 0.0018819 * Math.pow(T, 2)
        + Math.pow(T, 3) / 545868
        - Math.pow(T, 4) / 113065000;
    return angleCalc_1.normalizeAngle(D);
}
exports.getMeanElongation = getMeanElongation;
function getMeanAnomaly(T) {
    var Mmoon = 134.9633964
        + 477198.8675055 * T
        + 0.0087414 * Math.pow(T, 2)
        + Math.pow(T, 3) / 69699
        - Math.pow(T, 4) / 1471200;
    return angleCalc_1.normalizeAngle(Mmoon);
}
exports.getMeanAnomaly = getMeanAnomaly;
function getArgumentOfLatitude(T) {
    var F = 93.2720950
        + 483202.0175233 * T
        - 0.0036539 * Math.pow(T, 2)
        - Math.pow(T, 3) / 352600
        + Math.pow(T, 4) / 86331000;
    return angleCalc_1.normalizeAngle(F);
}
exports.getArgumentOfLatitude = getArgumentOfLatitude;
function getMeanLongitude(T) {
    var L = 218.3164477
        + 481267.88123421 * T
        - 0.0015786 * Math.pow(T, 2)
        + Math.pow(T, 3) / 538841
        - Math.pow(T, 4) / 65194000;
    return angleCalc_1.normalizeAngle(L);
}
exports.getMeanLongitude = getMeanLongitude;
function getEquatorialHorizontalParallax(T) {
    var d = getDistanceToEarth(T);
    return angleCalc_1.rad2deg(Math.asin(6378.14 / d));
}
exports.getEquatorialHorizontalParallax = getEquatorialHorizontalParallax;
function getDistanceToEarth(T) {
    var sumR = _getSumR(T);
    return 385000.56 + (sumR / 1000);
}
exports.getDistanceToEarth = getDistanceToEarth;
function getLongitude(T) {
    var L = getMeanLongitude(T);
    var sumL = _getSumL(T);
    return L + (sumL / 1000000);
}
exports.getLongitude = getLongitude;
function getApparentLongitude(T) {
    var l = getLongitude(T);
    var phi = earthCalc_1.getNutationInLongitude(T);
    return l + phi;
}
exports.getApparentLongitude = getApparentLongitude;
function getLatitude(T) {
    var sumB = _getSumB(T);
    return sumB / 1000000;
}
exports.getLatitude = getLatitude;
function _getSumR(T) {
    var D = getMeanElongation(T);
    var Msun = sunCalc_1.getMeanAnomaly(T);
    var Mmoon = getMeanAnomaly(T);
    var F = getArgumentOfLatitude(T);
    var E = 1 - 0.002516 * T - 0.0000074 * Math.pow(T, 2);
    var sumR = 0;
    moon_1.MOON_ARGUMENTS_LR.forEach(function (args) {
        var argD = args[0];
        var argMsun = args[1];
        var argMmoon = args[2];
        var argF = args[3];
        var argSumR = args[5];
        var tmpSumR = Math.cos(angleCalc_1.deg2rad(argD * D + argMsun * Msun + argMmoon * Mmoon + argF * F));
        switch (argMsun) {
            case 1:
            case -1:
                tmpSumR = tmpSumR * argSumR * E;
                break;
            case 2:
            case -2:
                tmpSumR = tmpSumR * argSumR * E * E;
                break;
            default:
                tmpSumR = tmpSumR * argSumR;
                break;
        }
        sumR += tmpSumR;
    });
    return sumR;
}
function _getSumL(T) {
    var L = getMeanLongitude(T);
    var D = getMeanElongation(T);
    var Msun = sunCalc_1.getMeanAnomaly(T);
    var Mmoon = getMeanAnomaly(T);
    var F = getArgumentOfLatitude(T);
    var A1 = 119.75 + 131.849 * T;
    var A2 = 53.09 + 479264.290 * T;
    var E = 1 - 0.002516 * T - 0.0000074 * Math.pow(T, 2);
    var sumL = 3958 * Math.sin(angleCalc_1.deg2rad(A1))
        + 1962 * Math.sin(angleCalc_1.deg2rad(L - F))
        + 318 * Math.sin(angleCalc_1.deg2rad(A2));
    moon_1.MOON_ARGUMENTS_LR.forEach(function (args) {
        var argD = args[0];
        var argMsun = args[1];
        var argMmoon = args[2];
        var argF = args[3];
        var argSumL = args[4];
        var tmpSumL = Math.sin(angleCalc_1.deg2rad(argD * D + argMsun * Msun + argMmoon * Mmoon + argF * F));
        switch (argMsun) {
            case 1:
            case -1:
                tmpSumL = tmpSumL * argSumL * E;
                break;
            case 2:
            case -2:
                tmpSumL = tmpSumL * argSumL * E * E;
                break;
            default:
                tmpSumL = tmpSumL * argSumL;
                break;
        }
        sumL += tmpSumL;
    });
    return sumL;
}
function _getSumB(T) {
    var L = getMeanLongitude(T);
    var D = getMeanElongation(T);
    var Msun = sunCalc_1.getMeanAnomaly(T);
    var Mmoon = getMeanAnomaly(T);
    var F = getArgumentOfLatitude(T);
    var A1 = 119.75 + 131.849 * T;
    var A3 = 313.45 + 481266.484 * T;
    var E = 1 - 0.002516 * T - 0.0000074 * Math.pow(T, 2);
    var sumB = -2235 * Math.sin(angleCalc_1.deg2rad(L))
        + 382 * Math.sin(angleCalc_1.deg2rad(A3))
        + 175 * Math.sin(angleCalc_1.deg2rad(A1 - F))
        + 175 * Math.sin(angleCalc_1.deg2rad(A1 + F))
        + 127 * Math.sin(angleCalc_1.deg2rad(L - Mmoon))
        - 115 * Math.sin(angleCalc_1.deg2rad(L + Mmoon));
    moon_1.MOON_ARGUMENTS_B.forEach(function (args) {
        var argD = args[0];
        var argMsun = args[1];
        var argMmoon = args[2];
        var argF = args[3];
        var argSumB = args[4];
        var tmpSumB = Math.sin(angleCalc_1.deg2rad(argD * D + argMsun * Msun + argMmoon * Mmoon + argF * F));
        switch (argMsun) {
            case 1:
            case -1:
                tmpSumB = tmpSumB * argSumB * E;
                break;
            case 2:
            case -2:
                tmpSumB = tmpSumB * argSumB * Math.pow(E, 2);
                break;
            default:
                tmpSumB = tmpSumB * argSumB;
                break;
        }
        sumB += tmpSumB;
    });
    return sumB;
}
