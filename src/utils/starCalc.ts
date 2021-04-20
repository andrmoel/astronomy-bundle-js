import {EquatorialSphericalCoordinates} from '../coordinates/coordinateTypes';
import {EPOCH_J2000} from '../constants/epoch';
import {ProperMotion} from '../stars/starTypes';
import {getEpochInterval} from './timeCalc';
import {normalizeAngle} from './angleCalc';

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
