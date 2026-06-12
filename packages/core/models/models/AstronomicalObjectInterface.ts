import type {
    EclipticSphericalCoordinates,
    EquatorialSphericalCoordinates,
    LocalHorizontalCoordinates,
    RectangularCoordinates,
} from '@app/types/CoordinateTypes';
import type {Location} from '@app/types/LocationTypes';

export interface AstronomicalObjectInterface {
    getGeocentricEclipticRectangularJ2000Coordinates(): RectangularCoordinates;

    getGeocentricEclipticRectangularDateCoordinates(): RectangularCoordinates;

    getGeocentricEclipticSphericalJ2000Coordinates(): EclipticSphericalCoordinates;

    getGeocentricEclipticSphericalDateCoordinates(): EclipticSphericalCoordinates;

    getGeocentricEquatorialSphericalJ2000Coordinates(): EquatorialSphericalCoordinates;

    getGeocentricEquatorialSphericalDateCoordinates(): EquatorialSphericalCoordinates;

    getApparentGeocentricEclipticSphericalCoordinates(): EclipticSphericalCoordinates;

    getApparentGeocentricEquatorialSphericalCoordinates(): EquatorialSphericalCoordinates;

    getApparentTopocentricEquatorialSphericalCoordinates(location: Location): EquatorialSphericalCoordinates;

    getApparentTopocentricHorizontalCoordinates(location: Location): LocalHorizontalCoordinates;

    getRefractionCorrectedTopocentricHorizontalCoordinates(location: Location): LocalHorizontalCoordinates;
}
