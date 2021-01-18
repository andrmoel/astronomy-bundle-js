import IEquatorialSphericalCoordinates from '../coordinates/interfaces/IEquatorialSphericalCoordinates';
import {EPOCH_J2000} from '../constants/epoch';
import IProperMotion from '../stars/interfaces/IProperMotion';
import {getEpochInterval} from './timeCalc';
import {normalizeAngle} from './angleCalc';

export function correctProperMotion(
    coords: IEquatorialSphericalCoordinates,
    properMotion: IProperMotion,
    jd: number,
    startingEpoch: number = EPOCH_J2000
): IEquatorialSphericalCoordinates {
    const t = getEpochInterval(jd, startingEpoch) * 100;

    const rightAscension = coords.rightAscension + properMotion.rightAscension * t;
    const declination = coords.declination + properMotion.declination * t;

    return {
        rightAscension: normalizeAngle(rightAscension),
        declination: declination,
        radiusVector: coords.radiusVector,
    }
}
