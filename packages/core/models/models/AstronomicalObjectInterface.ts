import type {LimbAlignment} from '@app/enums/limb';
import type {
    EclipticSphericalCoordinates,
    EquatorialSphericalCoordinates,
    LocalHorizontalCoordinates,
    RectangularCoordinates,
} from '@app/types/CoordinateTypes';
import type {Location} from '@app/types/LocationTypes';
import type TimeOfInterest from '@package/time/models/TimeOfInterest';

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

    getAngularDiameter(): number;

    getTransit(location: Location): TimeOfInterest;

    getGeometricRise(location: Location, limbAlignment?: LimbAlignment): TimeOfInterest;

    getApparentRise(location: Location, limbAlignment?: LimbAlignment): TimeOfInterest;

    getGeometricSet(location: Location, limbAlignment?: LimbAlignment): TimeOfInterest;

    getApparentSet(location: Location, limbAlignment?: LimbAlignment): TimeOfInterest;
}
