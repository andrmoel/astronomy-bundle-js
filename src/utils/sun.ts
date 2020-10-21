import * as earthCalc from './earth';
import {deg2rad, normalizeAngle, rad2deg} from './angle';

export function getMeanAnomaly(T: number): number {
    // Meeus 47.4
    const M = 357.5291092
        + 35999.0502909 * T
        - 0.0001536 * Math.pow(T, 2)
        + Math.pow(T, 3) / 2449000;

    return normalizeAngle(M);
}

export function getTrueAnomaly(T: number): number {
    // Meeus 25.4
    const M = getMeanAnomaly(T);
    const C = getEquationOfCenter(T);

    return M + C;
}

export function getMeanLongitude(T: number): number {
    const t = T / 10;

    // Meeus 28.2
    const L0 = 280.4664567
        + 360007.6982779 * t
        + 0.03042028 * Math.pow(t, 2)
        + Math.pow(t, 3) / 49931
        - Math.pow(t, 4) / 15300
        + Math.pow(t, 5) / 2000000;

    return normalizeAngle(L0);
}

export function getTrueLongitude(T: number): number {
    // Meeus 25.4
    const L0 = getMeanLongitude(T);
    const C = getEquationOfCenter(T);

    return L0 + C;
}

export function getApparentLongitude(T: number): number {
    // Meeus 25.5
    const o = getTrueLongitude(T);

    const omega = 125.04 - 1934.136 * T;
    const omegaRad = deg2rad(omega);

    return o - 0.00569 - 0.00478 * Math.sin(omegaRad);
}

export function getEquationOfCenter(T: number): number {
    const M = getMeanAnomaly(T);

    // Meeus 25.4
    let C = (1.914602 - 0.004817 * T - 0.000014 * Math.pow(T, 2)) * Math.sin(deg2rad(M));
    C += (0.019993 - 0.000101 * T) * Math.sin(2 * deg2rad(M));
    C += 0.000289 * Math.sin(3 * deg2rad(M));

    return C;
}

export function getApparentRightAscension(T: number): number {
    // TODO Use method with higher accuracy (Meeus p.166) 25.9

    const lon = getApparentLongitude(T);
    const lonRad = deg2rad(lon);

    // Meeus 25.8 - Corrections
    let e = earthCalc.getMeanObliquityOfEcliptic(T);
    const O = 125.04 - 1934.136 * T;
    const ORad = deg2rad(O);
    e = e + 0.00256 * Math.cos(ORad);
    const eRad = deg2rad(e);

    // Meeus 25.6
    const rightAscension = Math.atan2(Math.cos(eRad) * Math.sin(lonRad), Math.cos(lonRad));

    return normalizeAngle(rad2deg(rightAscension));
}
