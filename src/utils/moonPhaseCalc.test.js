import {MOON_PHASE_LAST_QUARTER, MOON_PHASE_NEW_MOON, MOON_PHASE_FIRST_QUARTER, MOON_PHASE_FULL_MOON}
    from '../constants/moonPhase';
import {getTimeOfInterestOfUpcomingPhase} from './moonPhaseCalc';

it('tests getTimeOfInterestOfUpcomingPhase with new moon', () => {
    const toi = getTimeOfInterestOfUpcomingPhase(1977.13, MOON_PHASE_NEW_MOON);

    expect(toi.time).toEqual({year: 1977, month: 2, day: 18, hour: 3, min: 37, sec: 20});
});

it('tests getTimeOfInterestOfUpcomingPhase with last quarter', () => {
    const toi = getTimeOfInterestOfUpcomingPhase(2044, MOON_PHASE_LAST_QUARTER);

    expect(toi.time).toEqual({year: 2044, month: 1, day: 21, hour: 23, min: 48, sec: 15});
});

it('tests getTimeOfInterestOfUpcomingPhase with last quarter', () => {
    // createTimeOfInterest.fromTime(2021, 3, 14, 0, 0, 0).getDecimalYear() = 2021.1972602739727
    const toi = getTimeOfInterestOfUpcomingPhase(2021.1972602739727, MOON_PHASE_LAST_QUARTER);

    expect(toi.time.year).toEqual(2021);
    expect(toi.time.month).toEqual(4);
    expect(toi.time.day).toEqual(4);
    expect(toi.time.hour).toEqual(10);
    expect(toi.time.min).toEqual(3);
    expect(toi.time.sec).toEqual(49);
});

it('tests getTimeOfInterestOfUpcomingPhase with last quarter', () => {
    // createTimeOfInterest.fromTime(2021, 3, 14, 0, 0, 0).getDecimalYear() = 2021.1972602739727
    const toi = getTimeOfInterestOfUpcomingPhase(2021.1972602739727, MOON_PHASE_FIRST_QUARTER);

    expect(toi.time.year).toEqual(2021);
    expect(toi.time.month).toEqual(3);
    expect(toi.time.day).toEqual(21);
    expect(toi.time.hour).toEqual(14);
    expect(toi.time.min).toEqual(41);
    expect(toi.time.sec).toEqual(51);
});

it('tests getTimeOfInterestOfUpcomingPhase with last quarter', () => {
    // createTimeOfInterest.fromTime(2021, 3, 14, 0, 0, 0).getDecimalYear() = 2021.1972602739727
    const toi = getTimeOfInterestOfUpcomingPhase(2021.1972602739727, MOON_PHASE_FULL_MOON);

    expect(toi.time.year).toEqual(2021);
    expect(toi.time.month).toEqual(3);
    expect(toi.time.day).toEqual(28);
    expect(toi.time.hour).toEqual(18);
    expect(toi.time.min).toEqual(49);
    expect(toi.time.sec).toEqual(11);
});

it('tests getTimeOfInterestOfUpcomingPhase with last quarter', () => {
    // createTimeOfInterest.fromTime(2021, 3, 14, 0, 0, 0).getDecimalYear() = 2021.1972602739727
    const toi = getTimeOfInterestOfUpcomingPhase(2021.1972602739727, MOON_PHASE_NEW_MOON);

    expect(toi.time.year).toEqual(2021);
    expect(toi.time.month).toEqual(4);
    expect(toi.time.day).toEqual(12);
    expect(toi.time.hour).toEqual(2);
    expect(toi.time.min).toEqual(32);
    expect(toi.time.sec).toEqual(25);
});
