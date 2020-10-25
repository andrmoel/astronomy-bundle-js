import TimeOfInterest from './TimeOfInterest';
import {round} from '../utils/math';
import {DAY_OF_WEEK_SATURDAY} from '../constants/dayOfWeek';

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

it('tests getJulianCenturiesJ2000', () => {
    const toi = new TimeOfInterest({year: 2000, month: 5, day: 20, hour: 13, min: 50, sec: 40});

    expect(round(toi.getJulianCenturiesJ2000(), 6)).toBe(0.003835);
});
