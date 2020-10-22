import ITime from '../time/interfaces/ITime';
import {round} from "./math";

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
