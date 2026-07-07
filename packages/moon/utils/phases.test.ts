import {MOON_PHASE_LAST_QUARTER, MOON_PHASE_NEW_MOON} from '@app/constants/moon';
import {getTimeOfInterestOfUpcomingPhase} from './phases';

it('tests getTimeOfInterestOfUpcomingPhase with new moon', () => {
    const toi = getTimeOfInterestOfUpcomingPhase(1977.13, MOON_PHASE_NEW_MOON);

    // Meeus example 49.a yields 1977-02-18 03:37:20 in Dynamical Time; the result is in UT (TD - ΔT).
    expect(toi.time).toEqual({year: 1977, month: 2, day: 18, hour: 3, min: 36, sec: 33});
});

it('tests getTimeOfInterestOfUpcomingPhase with last quarter', () => {
    const toi = getTimeOfInterestOfUpcomingPhase(2044, MOON_PHASE_LAST_QUARTER);

    expect(toi.time).toEqual({year: 2044, month: 1, day: 21, hour: 23, min: 47, sec: 2});
});
