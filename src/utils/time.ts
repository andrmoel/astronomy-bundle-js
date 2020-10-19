import {normalizeAngle} from './angle';

export function julianDay2julianDay0(jd: number): number {
    return Math.floor(jd + 0.5) - 0.5;
}

export function julianDay2ModifiedJulianDay(jd: number): number {
    return jd - 2400000.5;
}

export function julianDay2julianCenturiesJ2000(jd: number): number {
    return (jd - 2451545.0) / 36525.0;
}

export function julianCenturiesJ20002julianDay(T: number): number {
    return T * 36525.0 + 2451545.0;
}

export function julianDay2julianMillenniaJ2000(jd: number): number {
    const T = julianDay2julianCenturiesJ2000(jd);

    return T / 10;
}

export function julianMillenniaJ20002julianDay(t: number): number {
    const T = t * 10;

    return julianCenturiesJ20002julianDay(T);
}

export function getGreenwichMeanSiderealTime(T: number): number {
    const jd = julianCenturiesJ20002julianDay(T);

    // Meeus 12.4
    const GMST = 280.46061837
        + 360.98564736629 * (jd - 2451545)
        + 0.000387933 * Math.pow(T, 2)
        + Math.pow(T, 3) / 38710000;

    return normalizeAngle(GMST);
}
