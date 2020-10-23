import {MOON_ARGUMENTS_B, MOON_ARGUMENTS_LR} from '../constants/moon';
import {deg2rad, normalizeAngle, rad2deg} from './angleCalc';
import {getMeanAnomaly as getMeanSunAnomaly} from './sunCalc';
import {getNutationInLongitude} from './earthCalc';
import {km2au} from "./distanceCalc";

export function getMeanElongation(T: number): number {
    // Meeus 47.2
    const D = 297.8501921
        + 445267.1114034 * T
        - 0.0018819 * Math.pow(T, 2)
        + Math.pow(T, 3) / 545868
        - Math.pow(T, 4) / 113065000;

    return normalizeAngle(D);
}

export function getMeanAnomaly(T: number): number {
    // Meeus 47.2
    const Mmoon = 134.9633964
        + 477198.8675055 * T
        + 0.0087414 * Math.pow(T, 2)
        + Math.pow(T, 3) / 69699
        - Math.pow(T, 4) / 1471200;

    return normalizeAngle(Mmoon);
}

export function getArgumentOfLatitude(T: number): number {
    // Meeus 47.5
    const F = 93.2720950
        + 483202.0175233 * T
        - 0.0036539 * Math.pow(T, 2)
        - Math.pow(T, 3) / 352600
        + Math.pow(T, 4) / 86331000;

    return normalizeAngle(F);
}

export function getMeanLongitude(T: number): number {
    // Meeus 47.1
    const L = 218.3164477
        + 481267.88123421 * T
        - 0.0015786 * Math.pow(T, 2)
        + Math.pow(T, 3) / 538841
        - Math.pow(T, 4) / 65194000;

    return normalizeAngle(L);
}

export function getEquatorialHorizontalParallax(T: number): number {
    const d = getDistanceToEarth(T);

    // Meeus 47
    return rad2deg(Math.asin(6378.14 / d));
}

export function getLongitude(T: number): number {
    const L = getMeanLongitude(T);
    const sumL = _getSumL(T);

    return L + (sumL / 1000000);
}

export function getApparentLongitude(T: number): number {
    const l = getLongitude(T);
    const phi = getNutationInLongitude(T);

    return l + phi;
}

export function getLatitude(T: number): number {
    const sumB = _getSumB(T);

    return sumB / 1000000;
}

export function getRadiusVector(T: number): number {
    return km2au(getDistanceToEarth(T));
}

export function getDistanceToEarth(T: number): number {
    const sumR = _getSumR(T);

    return 385000.56 + (sumR / 1000);
}

function _getSumR(T: number): number {
    // Meeus 47.b
    const D = getMeanElongation(T);
    const Msun = getMeanSunAnomaly(T);
    const Mmoon = getMeanAnomaly(T);
    const F = getArgumentOfLatitude(T);

    // Action of jupiter
    const E = 1 - 0.002516 * T - 0.0000074 * Math.pow(T, 2);

    let sumR = 0;
    MOON_ARGUMENTS_LR.forEach((args: Array<number>) => {
        const argD = args[0];
        const argMsun = args[1];
        const argMmoon = args[2];
        const argF = args[3];
        const argSumR = args[5];

        let tmpSumR = Math.cos(deg2rad(argD * D + argMsun * Msun + argMmoon * Mmoon + argF * F));

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

function _getSumL(T: number): number {
    // Meeus 47.b
    const L = getMeanLongitude(T);
    const D = getMeanElongation(T);
    const Msun = getMeanSunAnomaly(T);
    const Mmoon = getMeanAnomaly(T);
    const F = getArgumentOfLatitude(T);

    // Action of venus
    const A1 = 119.75 + 131.849 * T;
    // Action of jupiter
    const A2 = 53.09 + 479264.290 * T;
    const E = 1 - 0.002516 * T - 0.0000074 * Math.pow(T, 2);

    let sumL = 3958 * Math.sin(deg2rad(A1))
        + 1962 * Math.sin(deg2rad(L - F))
        + 318 * Math.sin(deg2rad(A2));

    MOON_ARGUMENTS_LR.forEach((args: Array<number>) => {
        const argD = args[0];
        const argMsun = args[1];
        const argMmoon = args[2];
        const argF = args[3];
        const argSumL = args[4];

        let tmpSumL = Math.sin(deg2rad(argD * D + argMsun * Msun + argMmoon * Mmoon + argF * F));

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

function _getSumB(T: number): number {
    // Meeus 47.B
    const L = getMeanLongitude(T);
    const D = getMeanElongation(T);
    const Msun = getMeanSunAnomaly(T);
    const Mmoon = getMeanAnomaly(T);
    const F = getArgumentOfLatitude(T);

    // Action of venus
    const A1 = 119.75 + 131.849 * T;
    // Action of jupiter
    const A3 = 313.45 + 481266.484 * T;
    const E = 1 - 0.002516 * T - 0.0000074 * Math.pow(T, 2);

    let sumB = -2235 * Math.sin(deg2rad(L))
        + 382 * Math.sin(deg2rad(A3))
        + 175 * Math.sin(deg2rad(A1 - F))
        + 175 * Math.sin(deg2rad(A1 + F))
        + 127 * Math.sin(deg2rad(L - Mmoon))
        - 115 * Math.sin(deg2rad(L + Mmoon));

    MOON_ARGUMENTS_B.forEach((args: Array<number>) => {
        const argD = args[0];
        const argMsun = args[1];
        const argMmoon = args[2];
        const argF = args[3];
        const argSumB = args[4];

        let tmpSumB = Math.sin(deg2rad(argD * D + argMsun * Msun + argMmoon * Mmoon + argF * F));

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
