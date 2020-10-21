"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLeapYear = exports.getDayOfWeek = exports.getDayOfYear = exports.dayOfYear2time = exports.julianMillenniaJ20002julianDay = exports.julianDay2julianMillenniaJ2000 = exports.julianCenturiesJ20002julianDay = exports.julianDay2julianCenturiesJ2000 = exports.julianDay2ModifiedJulianDay = exports.julianDay2julianDay0 = exports.julianDay2time = exports.time2julianDay = void 0;
var math_1 = require("./math");
function time2julianDay(time) {
    var tmpYear = parseFloat(time.year + '.' + getDayOfYear(time));
    var Y;
    var M;
    if (time.month > 2) {
        Y = time.year;
        M = time.month;
    }
    else {
        Y = time.year - 1;
        M = time.month + 12;
    }
    var D = time.day;
    var H = time.hour / 24 + time.min / 1440 + time.sec / 86400;
    var A;
    var B;
    if (tmpYear >= 1582.288) {
        A = Math.floor(Y / 100);
        B = 2 - A + Math.floor(A / 4);
    }
    else if (tmpYear <= 1582.277) {
        B = 0;
    }
    else {
        throw new Error('Date between 1582-10-04 and 1582-10-15 is not defined.');
    }
    return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + D + H + B - 1524.5;
}
exports.time2julianDay = time2julianDay;
function julianDay2time(jd) {
    jd = jd + 0.5;
    var Z = Math.floor(jd);
    var F = jd - Z;
    var A = Z;
    if (Z >= 2299161) {
        var a = Math.floor((Z - 1867216.25) / 36524.25);
        A = Z + 1 + a - Math.floor(a / 4);
    }
    var B = A + 1524;
    var C = Math.floor((B - 122.1) / 365.25);
    var D = Math.floor(365.25 * C);
    var E = Math.floor((B - D) / 30.6001);
    var dayOnMonth = B - D - Math.floor(30.6001 * E) + F;
    var month = E < 14 ? E - 1 : E - 13;
    var year = month > 2 ? C - 4716 : C - 4715;
    var hour = (dayOnMonth - Math.floor(dayOnMonth)) * 24;
    var min = (hour - Math.floor(hour)) * 60;
    var sec = (min - Math.floor(min)) * 60;
    return {
        year: Math.floor(year),
        month: Math.floor(month),
        day: Math.floor(dayOnMonth),
        hour: Math.floor(hour),
        min: Math.floor(min),
        sec: Math.floor(sec),
    };
}
exports.julianDay2time = julianDay2time;
function julianDay2julianDay0(jd) {
    return Math.floor(jd + 0.5) - 0.5;
}
exports.julianDay2julianDay0 = julianDay2julianDay0;
function julianDay2ModifiedJulianDay(jd) {
    return jd - 2400000.5;
}
exports.julianDay2ModifiedJulianDay = julianDay2ModifiedJulianDay;
function julianDay2julianCenturiesJ2000(jd) {
    return (jd - 2451545.0) / 36525.0;
}
exports.julianDay2julianCenturiesJ2000 = julianDay2julianCenturiesJ2000;
function julianCenturiesJ20002julianDay(T) {
    return T * 36525.0 + 2451545.0;
}
exports.julianCenturiesJ20002julianDay = julianCenturiesJ20002julianDay;
function julianDay2julianMillenniaJ2000(jd) {
    var T = julianDay2julianCenturiesJ2000(jd);
    return T / 10;
}
exports.julianDay2julianMillenniaJ2000 = julianDay2julianMillenniaJ2000;
function julianMillenniaJ20002julianDay(t) {
    var T = t * 10;
    return julianCenturiesJ20002julianDay(T);
}
exports.julianMillenniaJ20002julianDay = julianMillenniaJ20002julianDay;
function dayOfYear2time(year, dayOfYear) {
    var K = isLeapYear(year) ? 1 : 2;
    var month = dayOfYear < 32 ? 1 : Math.floor((9 * (K + dayOfYear)) / 275 + 0.98);
    var day = Math.floor(dayOfYear - Math.floor((275 * month) / 9) + K * Math.floor((month + 9) / 12) + 30);
    var hourFloat = 24 * (dayOfYear - Math.floor(dayOfYear));
    var hour = Math.floor(hourFloat);
    var minFloat = 60 * (hourFloat - hour);
    var min = Math.floor(minFloat);
    var sec = math_1.round(60 * (minFloat - min));
    return { year: year, month: month, day: day, hour: hour, min: min, sec: sec };
}
exports.dayOfYear2time = dayOfYear2time;
function getDayOfYear(time) {
    var K = isLeapYear(time.year) ? 1 : 2;
    var M = time.month;
    var D = time.day;
    return Math.floor((275 * M) / 9) - K * Math.floor((M + 9) / 12) + D - 30;
}
exports.getDayOfYear = getDayOfYear;
function getDayOfWeek(time) {
    var jd = time2julianDay(time);
    return Math.floor((jd + 1.5) % 7);
}
exports.getDayOfWeek = getDayOfWeek;
function isLeapYear(year) {
    if (year / 4 !== Math.floor(year / 4)) {
        return false;
    }
    else if (year / 100 !== Math.floor(year / 100)) {
        return true;
    }
    else if (year / 400 !== Math.floor(year / 400)) {
        return false;
    }
    else {
        return true;
    }
}
exports.isLeapYear = isLeapYear;
