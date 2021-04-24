import TimeOfInterest from '../../time/TimeOfInterest';
import {
    EclipticSphericalCoordinates,
    EquatorialSphericalCoordinates,
    LocalHorizontalCoordinates,
    RectangularCoordinates,
} from '../../coordinates/types/CoordinateTypes';
import {Location} from '../../earth/types/LocationTypes';

export default interface IAstronomicalObject {
    toi: TimeOfInterest,

    getGeocentricEclipticRectangularJ2000Coordinates(): Promise<RectangularCoordinates>;

    getGeocentricEclipticRectangularDateCoordinates(): Promise<RectangularCoordinates>;

    getGeocentricEclipticSphericalJ2000Coordinates(): Promise<EclipticSphericalCoordinates>;

    getGeocentricEclipticSphericalDateCoordinates(): Promise<EclipticSphericalCoordinates>;

    getGeocentricEquatorialSphericalJ2000Coordinates(): Promise<EquatorialSphericalCoordinates>;

    getGeocentricEquatorialSphericalDateCoordinates(): Promise<EquatorialSphericalCoordinates>;

    getApparentGeocentricEclipticSphericalCoordinates(): Promise<EclipticSphericalCoordinates>;

    getApparentGeocentricEquatorialSphericalCoordinates(): Promise<EquatorialSphericalCoordinates>;

    getTopocentricEquatorialSphericalCoordinates(location: Location): Promise<EquatorialSphericalCoordinates>;

    getTopocentricHorizontalCoordinates(location: Location): Promise<LocalHorizontalCoordinates>;

    getApparentTopocentricHorizontalCoordinates(location: Location): Promise<LocalHorizontalCoordinates>;
}
