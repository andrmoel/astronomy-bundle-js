import TimeOfInterest from '../../time/TimeOfInterest';
import IEquatorialSphericalCoordinates from '../../coordinates/interfaces/IEquatorialSphericalCoordinates';

export default interface IAstronomicalObject {
    toi: TimeOfInterest,

    getApparentGeocentricEquatorialSphericalCoordinates(): Promise<IEquatorialSphericalCoordinates>;
}
