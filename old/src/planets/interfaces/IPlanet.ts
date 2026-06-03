import {
    EclipticSphericalCoordinates,
    EquatorialSphericalCoordinates,
    RectangularCoordinates,
} from '../../coordinates/types/CoordinateTypes';

export default interface IPlanet {
    getHeliocentricEclipticRectangularJ2000Coordinates(): Promise<RectangularCoordinates>;

    getHeliocentricEclipticRectangularDateCoordinates(): Promise<RectangularCoordinates>;

    getHeliocentricEclipticSphericalJ2000Coordinates(): Promise<EclipticSphericalCoordinates>;

    getHeliocentricEclipticSphericalDateCoordinates(): Promise<EclipticSphericalCoordinates>;

    getGeocentricEclipticRectangularJ2000Coordinates(): Promise<RectangularCoordinates>;

    getGeocentricEclipticRectangularDateCoordinates(): Promise<RectangularCoordinates>;

    getGeocentricEclipticSphericalJ2000Coordinates(): Promise<EclipticSphericalCoordinates>;

    getGeocentricEclipticSphericalDateCoordinates(): Promise<EclipticSphericalCoordinates>;

    getGeocentricEquatorialSphericalJ2000Coordinates(): Promise<EquatorialSphericalCoordinates>;

    getGeocentricEquatorialSphericalDateCoordinates(): Promise<EquatorialSphericalCoordinates>;

    getApparentGeocentricEclipticSphericalCoordinates(): Promise<EclipticSphericalCoordinates>;

    getApparentGeocentricEquatorialSphericalCoordinates(): Promise<EquatorialSphericalCoordinates>;
}
