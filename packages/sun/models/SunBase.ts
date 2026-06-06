import type {EclipticSphericalCoordinates, RectangularCoordinates} from '@app/types/CoordinateTypes';
import type {Location} from '@app/types/LocationTypes';
import {correctEffectOfAberration, correctEffectOfNutation} from '@app/utils/apparentPositionCorrections';
import {earthEclipticSpherical2sunEclipticSpherical, spherical2rectangular} from '@app/utils/coordinateTransformation';
import {getAngularDiameter} from '@app/utils/observation';
import AstronomicalObject from '@package/core/models/models/AstronomicalObject';
import type EarthBase from '@package/earth/models/EarthBase';
import {SUN_DIAMETER_KM} from '@package/sun/constants/diameters';
import type TimeOfInterest from '@package/time/models/TimeOfInterest';

export default abstract class SunBase extends AstronomicalObject {
    protected constructor(
        toi: TimeOfInterest | undefined,
        private readonly earth: EarthBase,
    ) {
        super(toi, 'sun');
    }

    public getHeliocentricEclipticRectangularJ2000Coordinates(): RectangularCoordinates {
        return {x: 0, y: 0, z: 0};
    }

    public getHeliocentricEclipticRectangularDateCoordinates(): RectangularCoordinates {
        return {x: 0, y: 0, z: 0};
    }

    public getHeliocentricEclipticSphericalJ2000Coordinates(): EclipticSphericalCoordinates {
        return {lon: 0, lat: 0, radiusVector: 0};
    }

    public getHeliocentricEclipticSphericalDateCoordinates(): EclipticSphericalCoordinates {
        return {lon: 0, lat: 0, radiusVector: 0};
    }

    public getGeocentricEclipticRectangularJ2000Coordinates(): RectangularCoordinates {
        return spherical2rectangular(this.getGeocentricEclipticSphericalJ2000Coordinates());
    }

    public getGeocentricEclipticRectangularDateCoordinates(): RectangularCoordinates {
        return spherical2rectangular(this.getGeocentricEclipticSphericalDateCoordinates());
    }

    public getGeocentricEclipticSphericalJ2000Coordinates(): EclipticSphericalCoordinates {
        return earthEclipticSpherical2sunEclipticSpherical(
            this.earth.getHeliocentricEclipticSphericalJ2000Coordinates(),
        );
    }

    public getGeocentricEclipticSphericalDateCoordinates(): EclipticSphericalCoordinates {
        return earthEclipticSpherical2sunEclipticSpherical(
            this.earth.getHeliocentricEclipticSphericalDateCoordinates(),
        );
    }

    public getApparentGeocentricEclipticSphericalCoordinates(): EclipticSphericalCoordinates {
        let coords = this.getGeocentricEclipticSphericalDateCoordinates();

        coords = correctEffectOfAberration(coords, this.T);
        coords = correctEffectOfNutation(coords, this.T);

        return coords;
    }

    public getAngularDiameter(): number {
        return getAngularDiameter(this.getApparentDistanceToEarth(), SUN_DIAMETER_KM);
    }

    public getTopocentricAngularDiameter(location: Location): number {
        return getAngularDiameter(this.getTopocentricDistanceToEarth(location), SUN_DIAMETER_KM);
    }

    public getApparentMagnitude(): number {
        return -26.74;
    }

    public getTopocentricApparentMagnitude(): number {
        return -26.74;
    }
}
