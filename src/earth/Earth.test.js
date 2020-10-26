import {createTimeOfInterest} from '../time';
import {round} from '../utils/math';
import Earth from './Earth';

it('tests getNutationInLongitude', () => {
    const toi = createTimeOfInterest.fromTime(2020, 10, 2, 22, 19, 44);
    const earth = new Earth(toi);

    expect(round(earth.getNutationInLongitude(), 6)).toBe(-0.004946);
});

it('tests getNutationInObliquity', () => {
    const toi = createTimeOfInterest.fromTime(2020, 10, 2, 22, 19, 44);
    const earth = new Earth(toi);

    expect(round(earth.getNutationInObliquity(), 6)).toBe(0.000478);
});

it('tests getMeanObliquityOfEcliptic', () => {
    const toi = createTimeOfInterest.fromTime(2020, 10, 2, 22, 19, 44);
    const earth = new Earth(toi);

    expect(round(earth.getMeanObliquityOfEcliptic(), 6)).toBe(23.436593);
});

it('tests getTrueObliquityOfEcliptic', () => {
    const toi = createTimeOfInterest.fromTime(2020, 10, 2, 22, 19, 44);
    const earth = new Earth(toi);

    expect(round(earth.getTrueObliquityOfEcliptic(), 6)).toBe(23.43707);
});
