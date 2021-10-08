import {createTimeOfInterest} from '../time';
import createMoon from './createMoon';
import Moon from './Moon';

it('tests createMoon', () => {
    const toi = createTimeOfInterest.fromCurrentTime();
    const moon = createMoon(toi);

    expect(moon).toBeInstanceOf(Moon);
});

it('tests createMoon without TOI', () => {
    const moon = createMoon();

    expect(moon).toBeInstanceOf(Moon);
});
