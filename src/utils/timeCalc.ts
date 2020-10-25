import ITime from '../time/interfaces/ITime';
import {round} from './math';
import {deg2rad, normalizeAngle} from './angleCalc';
import {earthCalc} from './index';

export function time2julianDay(time: ITime): number {
    const tmpYear = parseFloat(time.year + '.' + getDayOfYear(time));

    let Y;
    let M;
    if (time.month > 2) {
        Y = time.year;
        M = time.month;
    } else {
        Y = time.year - 1;
        M = time.month + 12;
    }

    const D = time.day;
    const H = time.hour / 24 + time.min / 1440 + time.sec / 86400;

    let A;
    let B;
    if (tmpYear >= 1582.288) { // YYYY-MM-DD >= 1582-10-15
        A = Math.floor(Y / 100);
        B = 2 - A + Math.floor(A / 4);
    } else if (tmpYear <= 1582.277) { // YY-MM-DD <= 1582-10-04
        B = 0;
    } else {
        throw new Error('Date between 1582-10-04 and 1582-10-15 is not defined.');
    }

    // Meeus 7.1
    return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + D + H + B - 1524.5;
}

export function julianDay2time(jd: number): ITime {
    jd = jd + 0.5;

    const Z = Math.floor(jd);
    const F = jd - Z;

    let A = Z;
    if (Z >= 2299161) {
        const a = Math.floor((Z - 1867216.25) / 36524.25);
        A = Z + 1 + a - Math.floor(a / 4);
    }

    const B = A + 1524;
    const C = Math.floor((B - 122.1) / 365.25);
    const D = Math.floor(365.25 * C);
    const E = Math.floor((B - D) / 30.6001);

    const dayOnMonth = B - D - Math.floor(30.6001 * E) + F;
    const month = E < 14 ? E - 1 : E - 13;
    const year = month > 2 ? C - 4716 : C - 4715;
    const hour = (dayOnMonth - Math.floor(dayOnMonth)) * 24;
    const min = (hour - Math.floor(hour)) * 60;
    const sec = (min - Math.floor(min)) * 60;

    return {
        year: Math.floor(year),
        month: Math.floor(month),
        day: Math.floor(dayOnMonth),
        hour: Math.floor(hour),
        min: Math.floor(min),
        sec: Math.floor(sec),
    };
}

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

export function dayOfYear2time(year: number, dayOfYear: number): ITime {
    // Meeus 7
    const K = isLeapYear(year) ? 1 : 2;
    const month = dayOfYear < 32 ? 1 : Math.floor((9 * (K + dayOfYear)) / 275 + 0.98);
    const day = Math.floor(dayOfYear - Math.floor((275 * month) / 9) + K * Math.floor((month + 9) / 12) + 30);

    const hourFloat = 24 * (dayOfYear - Math.floor(dayOfYear));
    const hour = Math.floor(hourFloat);
    const minFloat = 60 * (hourFloat - hour);
    const min = Math.floor(minFloat);
    const sec = round(60 * (minFloat - min));

    return {year, month, day, hour, min, sec};
}

export function getDayOfYear(time: ITime): number {
    const K = isLeapYear(time.year) ? 1 : 2;
    const M = time.month;
    const D = time.day;

    // Meeus 7.f
    return Math.floor((275 * M) / 9) - K * Math.floor((M + 9) / 12) + D - 30;
}

export function getDayOfWeek(time: ITime): number {
    const jd = time2julianDay(time);

    // Meeus 7.e
    return Math.floor((jd + 1.5) % 7);
}

export function isLeapYear(year: number): boolean {
    if (year / 4 !== Math.floor(year / 4)) {
        return false;
    } else if (year / 100 !== Math.floor(year / 100)) {
        return true;
    } else if (year / 400 !== Math.floor(year / 400)) {
        return false;
    } else {
        return true;
    }
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

export function getGreenwichApparentSiderealTime(T: number): number {
    const GMST = getGreenwichMeanSiderealTime(T);
    const p = earthCalc.getNutationInLongitude(T);
    const e = earthCalc.getTrueObliquityOfEcliptic(T);
    const eRad = deg2rad(e);

    // Meeus 12
    return GMST + p * Math.cos(eRad);
}

export function getLocalMeanSiderealTime(T: number, lon: number): number {
    const GMST = getGreenwichMeanSiderealTime(T);

    const LMST = GMST + lon;

    return normalizeAngle(LMST);
}

export function getLocalApparentSiderealTime(T: number, lon: number): number {
    const LMST = getLocalMeanSiderealTime(T, lon);
    const p = earthCalc.getNutationInLongitude(T);
    const e = earthCalc.getTrueObliquityOfEcliptic(T);
    const eRad = deg2rad(e);

    // Meeus 12
    return LMST + p * Math.cos(eRad);
}

export function getDeltaT(year: number, month: number = 0): number {
    // https://eclipse.gsfc.nasa.gov/SEcat5/deltatpoly.html
    const y = year + (month - 0.5) / 12;

    let t;
    let deltaT = 0;

    if (year < -500) {
        t = (y - 1820) / 100;
        deltaT = -20
            + 32 * Math.pow(t, 2);
    }

    if (year >= -500 && year < 500) {
        t = y / 100;
        deltaT = 10583.6
            - 1014.41 * t
            + 33.78311 * Math.pow(t, 2)
            - 5.952053 * Math.pow(t, 3)
            - 0.1798452 * Math.pow(t, 4)
            + 0.022174192 * Math.pow(t, 5)
            + 0.0090316521 * Math.pow(t, 6);
    }

    if (year >= 500 && year < 1600) {
        t = (y - 1000) / 100;
        deltaT = 1574.2
            - 556.01 * t
            + 71.23472 * Math.pow(t, 2)
            + 0.319781 * Math.pow(t, 3)
            - 0.8503463 * Math.pow(t, 4)
            - 0.005050998 * Math.pow(t, 5)
            + 0.0083572073 * Math.pow(t, 6);
    }

    if (year >= 1600 && year < 1700) {
        t = y - 1600;
        deltaT = 120
            - 0.9808 * t
            - 0.01532 * Math.pow(t, 2)
            + Math.pow(t, 3) / 7129;
    }

    if (year >= 1700 && year < 1800) {
        t = y - 1700;
        deltaT = 8.83
            + 0.1603 * t
            - 0.0059285 * Math.pow(t, 2)
            + 0.00013336 * Math.pow(t, 3)
            - Math.pow(t, 4) / 1174000;
    }

    if (year >= 1800 && year < 1860) {
        t = y - 1800;
        deltaT = 13.72
            - 0.332447 * t
            + 0.0068612 * Math.pow(t, 2)
            + 0.0041116 * Math.pow(t, 3)
            - 0.00037436 * Math.pow(t, 4)
            + 0.0000121272 * Math.pow(t, 5)
            - 0.0000001699 * Math.pow(t, 6)
            + 0.000000000875 * Math.pow(t, 7);
    }

    if (year >= 1860 && year < 1900) {
        t = y - 1860;

        deltaT = 7.62
            + 0.5737 * t
            - 0.251754 * Math.pow(t, 2)
            + 0.01680668 * Math.pow(t, 3)
            - 0.0004473624 * Math.pow(t, 4)
            + Math.pow(t, 5) / 233174;
    }

    if (year >= 1900 && year < 1920) {
        t = y - 1900;
        deltaT = -2.79
            + 1.494119 * t
            - 0.0598939 * Math.pow(t, 2)
            + 0.0061966 * Math.pow(t, 3)
            - 0.000197 * Math.pow(t, 4);
    }

    if (year >= 1920 && year < 1941) {
        t = y - 1920;
        deltaT = 21.20
            + 0.84493 * t
            - 0.076100 * Math.pow(t, 2)
            + 0.0020936 * Math.pow(t, 3);
    }

    if (year >= 1941 && year < 1961) {
        t = y - 1950;
        deltaT = 29.07
            + 0.407 * t
            - Math.pow(t, 2) / 233
            + Math.pow(t, 3) / 2547;
    }

    if (year >= 1961 && year < 1986) {
        t = y - 1975;
        deltaT = 45.45
            + 1.067 * t
            - Math.pow(t, 2) / 260
            - Math.pow(t, 3) / 718;
    }

    if (year >= 1986 && year < 2005) {
        t = y - 2000;
        deltaT = 63.86
            + 0.3345 * t
            - 0.060374 * Math.pow(t, 2)
            + 0.0017275 * Math.pow(t, 3)
            + 0.000651814 * Math.pow(t, 4)
            + 0.00002373599 * Math.pow(t, 5);
    }

    if (year >= 2005 && year < 2050) {
        t = y - 2000;
        deltaT = 62.92
            + 0.32217 * t
            + 0.005589 * Math.pow(t, 2);
    }

    if (year >= 2050) {
        t = (y - 1820) / 100;
        deltaT = -20
            + 32 * Math.pow(t, 2);
    }

    return deltaT;
}
