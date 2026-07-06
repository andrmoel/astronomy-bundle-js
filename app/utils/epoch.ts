import {EPOCH_J2000} from '@app/constants/epoch';
import {DAYS_PER_JULIAN_CENTURY} from '@app/constants/time';

export function getEpochInterval(jd: number, startingEpoch: number): number {
    return (jd - startingEpoch) / DAYS_PER_JULIAN_CENTURY;
}

export function getEpochIntervalToJ2000(startingEpoch: number): number {
    return getEpochInterval(startingEpoch, EPOCH_J2000);
}
