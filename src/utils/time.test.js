import {
    getGreenwichMeanSiderealTime,
    julianCenturiesJ20002julianDay,
    julianDay2julianCenturiesJ2000,
    julianDay2julianDay0,
    julianDay2julianMillenniaJ2000,
    julianDay2ModifiedJulianDay,
    julianMillenniaJ20002julianDay,
} from './time';
import {round} from './math';
import {deg2time} from './angle';

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

it('test for getGreenwichMeanSiderealTime', () => {
    // 1987-04-10 00:00:00
    let GMST = getGreenwichMeanSiderealTime(-0.127296372348);

    expect(deg2time(GMST)).toBe('13h10m46.366s');

    // 1987-04-10 19:21:00
    GMST = getGreenwichMeanSiderealTime(-0.12727429842574);

    expect(deg2time(GMST)).toBe('8h34m57.09s');
});
