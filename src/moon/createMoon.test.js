import {createMoon} from './createMoon';
import {createTimeOfInterest} from '../time';
import Moon from './Moon';

it('tests createMoon', () => {
    const toi = createTimeOfInterest.fromCurrentTime();
    const moon = createMoon(toi);

    expect(moon).toBeInstanceOf(Moon);
});
