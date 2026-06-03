import * as earth from '@app/utils/earth';
import * as sun from '@app/utils/sun';
import {normalizeAngle} from '@app/utils/angle';
import {DEG, RAD} from '@app/constants/math';
import {km2au} from '@app/utils/distance';
import {MOON_ARGUMENTS_B, MOON_ARGUMENTS_LR} from '@app/constants/moon';

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

export function getMeanLongitudeOfAscendingNode(T: number): number {
    return 125.0445479
        - 1934.1362891 * T
        + 0.0020754 * Math.pow(T, 2)
        + Math.pow(T, 3) / 467441
        - Math.pow(T, 4) / 60616000;
}

export function getEquatorialHorizontalParallax(T: number): number {
    const d = getDistanceToEarth(T);

    // Meeus 47
    return Math.asin(6378.14 / d) * RAD;
}

export function getLongitude(T: number): number {
    const L = getMeanLongitude(T);
    const sumL = _getSumL(T);

    return L + sumL / 1000000;
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

    return 385000.56 + sumR / 1000;
}

function _getSumR(T: number): number {
    // Meeus 47.b
    const D = getMeanElongation(T);
    const Msun = sun.getMeanAnomaly(T);
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

        let tmpSumR = Math.cos((argD * D + argMsun * Msun + argMmoon * Mmoon + argF * F) * DEG);

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
    const Msun = sun.getMeanAnomaly(T);
    const Mmoon = getMeanAnomaly(T);
    const F = getArgumentOfLatitude(T);

    // Action of venus
    const A1 = 119.75 + 131.849 * T;
    // Action of jupiter
    const A2 = 53.09 + 479264.290 * T;
    const E = 1 - 0.002516 * T - 0.0000074 * Math.pow(T, 2);

    let sumL = 3958 * Math.sin(A1 * DEG)
        + 1962 * Math.sin((L - F) * DEG)
        + 318 * Math.sin(A2 * DEG);

    MOON_ARGUMENTS_LR.forEach((args: Array<number>) => {
        const argD = args[0];
        const argMsun = args[1];
        const argMmoon = args[2];
        const argF = args[3];
        const argSumL = args[4];

        let tmpSumL = Math.sin((argD * D + argMsun * Msun + argMmoon * Mmoon + argF * F) * DEG);

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
    const Msun = sun.getMeanAnomaly(T);
    const Mmoon = getMeanAnomaly(T);
    const F = getArgumentOfLatitude(T);

    // Action of venus
    const A1 = 119.75 + 131.849 * T;
    // Action of jupiter
    const A3 = 313.45 + 481266.484 * T;
    const E = 1 - 0.002516 * T - 0.0000074 * Math.pow(T, 2);

    let sumB = -2235 * Math.sin(L * DEG)
        + 382 * Math.sin(A3 * DEG)
        + 175 * Math.sin((A1 - F) * DEG)
        + 175 * Math.sin((A1 + F) * DEG)
        + 127 * Math.sin((L - Mmoon) * DEG)
        - 115 * Math.sin((L + Mmoon) * DEG);

    MOON_ARGUMENTS_B.forEach((args: Array<number>) => {
        const argD = args[0];
        const argMsun = args[1];
        const argMmoon = args[2];
        const argF = args[3];
        const argSumB = args[4];

        let tmpSumB = Math.sin((argD * D + argMsun * Msun + argMmoon * Mmoon + argF * F) * DEG);

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

export function getOpticalLiberationInLongitude(longitude: number, latitude: number, T: number): number {
    const latRad = latitude * DEG;

    const i = 1.54242;
    const iRad = i * DEG;

    const phi = earth.getNutationInLongitude(T);
    const F = getArgumentOfLatitude(T);
    const Omega = getMeanLongitudeOfAscendingNode(T);

    // Meeus 53.1
    const W = normalizeAngle(longitude - phi - Omega);
    const WRad = W * DEG;

    const ARad = Math.atan2(
        Math.sin(WRad) * Math.cos(latRad) * Math.cos(iRad) - Math.sin(latRad) * Math.sin(iRad),
        Math.cos(WRad) * Math.cos(latRad),
    );
    const A = normalizeAngle(ARad * RAD);

    return A - F;
}

export function getOpticalLiberationInLatitude(longitude: number, latitude: number, T: number): number {
    const latRad = latitude * DEG;

    const i = 1.54242;
    const iRad = i * DEG;

    const phi = earth.getNutationInLongitude(T);
    const Omega = getMeanLongitudeOfAscendingNode(T);

    // Meeus 53.1
    const W = normalizeAngle(longitude - phi - Omega);
    const WRad = W * DEG;

    const bRad = Math.asin(
        -1 * Math.sin(WRad) * Math.cos(latRad) * Math.sin(iRad) - Math.sin(latRad) * Math.cos(iRad),
    );

    return bRad * RAD;
}
