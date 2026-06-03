import {EPOCH_J1950, EPOCH_J2000} from '@app/constants/epoch';
import {getEpochInterval, getEpochIntervalToJ2000} from '@app/utils/epoch';

it('tests getEpochInterval', () => {
    expect(getEpochInterval(2451545, EPOCH_J2000)).toBe(0);
    expect(getEpochInterval(2451545, EPOCH_J1950)).toBe(0.5);
    expect(getEpochInterval(2452049.29, EPOCH_J2000)).toBeCloseTo(0.01380671);
    expect(getEpochInterval(2452049.29, EPOCH_J1950)).toBeCloseTo(0.51380671);
});

it('tests getEpochIntervalToJ2000', () => {
    expect(getEpochIntervalToJ2000(2451545)).toBe(0);
    expect(getEpochIntervalToJ2000(2452049.29)).toBeCloseTo(0.01380671);
});
