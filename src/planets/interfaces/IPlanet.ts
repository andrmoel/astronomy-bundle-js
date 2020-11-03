import IRectangularCoordinates from '../../coordinates/interfaces/IRectangularCoordinates';

export default interface IPlanet {
    getHeliocentricRectangularJ2000Coordinates(): Promise<IRectangularCoordinates>;

    getHeliocentricRectangularDateCoordinates(): Promise<IRectangularCoordinates>;

    // getHeliocentricEclipticSphericalJ2000Coordinates(): Promise<IEclipticSphericalCoordinates>;

    // getHeliocentricEclipticSphericalDateCoordinates(): Promise<IEclipticSphericalCoordinates>;

    getGeocentricRectangularJ2000Coordinates(): Promise<IRectangularCoordinates>;

    getGeocentricRectangularDateCoordinates(): Promise<IRectangularCoordinates>;

    // getGeocentricEclipticSphericalJ2000Coordinates(): Promise<IEclipticSphericalCoordinates>;

    // getGeocentricEclipticSphericalDateCoordinates(): Promise<IEclipticSphericalCoordinates>;
}
