import {MOON_PHASE_LAST_QUARTER, MOON_PHASE_NEW_MOON} from '../constants/moonPhase';
import {getTimeOfInterestOfUpcomingPhase} from './moonPhaseCalc';

it('tests getTimeOfInterestOfUpcomingPhase with new moon', () => {
    const toi = getTimeOfInterestOfUpcomingPhase(1977.13, MOON_PHASE_NEW_MOON);

    expect(toi.time).toEqual({year: 1977, month: 2, day: 18, hour: 3, min: 37, sec: 20});
});

it('tests getTimeOfInterestOfUpcomingPhase with last quarter', () => {
    const toi = getTimeOfInterestOfUpcomingPhase(2044, MOON_PHASE_LAST_QUARTER);

    expect(toi.time).toEqual({year: 2044, month: 1, day: 21, hour: 23, min: 48, sec: 15});
});
