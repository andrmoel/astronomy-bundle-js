import TimeOfInterest from '../../time/TimeOfInterest';
import {
    EclipticSphericalCoordinates,
    EquatorialSphericalCoordinates,
    LocalHorizontalCoordinates,
    RectangularCoordinates
} from '../../coordinates/coordinateTypes';
import ILocation from '../../earth/interfaces/ILocation';

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

    getTopocentricEquatorialSphericalCoordinates(location: ILocation): Promise<EquatorialSphericalCoordinates>;

    getTopocentricHorizontalCoordinates(location: ILocation): Promise<LocalHorizontalCoordinates>;

    getApparentTopocentricHorizontalCoordinates(location: ILocation): Promise<LocalHorizontalCoordinates>;
}
