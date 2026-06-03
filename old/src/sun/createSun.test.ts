import {createTimeOfInterest} from '../time';
import createSun from './createSun';
import Sun from './Sun';

it('tests createSun', () => {
    const toi = createTimeOfInterest.fromCurrentTime();
    const sun = createSun(toi);

    expect(sun).toBeInstanceOf(Sun);
});

it('tests createSun without TOI', () => {
    const sun = createSun();

    expect(sun).toBeInstanceOf(Sun);
});
