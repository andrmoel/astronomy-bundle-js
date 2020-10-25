import TimeOfInterest from './TimeOfInterest';
import {round} from '../utils/math';

it('tests getDate', () => {
    const toi = new TimeOfInterest({year: 2000, month: 5, day: 20, hour: 13, min: 50, sec: 40});

    expect(toi.getDate()).toEqual(new Date('2000-05-20T13:50:40.000Z'));
});

it('tests getJulianDay', () => {
    const toi = new TimeOfInterest({year: 2000, month: 5, day: 20, hour: 13, min: 50, sec: 40});

    expect(round(toi.getJulianDay(), 6)).toBe(2451685.076852);
});

it('tests getJulianCenturiesJ2000', () => {
    const toi = new TimeOfInterest({year: 2000, month: 5, day: 20, hour: 13, min: 50, sec: 40});

    expect(round(toi.getJulianCenturiesJ2000(), 6)).toBe(0.003835);
});
