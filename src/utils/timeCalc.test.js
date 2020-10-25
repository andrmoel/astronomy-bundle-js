import {DAY_OF_WEEK_FRIDAY, DAY_OF_WEEK_WEDNESDAY} from '../constants/dayOfWeek';
import {
    dayOfYear2time,
    getDayOfWeek,
    getDayOfYear,
    getDeltaT,
    getGreenwichApparentSiderealTime,
    getGreenwichMeanSiderealTime,
    isLeapYear,
    julianCenturiesJ20002julianDay,
    julianDay2julianCenturiesJ2000,
    julianDay2julianDay0,
    julianDay2julianMillenniaJ2000,
    julianDay2ModifiedJulianDay,
    julianDay2time,
    julianMillenniaJ20002julianDay,
    time2julianDay,
} from './timeCalc';
import {round} from './math';
import {deg2time} from './angleCalc';

describe('test for time2julianDay', () => {
    it('has valid times', () => {
        expect(
            time2julianDay({year: 2000, month: 1, day: 1, hour: 12, min: 0, sec: 0}),
        ).toBe(2451545.0);
        expect(
            time2julianDay({year: 1999, month: 1, day: 1, hour: 0, min: 0, sec: 0}),
        ).toBe(2451179.5);
        expect(
            time2julianDay({year: 1987, month: 1, day: 27, hour: 0, min: 0, sec: 0}),
        ).toBe(2446822.5);
        expect(
            time2julianDay({year: 1987, month: 6, day: 19, hour: 12, min: 0, sec: 0}),
        ).toBe(2446966.0);
        expect(
            time2julianDay({year: 1988, month: 1, day: 27, hour: 0, min: 0, sec: 0}),
        ).toBe(2447187.5);
        expect(
            time2julianDay({year: 1988, month: 6, day: 19, hour: 12, min: 0, sec: 0}),
        ).toBe(2447332.0);
        expect(
            time2julianDay({year: 1900, month: 1, day: 1, hour: 0, min: 0, sec: 0}),
        ).toBe(2415020.5);
        expect(
            time2julianDay({year: 1600, month: 1, day: 1, hour: 0, min: 0, sec: 0}),
        ).toBe(2305447.5);
        expect(
            time2julianDay({year: 1600, month: 12, day: 31, hour: 0, min: 0, sec: 0}),
        ).toBe(2305812.5);
        expect(
            round(time2julianDay({year: 837, month: 4, day: 10, hour: 8, min: 0, sec: 0}), 6),
        ).toBe(2026871.833333);
        expect(
            time2julianDay({year: -123, month: 12, day: 31, hour: 0, min: 0, sec: 0}),
        ).toBe(1676496.5);
        expect(
            time2julianDay({year: -122, month: 1, day: 1, hour: 0, min: 0, sec: 0}),
        ).toBe(1676497.5);
        expect(
            time2julianDay({year: -1000, month: 7, day: 12, hour: 12, min: 0, sec: 0}),
        ).toBe(1356001.0);
        expect(
            time2julianDay({year: -1000, month: 2, day: 29, hour: 0, min: 0, sec: 0}),
        ).toBe(1355866.5);
        expect(
            round(time2julianDay({year: -1001, month: 8, day: 17, hour: 21, min: 30, sec: 0}), 6),
        ).toBe(1355671.395833);
        expect(
            time2julianDay({year: -4712, month: 1, day: 1, hour: 12, min: 0, sec: 0}),
        ).toBe(0.0);
    });

    it('has an invalid time', () => {
        try {
            time2julianDay({year: 1582, month: 10, day: 10, hour: 12, min: 0, sec: 0});

            fail('Expected error was not thrown');
        } catch (error) {
            expect(error.message).toBe('Date between 1582-10-04 and 1582-10-15 is not defined.');
        }
    });
});

it('tests for julianDay2time', () => {
    expect(julianDay2time(2451545.0)).toEqual({year: 2000, month: 1, day: 1, hour: 12, min: 0, sec: 0});
    expect(julianDay2time(2451179.5)).toEqual({year: 1999, month: 1, day: 1, hour: 0, min: 0, sec: 0});
    expect(julianDay2time(2446822.5)).toEqual({year: 1987, month: 1, day: 27, hour: 0, min: 0, sec: 0});
    expect(julianDay2time(2446966.0)).toEqual({year: 1987, month: 6, day: 19, hour: 12, min: 0, sec: 0});
    expect(julianDay2time(2447187.5)).toEqual({year: 1988, month: 1, day: 27, hour: 0, min: 0, sec: 0});
    expect(julianDay2time(2447332.0)).toEqual({year: 1988, month: 6, day: 19, hour: 12, min: 0, sec: 0});
    expect(julianDay2time(2415020.5)).toEqual({year: 1900, month: 1, day: 1, hour: 0, min: 0, sec: 0});
    expect(julianDay2time(2305447.5)).toEqual({year: 1600, month: 1, day: 1, hour: 0, min: 0, sec: 0});
    expect(julianDay2time(2305812.5)).toEqual({year: 1600, month: 12, day: 31, hour: 0, min: 0, sec: 0});
    expect(julianDay2time(2026871.833334)).toEqual({year: 837, month: 4, day: 10, hour: 8, min: 0, sec: 0});
    expect(julianDay2time(1676496.5)).toEqual({year: -123, month: 12, day: 31, hour: 0, min: 0, sec: 0});
    expect(julianDay2time(1676497.5)).toEqual({year: -122, month: 1, day: 1, hour: 0, min: 0, sec: 0});
    expect(julianDay2time(1356001.0)).toEqual({year: -1000, month: 7, day: 12, hour: 12, min: 0, sec: 0});
    expect(julianDay2time(1355866.5)).toEqual({year: -1000, month: 2, day: 29, hour: 0, min: 0, sec: 0});
    expect(julianDay2time(1355671.395834)).toEqual({year: -1001, month: 8, day: 17, hour: 21, min: 30, sec: 0});
    expect(julianDay2time(0.0)).toEqual({year: -4712, month: 1, day: 1, hour: 12, min: 0, sec: 0});
});

it('tests julianDay2julianDay0', () => {
    expect(julianDay2julianDay0(2451545.0)).toBe(2451544.5);
    expect(julianDay2julianDay0(2447187.5)).toBe(2447187.5);
    expect(julianDay2julianDay0(2026871.83)).toBe(2026871.5);
    expect(julianDay2julianDay0(2026871.3)).toBe(2026870.5);
    expect(julianDay2julianDay0(1)).toBe(0.5);
});

it('tests julianDay2ModifiedJulianDay', () => {
    expect(julianDay2ModifiedJulianDay(2446895.5)).toBe(46895);
});

it('tests julianDay2julianCenturiesJ2000', () => {
    expect(round(julianDay2julianCenturiesJ2000(2446895.5), 8)).toBe(-0.12729637);
});

it('tests julianCenturiesJ20002julianDay', () => {
    expect(round(julianCenturiesJ20002julianDay(-0.127296372348), 1)).toBe(2446895.5);
});

it('tests julianDay2julianMillenniaJ2000', () => {
    expect(round(julianDay2julianMillenniaJ2000(2446895.5), 8)).toBe(-0.01272964);
});

it('tests julianMillenniaJ20002julianDay', () => {
    expect(round(julianMillenniaJ20002julianDay(-0.012729637235), 1)).toBe(2446895.5);
});

it('tests dayOfYear2time', () => {
    expect(dayOfYear2time(2000, 1)).toEqual({year: 2000, month: 1, day: 1, hour: 0, min: 0, sec: 0});
    expect(dayOfYear2time(2000, 1.5)).toEqual({year: 2000, month: 1, day: 1, hour: 12, min: 0, sec: 0});
    expect(dayOfYear2time(2000, 1.87654)).toEqual({year: 2000, month: 1, day: 1, hour: 21, min: 2, sec: 13});
    expect(dayOfYear2time(2000, 10)).toEqual({year: 2000, month: 1, day: 10, hour: 0, min: 0, sec: 0});
    expect(dayOfYear2time(2000, 10.5)).toEqual({year: 2000, month: 1, day: 10, hour: 12, min: 0, sec: 0});
    expect(dayOfYear2time(2000, 10.87654)).toEqual({year: 2000, month: 1, day: 10, hour: 21, min: 2, sec: 13});
    expect(dayOfYear2time(2000, 100)).toEqual({year: 2000, month: 4, day: 9, hour: 0, min: 0, sec: 0});
    expect(dayOfYear2time(2011, 100)).toEqual({year: 2011, month: 4, day: 10, hour: 0, min: 0, sec: 0});
    expect(dayOfYear2time(2011, 100.5)).toEqual({year: 2011, month: 4, day: 10, hour: 12, min: 0, sec: 0});
    expect(dayOfYear2time(2011, 100.87654)).toEqual({year: 2011, month: 4, day: 10, hour: 21, min: 2, sec: 13});
    expect(dayOfYear2time(2011, 321)).toEqual({year: 2011, month: 11, day: 17, hour: 0, min: 0, sec: 0});
    expect(dayOfYear2time(2011, 321.5)).toEqual({year: 2011, month: 11, day: 17, hour: 12, min: 0, sec: 0});
    expect(dayOfYear2time(2011, 321.87654)).toEqual({year: 2011, month: 11, day: 17, hour: 21, min: 2, sec: 13});
});

it('tests getDayOfYear', () => {
    expect(getDayOfYear({year: 2001, month: 1, day: 1, hour: 0, min: 0, sec: 0})).toBe(1);
    expect(getDayOfYear({year: 2001, month: 1, day: 2, hour: 0, min: 0, sec: 0})).toBe(2);
    expect(getDayOfYear({year: 2001, month: 1, day: 31, hour: 0, min: 0, sec: 0})).toBe(31);
    expect(getDayOfYear({year: 2001, month: 2, day: 1, hour: 0, min: 0, sec: 0})).toBe(32);
    expect(getDayOfYear({year: 2000, month: 10, day: 10, hour: 0, min: 0, sec: 0})).toBe(284);
    expect(getDayOfYear({year: 2001, month: 10, day: 10, hour: 0, min: 0, sec: 0})).toBe(283);
});

it('tests getDayOfWeek', () => {
    expect(getDayOfWeek({year: 1954, month: 6, day: 30, hour: 0, min: 0, sec: 0})).toBe(DAY_OF_WEEK_WEDNESDAY);
    expect(getDayOfWeek({year: 1954, month: 6, day: 30, hour: 7, min: 11, sec: 60})).toBe(DAY_OF_WEEK_WEDNESDAY);
    expect(getDayOfWeek({year: 2019, month: 5, day: 31, hour: 0, min: 0, sec: 0})).toBe(DAY_OF_WEEK_FRIDAY);
});

it('tests isLeapYear', () => {
    expect(isLeapYear(1700)).toBeFalsy();
    expect(isLeapYear(1800)).toBeFalsy();
    expect(isLeapYear(1900)).toBeFalsy();
    expect(isLeapYear(2000)).toBeTruthy();
    expect(isLeapYear(2001)).toBeFalsy();
    expect(isLeapYear(2002)).toBeFalsy();
    expect(isLeapYear(2003)).toBeFalsy();
    expect(isLeapYear(2004)).toBeTruthy();
    expect(isLeapYear(2005)).toBeFalsy();
    expect(isLeapYear(2006)).toBeFalsy();
    expect(isLeapYear(2007)).toBeFalsy();
    expect(isLeapYear(2008)).toBeTruthy();
    expect(isLeapYear(2012)).toBeTruthy();
    expect(isLeapYear(2016)).toBeTruthy();
    expect(isLeapYear(2020)).toBeTruthy();
    expect(isLeapYear(2040)).toBeTruthy();
    expect(isLeapYear(2048)).toBeTruthy();
});

it('tests getGreenwichMeanSiderealTime', () => {
    const T = -0.127296372348;

    const GMST = getGreenwichMeanSiderealTime(T);

    expect(deg2time(GMST)).toBe('13h10m46.366s');
});

it('tests getGreenwichApparentSiderealTime', () => {
    const T = -0.127296372348;

    const GAST = getGreenwichApparentSiderealTime(T);

    expect(deg2time(GAST)).toBe('13h10m46.134s');
});

it('tests getDeltaT', () => {
    expect(round(getDeltaT(2050), 1)).toBe(149.2);
    expect(round(getDeltaT(2018), 1)).toBe(70.5);
    expect(round(getDeltaT(1996), 1)).toBe(61.6);
    expect(round(getDeltaT(1990), 1)).toBe(56.9);
    expect(round(getDeltaT(1986), 1)).toBe(54.9);
    expect(round(getDeltaT(1980), 1)).toBe(50.5);
    expect(round(getDeltaT(1970), 1)).toBe(40.2);
    expect(round(getDeltaT(1960), 1)).toBe(33.1);
    expect(round(getDeltaT(1950), 1)).toBe(29.1);
    expect(round(getDeltaT(1940), 1)).toBe(24.4);
    expect(round(getDeltaT(1930), 1)).toBe(24.1);
    expect(round(getDeltaT(1920), 1)).toBe(21.2);
    expect(round(getDeltaT(1910), 1)).toBe(10.3);
    expect(round(getDeltaT(1900), 1)).toBe(-2.9);
    expect(round(getDeltaT(1890), 1)).toBe(-6.1);
    expect(round(getDeltaT(1880), 1)).toBe(-5.0);
    expect(round(getDeltaT(1870), 1)).toBe(1.0);
    expect(round(getDeltaT(1860), 1)).toBe(7.6);
    expect(round(getDeltaT(1850), 1)).toBe(7.1);
    expect(round(getDeltaT(1840), 1)).toBe(5.5);
    expect(round(getDeltaT(1830), 1)).toBe(7.7);
    expect(round(getDeltaT(1820), 1)).toBe(11.9);
    expect(round(getDeltaT(1810), 1)).toBe(12.5);
    expect(round(getDeltaT(1800), 1)).toBe(13.7);
    expect(round(getDeltaT(1750), 1)).toBe(13.4);
    expect(round(getDeltaT(1700), 1)).toBe(8.8);
    expect(round(getDeltaT(1650), 1)).toBe(50.3);
    expect(round(getDeltaT(1630), 1)).toBe(80.6);
    expect(round(getDeltaT(1620), 1)).toBe(95.4);
    expect(round(getDeltaT(1600), 1)).toBe(120);
    expect(round(getDeltaT(1400), 1)).toBe(321.8);
    expect(round(getDeltaT(1200), 1)).toBe(736.6);
    expect(round(getDeltaT(1000), 1)).toBe(1574.4);
    expect(round(getDeltaT(800), 1)).toBe(2956);
    expect(round(getDeltaT(600), 1)).toBe(4739.6);
    expect(round(getDeltaT(400), 1)).toBe(6699.6);
    expect(round(getDeltaT(200), 1)).toBe(8641.1);
    expect(round(getDeltaT(0), 1)).toBe(10584);
    expect(round(getDeltaT(-200), 1)).toBe(12792.7);
    expect(round(getDeltaT(-400), 1)).toBe(15531.6);
    expect(round(getDeltaT(-600), 1)).toBe(18721.1);
    expect(round(getDeltaT(-800), 1)).toBe(21946.8);
    expect(round(getDeltaT(-1000), 1)).toBe(25428.4);
});
