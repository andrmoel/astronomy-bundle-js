import {LIGHT_SPEED_KM_PER_SEC} from '@app/constants/units';
import type {
    EclipticSphericalCoordinates,
    EquatorialSphericalCoordinates,
    LocalHorizontalCoordinates,
    RectangularCoordinates,
} from '@app/types/CoordinateTypes';
import type {Location} from '@app/types/LocationTypes';
import {correctEffectOfRefraction} from '@app/utils/apparentPositionCorrections';
import {
    eclipticSpherical2equatorialSpherical,
    equatorialSpherical2topocentricHorizontal,
    equatorialSpherical2topocentricSpherical,
    spherical2rectangular,
} from '@app/utils/coordinateTransformation';
import {au2km} from '@app/utils/distance';
import TimeOfInterest from '@package/time/models/TimeOfInterest';
import type {AstronomicalObjectInterface} from './AstronomicalObjectInterface';

export default abstract class AstronomicalObject implements AstronomicalObjectInterface {
    protected readonly jd: number = 0.0;

    protected readonly jd0: number = 0.0;

    protected readonly T: number = 0.0;

    protected readonly t: number = 0.0;

    protected constructor(
        protected readonly toi: TimeOfInterest = TimeOfInterest.fromCurrentTime(),
        public readonly name = 'astronomical object',
    ) {
        this.jd = toi.getJulianDay();
        this.jd0 = toi.getJulianDay0();
        this.T = toi.getJulianCenturiesJ2000();
        this.t = toi.getJulianMillenniaJ2000();
    }

    public getTimeOfInterest(): TimeOfInterest {
        return this.toi;
    }

    public abstract getHeliocentricEclipticRectangularJ2000Coordinates(): RectangularCoordinates;

    public abstract getHeliocentricEclipticRectangularDateCoordinates(): RectangularCoordinates;

    public abstract getHeliocentricEclipticSphericalJ2000Coordinates(): EclipticSphericalCoordinates;

    public abstract getHeliocentricEclipticSphericalDateCoordinates(): EclipticSphericalCoordinates;

    public abstract getGeocentricEclipticRectangularJ2000Coordinates(): RectangularCoordinates;

    public abstract getGeocentricEclipticRectangularDateCoordinates(): RectangularCoordinates;

    public abstract getGeocentricEclipticSphericalJ2000Coordinates(): EclipticSphericalCoordinates;

    public abstract getGeocentricEclipticSphericalDateCoordinates(): EclipticSphericalCoordinates;

    public getGeocentricEquatorialSphericalJ2000Coordinates(): EquatorialSphericalCoordinates {
        const coords = this.getGeocentricEclipticSphericalJ2000Coordinates();

        return eclipticSpherical2equatorialSpherical(coords, this.T);
    }

    public getGeocentricEquatorialSphericalDateCoordinates(): EquatorialSphericalCoordinates {
        const coords = this.getGeocentricEclipticSphericalDateCoordinates();

        return eclipticSpherical2equatorialSpherical(coords, this.T);
    }

    public getApparentGeocentricEclipticRectangularCoordinates(): RectangularCoordinates {
        const coords = this.getApparentGeocentricEclipticSphericalCoordinates();

        return spherical2rectangular(coords);
    }

    public abstract getApparentGeocentricEclipticSphericalCoordinates(): EclipticSphericalCoordinates;

    public getApparentGeocentricEquatorialSphericalCoordinates(): EquatorialSphericalCoordinates {
        const coords = this.getApparentGeocentricEclipticSphericalCoordinates();

        return eclipticSpherical2equatorialSpherical(coords, this.T);
    }

    public getApparentTopocentricEquatorialSphericalCoordinates(location: Location): EquatorialSphericalCoordinates {
        const coords = this.getApparentGeocentricEquatorialSphericalCoordinates();

        return equatorialSpherical2topocentricSpherical(coords, location, this.T);
    }

    public getApparentTopocentricHorizontalCoordinates(location: Location): LocalHorizontalCoordinates {
        const coords = this.getApparentGeocentricEquatorialSphericalCoordinates();

        return equatorialSpherical2topocentricHorizontal(coords, location, this.T);
    }

    public getRefractionCorrectedTopocentricHorizontalCoordinates(location: Location): LocalHorizontalCoordinates {
        const {azimuth, altitude, radiusVector} = this.getApparentTopocentricHorizontalCoordinates(location);

        return {
            azimuth: azimuth,
            altitude: correctEffectOfRefraction(altitude),
            radiusVector: radiusVector,
        };
    }

    public getDistanceToEarth(): number {
        const coords = this.getGeocentricEclipticSphericalDateCoordinates();

        return au2km(coords.radiusVector);
    }

    public getApparentDistanceToEarth(): number {
        const coords = this.getApparentGeocentricEclipticSphericalCoordinates();

        return au2km(coords.radiusVector);
    }

    public getTopocentricDistanceToEarth(location: Location): number {
        const coords = this.getApparentTopocentricEquatorialSphericalCoordinates(location);

        return au2km(coords.radiusVector);
    }

    public getLightTime(): number {
        const {radiusVector} = this.getGeocentricEclipticSphericalDateCoordinates();

        return au2km(radiusVector) / LIGHT_SPEED_KM_PER_SEC;
    }

    // public getConjunctionInRightAscensionTo(
    //     astronomicalObjectConstructor: AstronomicalObjectConstructor,
    // ): Conjunction {
    //     return getConjunctionInRightAscension(
    //         this.constructor as AstronomicalObjectConstructor,
    //         astronomicalObjectConstructor,
    //         this.jd0,
    //     );
    // }
    //
    // public getConjunctionInLongitudeTo(
    //     astronomicalObjectConstructor: AstronomicalObjectConstructor,
    // ): Conjunction {
    //     return getConjunctionInLongitude(
    //         this.constructor as AstronomicalObjectConstructor,
    //         astronomicalObjectConstructor,
    //         this.jd0,
    //     );
    // }
}
