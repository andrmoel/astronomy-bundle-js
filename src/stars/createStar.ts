import IEquatorialSphericalCoordinates from '../coordinates/interfaces/IEquatorialSphericalCoordinates';
import IProperMotion from './interfaces/IProperMotion';
import TimeOfInterest from '../time/TimeOfInterest';
import Star from './Star';

export function byEquatorialCoordinates(
    coords: IEquatorialSphericalCoordinates,
    toi?: TimeOfInterest,
    properMotion?: IProperMotion,
    referenceEpoch?: number,
): Star {
    return new Star(coords, toi, properMotion, referenceEpoch);
}
