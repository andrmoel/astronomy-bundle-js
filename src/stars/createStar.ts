import IEquatorialSphericalCoordinates from '../coordinates/interfaces/IEquatorialSphericalCoordinates';
import IProperMotion from './interfaces/IProperMotion';
import Star from './Star';

export function byGeocentricEquatorialCoordinates(
    coords: IEquatorialSphericalCoordinates,
    properMotion?: IProperMotion,
    referenceEpoch?: number,
): Star {
    return new Star();
}
