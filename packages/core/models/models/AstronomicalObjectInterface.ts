import type {
    EclipticSphericalCoordinates,
    EquatorialSphericalCoordinates,
    LocalHorizontalCoordinates,
    RectangularCoordinates,
} from '@app/types/CoordinateTypes';
import type {Location} from '@app/types/LocationTypes';
import type TimeOfInterest from '@package/time/models/TimeOfInterest';

export interface AstronomicalObjectConstructor {
    new (toi?: TimeOfInterest): AstronomicalObjectInterface;
}

export interface AstronomicalObjectInterface {
    getGeocentricEclipticRectangularJ2000Coordinates(): RectangularCoordinates;

    getGeocentricEclipticRectangularDateCoordinates(): RectangularCoordinates;

    getGeocentricEclipticSphericalJ2000Coordinates(): EclipticSphericalCoordinates;

    getGeocentricEclipticSphericalDateCoordinates(): EclipticSphericalCoordinates;

    getGeocentricEquatorialSphericalJ2000Coordinates(): EquatorialSphericalCoordinates;

    getGeocentricEquatorialSphericalDateCoordinates(): EquatorialSphericalCoordinates;

    getApparentGeocentricEclipticSphericalCoordinates(): EclipticSphericalCoordinates;

    getApparentGeocentricEquatorialSphericalCoordinates(): EquatorialSphericalCoordinates;

    getTopocentricEquatorialSphericalCoordinates(location: Location): EquatorialSphericalCoordinates;

    getTopocentricHorizontalCoordinates(location: Location): LocalHorizontalCoordinates;

    getApparentTopocentricHorizontalCoordinates(location: Location): LocalHorizontalCoordinates;
}
