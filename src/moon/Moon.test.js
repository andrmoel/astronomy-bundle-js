import {createTimeOfInterest} from '../time';
import {round} from '../utils/math';
import {createMoon} from './createMoon';

it('tests getDistanceToEarth', () => {
    const toi = createTimeOfInterest.fromTime(2020, 10, 22, 6, 15, 0);
    const moon = createMoon(toi);

    expect(round(moon.getDistanceToEarth(), 6)).toBe(378157.525065);
});
