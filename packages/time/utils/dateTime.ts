import {round} from '@app/utils/math';
import type {Time} from '../types/TimeTypes';

export function sec2string(sec: number, short = false): string {
    const sign = sec < 0 ? '-' : '';
    sec = Math.abs(sec);

    const hour = Math.floor(sec / 3660);
    const min = Math.floor((sec - hour * 3600) / 60);
    const secPart = round(sec - hour * 3600 - min * 60, 2);

    if (short && hour === 0.0 && min === 0.0) {
        return `${sign + secPart}s`;
    }

    if (short && hour === 0.0) {
        return `${sign + min}m ${secPart}s`;
    }

    return `${sign + hour}h ${min}m ${secPart}s`;
}

export function time2julianDay(time: Time): number {
    const tmpYear = parseFloat(`${time.year}.${getDayOfYear(time)}`);

    let Y: number;
    let M: number;

    if (time.month > 2) {
        Y = time.year;
        M = time.month;
    } else {
        Y = time.year - 1;
        M = time.month + 12;
    }

    const D = time.day;
    const H = time.hour / 24 + time.min / 1440 + time.sec / 86400;

    let A: number;
    let B: number;

    if (tmpYear >= 1582.288) {
        // YYYY-MM-DD >= 1582-10-15
        A = Math.floor(Y / 100);
        B = 2 - A + Math.floor(A / 4);
    } else if (tmpYear <= 1582.277) {
        // YY-MM-DD <= 1582-10-04
        B = 0;
    } else {
        throw new Error('Date between 1582-10-04 and 1582-10-15 is not defined.');
    }

    // Meeus 7.1
    return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + D + H + B - 1524.5;
}

export function dateStringToJulianDay(dateStr: string): number {
    const isoDate = parseIsoDateString(dateStr);

    if (isoDate !== null) {
        const {offsetMinutes, ...time} = isoDate;
        return time2julianDay(time) - offsetMinutes / 1440;
    }

    const date = new Date(dateStr);

    return time2julianDay({
        year: date.getUTCFullYear(),
        month: date.getUTCMonth() + 1,
        day: date.getUTCDate(),
        hour: date.getUTCHours(),
        min: date.getUTCMinutes(),
        sec: date.getUTCSeconds(),
    });
}

function parseIsoDateString(dateStr: string): (Time & {offsetMinutes: number}) | null {
    const match =
        /^([+-]?\d+)-(\d{2})-(\d{2})(?:[T ](\d{2})(?::(\d{2})(?::(\d{2}(?:\.\d+)?))?)?(?:Z|([+-])(\d{2}):?(\d{2}))?)?$/.exec(
            dateStr,
        );

    if (!match) {
        return null;
    }

    const [, year, month, day, hour = '0', min = '0', sec = '0', offsetSign, offsetHour = '0', offsetMin = '0'] = match;
    const offsetFactor = offsetSign === '-' ? -1 : 1;

    return {
        year: Number(year),
        month: Number(month),
        day: Number(day),
        hour: Number(hour),
        min: Number(min),
        sec: Number(sec),
        offsetMinutes: offsetSign ? offsetFactor * (Number(offsetHour) * 60 + Number(offsetMin)) : 0,
    };
}

export function julianDay2time(jd: number): Time {
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

export function dayOfYear2time(year: number, dayOfYear: number): Time {
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

export function getDecimalYear(time: Time): number {
    const daysInYear = isLeapYear(time.year) ? 366 : 365;
    const dayOfYear = getDayOfYear(time) - 1 + time.hour / 24 + time.min / 1440 + time.sec / 86400;

    return time.year + dayOfYear / daysInYear;
}

export function getDayOfYear(time: Time): number {
    const K = isLeapYear(time.year) ? 1 : 2;
    const M = time.month;
    const D = time.day;

    // Meeus 7.f
    return Math.floor((275 * M) / 9) - K * Math.floor((M + 9) / 12) + D - 30;
}

export function getDayOfWeek(time: Time): number {
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

export function shortYear2longYear(shortYearString: string): number {
    const currentDate = new Date(Date.now());
    const currentYear = currentDate.getFullYear();
    const currentYearStr = currentYear.toString();

    const currentYearFirstDigitsStr = currentYearStr.substr(0, currentYearStr.length - 2);
    const currentYearFirstDigits = parseInt(currentYearFirstDigitsStr, 10);

    const year1Str = currentYearFirstDigits + shortYearString;
    const year1 = parseInt(year1Str, 10);
    const year2Str = (currentYearFirstDigits - 1).toString() + shortYearString;
    const year2 = parseInt(year2Str, 10);

    return year1 <= currentYear ? year1 : year2;
}
