import createTimeOfInterest, {
    fromCurrentTime,
    fromDate,
    fromJulianCenturiesJ2000,
    fromJulianDay,
    fromTime,
    fromYearOfDay,
} from './createTimeOfInterest';

jest.spyOn(global.Date, 'now').mockReturnValue('2020-10-21 10:00:00Z');

it('tests default export', () => {
    const toi = createTimeOfInterest();

    expect(toi.time).toEqual({year: 2020, month: 10, day: 21, hour: 10, min: 0, sec: 0});
});

it('tests fromCurrentTime', () => {
    const toi = fromCurrentTime();

    expect(toi.time).toEqual({year: 2020, month: 10, day: 21, hour: 10, min: 0, sec: 0});
});

it('tests fromTime', () => {
    const toi = fromTime(2015, 3, 15, 8, 30, 55);

    expect(toi.time).toEqual({year: 2015, month: 3, day: 15, hour: 8, min: 30, sec: 55});
});

it('tests fromDate', () => {
    const toi = fromDate(new Date('2016-07-08 12:34:56Z'));

    expect(toi.time).toEqual({year: 2016, month: 7, day: 8, hour: 12, min: 34, sec: 56});
});

it('tests fromYearOfDay', () => {
    const toi = fromYearOfDay(2015, 254);

    expect(toi.time).toEqual({year: 2015, month: 9, day: 11, hour: 0, min: 0, sec: 0});
});

it('tests fromJulianDay', () => {
    const toi = fromJulianDay(2451545.0);

    expect(toi.time).toEqual({year: 2000, month: 1, day: 1, hour: 12, min: 0, sec: 0});
});

it('tests fromJulianCenturiesJ2000', () => {
    const toi = fromJulianCenturiesJ2000(-0.1272742983);

    expect(toi.time).toEqual({year: 1987, month: 4, day: 10, hour: 19, min: 21, sec: 0});
});
