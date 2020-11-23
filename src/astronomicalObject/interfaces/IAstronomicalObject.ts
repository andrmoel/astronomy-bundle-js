import TimeOfInterest from '../../time/TimeOfInterest';
import IRectangularCoordinates from '../../coordinates/interfaces/IRectangularCoordinates';
import IEclipticSphericalCoordinates from '../../coordinates/interfaces/IEclipticSphericalCoordinates';
import IEquatorialSphericalCoordinates from '../../coordinates/interfaces/IEquatorialSphericalCoordinates';
import ILocalHorizontalCoordinates from '../../coordinates/interfaces/ILocalHorizontalCoordinates';
import ILocation from '../../earth/interfaces/ILocation';

export default interface IAstronomicalObject {
    toi: TimeOfInterest,

    getGeocentricEclipticRectangularJ2000Coordinates(): Promise<IRectangularCoordinates>;

    getGeocentricEclipticRectangularDateCoordinates(): Promise<IRectangularCoordinates>;

    getGeocentricEclipticSphericalJ2000Coordinates(): Promise<IEclipticSphericalCoordinates>;

    getGeocentricEclipticSphericalDateCoordinates(): Promise<IEclipticSphericalCoordinates>;

    getGeocentricEquatorialSphericalJ2000Coordinates(): Promise<IEquatorialSphericalCoordinates>;

    getGeocentricEquatorialSphericalDateCoordinates(): Promise<IEquatorialSphericalCoordinates>;

    getApparentGeocentricEclipticSphericalCoordinates(): Promise<IEclipticSphericalCoordinates>;

    getApparentGeocentricEquatorialSphericalCoordinates(): Promise<IEquatorialSphericalCoordinates>;

    getTopocentricEclipticSphericalCoordinates(location: ILocation): Promise<IEquatorialSphericalCoordinates>;

    getTopocentricHorizontalCoordinates(location: ILocation): Promise<ILocalHorizontalCoordinates>;

    getApparentTopocentricHorizontalCoordinates(location: ILocation): Promise<ILocalHorizontalCoordinates>;
}
