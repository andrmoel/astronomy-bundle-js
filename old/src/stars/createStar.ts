import {EquatorialSphericalCoordinates} from '../coordinates/types/CoordinateTypes';
import TimeOfInterest from '../time/TimeOfInterest';
import Star from './Star';
import {ProperMotion} from './types/ProperMotionTypes';

export function byEquatorialCoordinates(
    coords: EquatorialSphericalCoordinates,
    toi?: TimeOfInterest,
    properMotion?: ProperMotion,
    referenceEpoch?: number,
): Star {
    return new Star(coords, toi, properMotion, referenceEpoch);
}
