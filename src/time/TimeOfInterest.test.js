import TimeOfInterest from './TimeOfInterest';
import {round} from '../utils/math';
import {DAY_OF_WEEK_SATURDAY} from '../constants/dayOfWeek';
import {createTimeOfInterest} from './index';

it('tests getDate', () => {
    const toi = new TimeOfInterest({year: 2000, month: 5, day: 20, hour: 13, min: 50, sec: 40});

    expect(toi.getDate()).toEqual(new Date('2000-05-20T13:50:40.000Z'));
});

it('tests getDayOfYear', () => {
    const toi = new TimeOfInterest({year: 2000, month: 5, day: 20, hour: 13, min: 50, sec: 40});

    expect(toi.getDayOfYear()).toBe(141);
});

it('tests getDayOfWeek', () => {
    const toi = new TimeOfInterest({year: 2000, month: 5, day: 20, hour: 13, min: 50, sec: 40});

    expect(toi.getDayOfWeek()).toBe(DAY_OF_WEEK_SATURDAY);
});

it('tests isLeapYear', () => {
    const toi = new TimeOfInterest({year: 2000, month: 5, day: 20, hour: 13, min: 50, sec: 40});

    expect(toi.isLeapYear()).toBeTruthy();
});

it('tests getJulianDay', () => {
    const toi = new TimeOfInterest({year: 2000, month: 5, day: 20, hour: 13, min: 50, sec: 40});

    expect(round(toi.getJulianDay(), 6)).toBe(2451685.076852);
});

it('tests getJulianDay0', () => {
    const toi = new TimeOfInterest({year: 2000, month: 5, day: 20, hour: 13, min: 50, sec: 40});

    expect(toi.getJulianDay0()).toBe(2451684.5);
});

it('tests getJulianCenturiesJ2000', () => {
    const toi = new TimeOfInterest({year: 2000, month: 5, day: 20, hour: 13, min: 50, sec: 40});

    expect(round(toi.getJulianCenturiesJ2000(), 6)).toBe(0.003835);
});

it('tests getJulianMillenniaJ2000', () => {
    const toi = createTimeOfInterest.fromTime(2017, 7, 2, 13, 37, 0);

    const dayOfYear = toi.getDayOfYear();
    const dayOfWeek = toi.getDayOfWeek();
    const isLeapYear = toi.isLeapYear();

    console.log(dayOfYear, dayOfWeek, isLeapYear);

    // const toi = new TimeOfInterest({year: 2000, month: 5, day: 20, hour: 13, min: 50, sec: 40});
    //
    // expect(round(toi.getJulianMillenniaJ2000(), 6)).toBe(0.000384);
});

it('tests getGreenwichMeanSiderealTime', () => {
    const toi = new TimeOfInterest({year: 2000, month: 5, day: 20, hour: 13, min: 50, sec: 40});

    expect(round(toi.getGreenwichMeanSiderealTime(), 6)).toBe(86.193665);
});

it('tests getLocalMeanSiderealTime', () => {
    const toi = new TimeOfInterest({year: 2000, month: 5, day: 20, hour: 13, min: 50, sec: 40});
    const location = {lat: 54.3, lon: 13.3};

    expect(round(toi.getLocalMeanSiderealTime(location), 6)).toBe(99.493665);
});

it('tests getLocalApparentSiderealTime', () => {
    const toi = new TimeOfInterest({year: 2000, month: 5, day: 20, hour: 13, min: 50, sec: 40});
    const location = {lat: 54.3, lon: 13.3};

    expect(round(toi.getLocalApparentSiderealTime(location), 6)).toBe(99.48946);
});

it('tests getGreenwichApparentSiderealTime', () => {
    const toi = new TimeOfInterest({year: 2000, month: 5, day: 20, hour: 13, min: 50, sec: 40});

    expect(round(toi.getGreenwichApparentSiderealTime(), 6)).toBe(86.18946);
});

it('tests getDeltaT', () => {
    const toi = new TimeOfInterest({year: 2000, month: 5, day: 20, hour: 13, min: 50, sec: 40});

    expect(round(toi.getDeltaT(), 1)).toBe(64);
});