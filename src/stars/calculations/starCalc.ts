import {EquatorialSphericalCoordinates} from '../../coordinates/types/CoordinateTypes';
import {EPOCH_J2000} from '../../constants/epoch';
import {ProperMotion} from '../types/ProperMotionTypes';
import {getEpochInterval} from '../../time/calculations/timeCalc';
import {normalizeAngle} from '../../utils/angleCalc';

export function correctProperMotion(
    coords: EquatorialSphericalCoordinates,
    properMotion: ProperMotion,
    jd: number,
    startingEpoch: number = EPOCH_J2000
): EquatorialSphericalCoordinates {
    const t = getEpochInterval(jd, startingEpoch) * 100;

    const rightAscension = coords.rightAscension + properMotion.rightAscension * t;
    const declination = coords.declination + properMotion.declination * t;

    return {
        rightAscension: normalizeAngle(rightAscension),
        declination: declination,
        radiusVector: coords.radiusVector,
    };
}
