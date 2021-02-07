import {EquatorialSphericalCoordinates} from '../coordinates/coordinateTypes';
import IProperMotion from './interfaces/IProperMotion';
import TimeOfInterest from '../time/TimeOfInterest';
import Star from './Star';

export function byEquatorialCoordinates(
    coords: EquatorialSphericalCoordinates,
    toi?: TimeOfInterest,
    properMotion?: IProperMotion,
    referenceEpoch?: number,
): Star {
    return new Star(coords, toi, properMotion, referenceEpoch);
}
