import {createTimeOfInterest} from '../time';
import createEarth from './createEarth';
import Earth from './Earth';

it('tests createEarth', () => {
    const toi = createTimeOfInterest.fromCurrentTime();
    const earth = createEarth(toi);

    expect(earth).toBeInstanceOf(Earth);
});

it('tests createEarth without TOI', () => {
    const earth = createEarth();

    expect(earth).toBeInstanceOf(Earth);
});
