import {EARTH_ARGUMENTS_OF_NUTATION} from '@app/constants/earth';
import {DEG} from '@app/constants/math';
import {normalizeAngle} from '@app/utils/angle';
import * as moon from '@app/utils/moon';
import * as sun from '@app/utils/sun';

export function getMeanAnomaly(T: number): number {
    // Meeus 47.4
    const M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T ** 2 + T ** 3 / 2449000;

    return normalizeAngle(M);
}

export function getEccentricity(T: number): number {
    // Meeus 25.4
    return 0.016708634 - 0.000042037 * T - 0.0000001267 * T ** 2;
}

export function getLongitudeOfPerihelionOfOrbit(T: number): number {
    // Meeus 23
    return 102.93735 + 1.71946 * T + 0.00046 * T ** 2;
}

export function getMeanObliquityOfEcliptic(T: number): number {
    const U = T / 100;

    // Meeus 22.3
    const eps0 =
        84381.448
        - 4680.93 * U
        - 1.55 * U ** 2
        + 1999.25 * U ** 3
        - 51.38 * U ** 4
        - 249.67 * U ** 5
        - 39.05 * U ** 6
        + 7.12 * U ** 7
        + 27.87 * U ** 8
        + 5.79 * U ** 9
        + 2.45 * U ** 10;

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
    const D = moon.getMeanElongation(T);
    const Msun = sun.getMeanAnomaly(T);
    const Mmoon = moon.getMeanAnomaly(T);
    const F = moon.getArgumentOfLatitude(T);

    // Longitude of the ascending node of moon's mean orbit on ecliptic
    const O = 125.04452 - 1934.136261 * T + 0.0020708 * T ** 2 + T ** 3 / 450000;

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

        sumPhi += Math.sin(tmpSum * DEG) * (argPhi1 + argPhi2 * T);
    });

    return (sumPhi * 0.0001) / 3600;
}

export function getNutationInObliquity(T: number): number {
    // Meeus chapter 22
    const D = moon.getMeanElongation(T);
    const Msun = sun.getMeanAnomaly(T);
    const Mmoon = moon.getMeanAnomaly(T);
    const F = moon.getArgumentOfLatitude(T);

    // Longitude of the ascending node of moon's mean orbit on ecliptic
    const O = 125.04452 - 1934.136261 * T + 0.0020708 * T ** 2 + T ** 3 / 450000;

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

        sumEps += Math.cos(tmpSum * DEG) * (argEps1 + argEps2 * T);
    });

    return (sumEps * 0.0001) / 3600;
}
