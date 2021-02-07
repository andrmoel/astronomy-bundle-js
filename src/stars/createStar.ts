import {EquatorialSphericalCoordinates} from '../coordinates/coordinateTypes';
import TimeOfInterest from '../time/TimeOfInterest';
import {ProperMotion} from './starTypes';
import Star from './Star';

export function byEquatorialCoordinates(
    coords: EquatorialSphericalCoordinates,
    toi?: TimeOfInterest,
    properMotion?: ProperMotion,
    referenceEpoch?: number,
): Star {
    return new Star(coords, toi, properMotion, referenceEpoch);
}
