import {deg2rad, normalizeAngle} from './angle';
import {getArgumentOfLatitude, getMeanAnomaly as getMeanMoonAnomaly, getMeanElongation} from './moon';
import {getMeanAnomaly as getMeanSunAnomaly} from './sun';
import {EARTH_ARGUMENTS_OF_NUTATION} from '../constants/earth';

export function getMeanAnomaly(T: number): number {
    // Meeus 47.4
    const M = 357.5291092
        + 35999.0502909 * T
        - 0.0001536 * Math.pow(T, 2)
        + Math.pow(T, 3) / 2449000;

    return normalizeAngle(M);
}

export function getEccentricity(T: number): number {
    // Meeus 25.4
    return 0.016708634
        - 0.000042037 * T
        - 0.0000001267 * Math.pow(T, 2);
}

export function getLongitudeOfPerihelionOfOrbit(T: number): number {
    // Meeus 23
    return 102.93735
        + 1.71946 * T
        + 0.00046 * Math.pow(T, 2);
}

export function getMeanObliquityOfEcliptic(T: number): number {
    const U = T / 100;

    // Meeus 22.3
    const eps0 = 84381.448
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

export function getTrueObliquityOfEcliptic(T: number): number {
    const eps0 = getMeanObliquityOfEcliptic(T);
    const sumEps = getNutationInObliquity(T);

    // Meeus chapter 22
    return eps0 + sumEps;
}

export function getNutationInLongitude(T: number): number {
    // Meeus chapter 22
    const D = getMeanElongation(T);
    const Msun = getMeanSunAnomaly(T);
    const Mmoon = getMeanMoonAnomaly(T);
    const F = getArgumentOfLatitude(T);

    // Longitude of the ascending node of moon's mean orbit on ecliptic
    const O = 125.04452
        - 1934.136261 * T
        + 0.0020708 * Math.pow(T, 2)
        + Math.pow(T, 3) / 450000;

    let sumPhi = 0;
    EARTH_ARGUMENTS_OF_NUTATION.forEach((args) => {
        const argMmoon = args[0]; // Mean anomaly of moon
        const argMsun = args[1]; // Mean anomaly of sun
        const argF = args[2]; // Mean argument of perigee
        const argD = args[3]; // Mean elongation of moon
        const argO = args[4]; // Mean length of ascending knot of moon's orbit
        const argPhi1 = args[5];
        const argPhi2 = args[6];

        const tmpSum = argD * D + argMsun * Msun + argMmoon * Mmoon + argF * F + argO * O;

        sumPhi += Math.sin(deg2rad(tmpSum)) * (argPhi1 + argPhi2 * T);
    });

    return sumPhi * 0.0001 / 3600;
}

export function getNutationInObliquity(T: number): number {
    // Meeus chapter 22
    const D = getMeanElongation(T);
    const Msun = getMeanSunAnomaly(T);
    const Mmoon = getMeanMoonAnomaly(T);
    const F = getArgumentOfLatitude(T);

    // Longitude of the ascending node of moon's mean orbit on ecliptic
    const O = 125.04452
        - 1934.136261 * T
        + 0.0020708 * Math.pow(T, 2)
        + Math.pow(T, 3) / 450000;

    let sumEps = 0;
    EARTH_ARGUMENTS_OF_NUTATION.forEach((args) => {
        const argMmoon = args[0]; // Mean anomaly of moon
        const argMsun = args[1]; // Mean anomaly of sun
        const argF = args[2]; // Mean argument of perigee
        const argD = args[3]; // Mean elongation of moon
        const argO = args[4]; // Mean length of ascending knot of moon's orbit
        const argEps1 = args[7];
        const argEps2 = args[8];

        const tmpSum = argD * D + argMsun * Msun + argMmoon * Mmoon + argF * F + argO * O;

        sumEps += Math.cos(deg2rad(tmpSum)) * (argEps1 + argEps2 * T);
    });

    return sumEps * 0.0001 / 3600;
}
