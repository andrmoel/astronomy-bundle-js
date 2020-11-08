import IRectangularCoordinates from '../../coordinates/interfaces/IRectangularCoordinates';
import IEclipticSphericalCoordinates from '../../coordinates/interfaces/IEclipticSphericalCoordinates';
import IEquatorialSphericalCoordinates from '../../coordinates/interfaces/IEquatorialSphericalCoordinates';

export default interface IPlanet {
    getHeliocentricRectangularJ2000Coordinates(): Promise<IRectangularCoordinates>;

    getHeliocentricRectangularDateCoordinates(): Promise<IRectangularCoordinates>;

    getHeliocentricEclipticSphericalJ2000Coordinates(): Promise<IEclipticSphericalCoordinates>;

    getHeliocentricEclipticSphericalDateCoordinates(): Promise<IEclipticSphericalCoordinates>;

    getGeocentricRectangularJ2000Coordinates(): Promise<IRectangularCoordinates>;

    getGeocentricRectangularDateCoordinates(): Promise<IRectangularCoordinates>;

    getGeocentricEclipticSphericalJ2000Coordinates(): Promise<IEclipticSphericalCoordinates>;

    getGeocentricEclipticSphericalDateCoordinates(): Promise<IEclipticSphericalCoordinates>;

    getApparentGeocentricEquatorialSphericalCoordinates(): Promise<IEquatorialSphericalCoordinates>;
}
