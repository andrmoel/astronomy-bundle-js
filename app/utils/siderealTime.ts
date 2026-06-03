import {DEG} from '@app/constants/math';
import {normalizeAngle} from '@app/utils/angle';
import * as earth from '@app/utils/earth';
import {julianCenturiesJ20002julianDay} from '@package/time/utils/dateTime';

export function getGreenwichMeanSiderealTime(T: number): number {
    const jd = julianCenturiesJ20002julianDay(T);

    // Meeus 12.4
    const GMST = 280.46061837 + 360.98564736629 * (jd - 2451545) + 0.000387933 * T ** 2 + T ** 3 / 38710000;

    return normalizeAngle(GMST);
}

export function getGreenwichApparentSiderealTime(T: number): number {
    const GMST = getGreenwichMeanSiderealTime(T);
    const p = earth.getNutationInLongitude(T);
    const e = earth.getTrueObliquityOfEcliptic(T);
    const eRad = e * DEG;

    // Meeus 12
    return GMST + p * Math.cos(eRad);
}

export function getLocalMeanSiderealTime(T: number, lon: number): number {
    const GMST = getGreenwichMeanSiderealTime(T);

    const LMST = GMST + lon;

    return normalizeAngle(LMST);
}

export function getLocalApparentSiderealTime(T: number, lon: number): number {
    const GAST = getGreenwichApparentSiderealTime(T);

    // Meeus 12
    return GAST + lon;
}

export function getLocalHourAngle(T: number, lon: number, rightAscension: number): number {
    const LAST = getLocalApparentSiderealTime(T, lon);

    return normalizeAngle(LAST - rightAscension);
}
