import {createTimeOfInterest} from '../time';
import {createMoon} from './createMoon';
import {round} from '../utils/math';

it('tests getDistanceToEarth', () => {
    const toi = createTimeOfInterest.fromTime(2020, 10, 22, 6, 15, 0);
    const moon = createMoon(toi);

    expect(round(moon.getDistanceToEarth(), 6)).toBe(378157.525065);
});
