import {EPOCH_J2000} from '@app/constants/epoch';

export function getEpochInterval(jd: number, startingEpoch: number): number {
    return (jd - startingEpoch) / 36525;
}

export function getEpochIntervalToJ2000(startingEpoch: number): number {
    return getEpochInterval(startingEpoch, EPOCH_J2000);
}
