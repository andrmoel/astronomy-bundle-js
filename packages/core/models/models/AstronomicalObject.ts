import {LIGHT_SPEED_KM_PER_SEC} from '@app/constants/units';
import {LimbAlignment} from '@app/enums/limb';
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
import {getRise, getSet, getStandardAltitude, getTransit} from '@app/utils/riseSetTransit';
import TimeOfInterest from '@package/time/models/TimeOfInterest';
import type {AstronomicalObjectInterface} from './AstronomicalObjectInterface';

export default abstract class AstronomicalObject implements AstronomicalObjectInterface {
    protected readonly jd0: number = 0.0;

    protected readonly jd: number = 0.0;

    // Julian Centuries J2000 in Dynamical Time (TT), for ephemeris series
    protected readonly Te: number = 0.0;

    // Julian Millennia J2000 in Dynamical Time (TT), for ephemeris series
    protected readonly te: number = 0.0;

    // Julian Centuries J2000 in Universal Time (UT), for sidereal time
    protected readonly T: number = 0.0;

    protected constructor(
        protected readonly toi: TimeOfInterest = TimeOfInterest.fromCurrentTime(),
        public readonly name = 'astronomical object',
    ) {
        this.jd0 = toi.getJulianDay0();
        this.jd = toi.getJulianDay();
        this.T = toi.getJulianCenturiesJ2000();
        this.Te = toi.getJulianCenturiesJ2000Ephemeris();
        this.te = toi.getJulianMillenniaJ2000Ephemeris();
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

        return eclipticSpherical2equatorialSpherical(coords, this.Te);
    }

    public getGeocentricEquatorialSphericalDateCoordinates(): EquatorialSphericalCoordinates {
        const coords = this.getGeocentricEclipticSphericalDateCoordinates();

        return eclipticSpherical2equatorialSpherical(coords, this.Te);
    }

    public getApparentGeocentricEclipticRectangularCoordinates(): RectangularCoordinates {
        const coords = this.getApparentGeocentricEclipticSphericalCoordinates();

        return spherical2rectangular(coords);
    }

    public abstract getApparentGeocentricEclipticSphericalCoordinates(): EclipticSphericalCoordinates;

    public getApparentGeocentricEquatorialSphericalCoordinates(): EquatorialSphericalCoordinates {
        const coords = this.getApparentGeocentricEclipticSphericalCoordinates();

        return eclipticSpherical2equatorialSpherical(coords, this.Te);
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

    public getAngularDiameter(): number {
        return 0;
    }

    public getTransit(location: Location): TimeOfInterest {
        const jd = getTransit(location, this.jd0, (jd: number) => this.getApparentEquatorialCoordinatesAtJulianDay(jd));

        return TimeOfInterest.fromJulianDay(jd);
    }

    public getGeometricRise(location: Location, limbAlignment: LimbAlignment = LimbAlignment.Center): TimeOfInterest {
        return this.getRiseSet(getRise, location, limbAlignment, false);
    }

    public getApparentRise(location: Location, limbAlignment: LimbAlignment = LimbAlignment.Center): TimeOfInterest {
        return this.getRiseSet(getRise, location, limbAlignment, true);
    }

    public getGeometricSet(location: Location, limbAlignment: LimbAlignment = LimbAlignment.Center): TimeOfInterest {
        return this.getRiseSet(getSet, location, limbAlignment, false);
    }

    public getApparentSet(location: Location, limbAlignment: LimbAlignment = LimbAlignment.Center): TimeOfInterest {
        return this.getRiseSet(getSet, location, limbAlignment, true);
    }

    private getRiseSet(
        riseSet: typeof getRise,
        location: Location,
        limbAlignment: LimbAlignment,
        isRefractionConsidered: boolean,
    ): TimeOfInterest {
        const h0 = getStandardAltitude({isRefractionConsidered, alignment: limbAlignment}, this.getAngularDiameter());
        const jd = riseSet(location, this.jd0, h0, (jd: number) =>
            this.getApparentEquatorialCoordinatesAtJulianDay(jd),
        );

        return TimeOfInterest.fromJulianDay(jd);
    }

    private getApparentEquatorialCoordinatesAtJulianDay(jd: number): EquatorialSphericalCoordinates {
        const toi = TimeOfInterest.fromJulianDay(jd);
        const AstronomicalObjectClass = this.constructor as new (toi: TimeOfInterest) => AstronomicalObject;
        const object = new AstronomicalObjectClass(toi);

        return object.getApparentGeocentricEquatorialSphericalCoordinates();
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
