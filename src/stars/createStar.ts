import {EquatorialSphericalCoordinates} from '../coordinates/types/CoordinateTypes';
import TimeOfInterest from '../time/TimeOfInterest';
import {ProperMotion} from './types/ProperMotionTypes';
import Star from './Star';

export function byEquatorialCoordinates(
    coords: EquatorialSphericalCoordinates,
    toi?: TimeOfInterest,
    properMotion?: ProperMotion,
    referenceEpoch?: number,
): Star {
    return new Star(coords, toi, properMotion, referenceEpoch);
}
