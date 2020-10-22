import {createTimeOfInterest} from '../time';
import {round} from '../utils/math';
import createSun from './createSun';

it('tests getDistanceToEarth', () => {
    const toi = createTimeOfInterest.fromTime(2020, 10, 22, 6, 15, 0);
    const sun = createSun(toi);

    expect(round(sun.getDistanceToEarth(), 6)).toBe(148870110.831033);
});
