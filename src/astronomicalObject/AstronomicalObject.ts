import TimeOfInterest from '../time/TimeOfInterest';
import {createTimeOfInterest} from '../time';
import {
    EclipticSphericalCoordinates,
    EquatorialSphericalCoordinates,
    LocalHorizontalCoordinates,
    RectangularCoordinates,
} from '../coordinates/types/CoordinateTypes';
import {getConjunctionInLongitude, getConjunctionInRightAscension} from '../planets/calculations/conjunctionCalc';
import {
    eclipticSpherical2equatorialSpherical,
    equatorialSpherical2topocentricHorizontal,
    equatorialSpherical2topocentricSpherical,
    spherical2rectangular,
} from '../coordinates/calculations/coordinateCalc';
import {au2km} from '../utils/distanceCalc';
import {LIGHT_SPEED_KM_PER_SEC} from '../constants/lightSpeed';
import {Location} from '../earth/types/LocationTypes';
import {correctEffectOfRefraction} from '../coordinates/calculations/apparentCoordinateCalc';
import {Conjunction} from '../planets/types/PlanetTypes';
import IAstronomicalObject from './interfaces/IAstronomicalObject';

export default abstract class AstronomicalObject implements IAstronomicalObject {
    protected readonly jd: number = 0.0;

    protected readonly jd0: number = 0.0;

    protected readonly T: number = 0.0;

    protected readonly t: number = 0.0;

    public constructor(
        private readonly _name = 'astronomical object',
        public readonly toi: TimeOfInterest = createTimeOfInterest.fromCurrentTime(),
    ) {
        this.jd = toi.getJulianDay();
        this.jd0 = toi.getJulianDay0();
        this.T = toi.getJulianCenturiesJ2000();
        this.t = toi.getJulianMillenniaJ2000();
    }

    public get name(): string {
        return this._name;
    }

    public abstract getHeliocentricEclipticRectangularJ2000Coordinates(): Promise<RectangularCoordinates>;

    public abstract getHeliocentricEclipticRectangularDateCoordinates(): Promise<RectangularCoordinates>;

    public abstract getHeliocentricEclipticSphericalJ2000Coordinates(): Promise<EclipticSphericalCoordinates>;

    public abstract getHeliocentricEclipticSphericalDateCoordinates(): Promise<EclipticSphericalCoordinates>;

    public abstract getGeocentricEclipticRectangularJ2000Coordinates(): Promise<RectangularCoordinates>;

    public abstract getGeocentricEclipticRectangularDateCoordinates(): Promise<RectangularCoordinates>;

    public abstract getGeocentricEclipticSphericalJ2000Coordinates(): Promise<EclipticSphericalCoordinates>;

    public abstract getGeocentricEclipticSphericalDateCoordinates(): Promise<EclipticSphericalCoordinates>;

    public async getGeocentricEquatorialSphericalJ2000Coordinates(): Promise<EquatorialSphericalCoordinates> {
        const coords = await this.getGeocentricEclipticSphericalJ2000Coordinates();

        return eclipticSpherical2equatorialSpherical(coords, this.T);
    }

    public async getGeocentricEquatorialSphericalDateCoordinates(): Promise<EquatorialSphericalCoordinates> {
        const coords = await this.getGeocentricEclipticSphericalDateCoordinates();

        return eclipticSpherical2equatorialSpherical(coords, this.T);
    }

    public async getApparentGeocentricEclipticRectangularCoordinates(): Promise<RectangularCoordinates> {
        const coords = await this.getApparentGeocentricEclipticSphericalCoordinates();

        return spherical2rectangular(coords);
    }

    public abstract getApparentGeocentricEclipticSphericalCoordinates(): Promise<EclipticSphericalCoordinates>;

    public async getApparentGeocentricEquatorialSphericalCoordinates(): Promise<EquatorialSphericalCoordinates> {
        const coords = await this.getApparentGeocentricEclipticSphericalCoordinates();

        return eclipticSpherical2equatorialSpherical(coords, this.T);
    }

    public async getTopocentricEquatorialSphericalCoordinates(
        location: Location,
    ): Promise<EquatorialSphericalCoordinates> {
        const coords = await this.getApparentGeocentricEquatorialSphericalCoordinates();

        return equatorialSpherical2topocentricSpherical(
            coords,
            location,
            this.T,
        );
    }

    public async getTopocentricHorizontalCoordinates(location: Location): Promise<LocalHorizontalCoordinates> {
        const coords = await this.getApparentGeocentricEquatorialSphericalCoordinates();

        return equatorialSpherical2topocentricHorizontal(coords, location, this.T);
    }

    public async getApparentTopocentricHorizontalCoordinates(
        location: Location,
    ): Promise<LocalHorizontalCoordinates> {
        const {azimuth, altitude, radiusVector} = await this.getTopocentricHorizontalCoordinates(location);

        return {
            azimuth: azimuth,
            altitude: correctEffectOfRefraction(altitude),
            radiusVector: radiusVector,
        };
    }

    public async getDistanceToEarth(): Promise<number> {
        const coords = await this.getGeocentricEclipticSphericalDateCoordinates();

        return au2km(coords.radiusVector);
    }

    public async getApparentDistanceToEarth(): Promise<number> {
        const coords = await this.getApparentGeocentricEclipticSphericalCoordinates();

        return au2km(coords.radiusVector);
    }

    public async getTopocentricDistanceToEarth(location: Location): Promise<number> {
        const coords = await this.getTopocentricEquatorialSphericalCoordinates(location);

        return au2km(coords.radiusVector);
    }

    public async getLightTime(): Promise<number> {
        const {radiusVector} = await this.getGeocentricEclipticSphericalDateCoordinates();

        return au2km(radiusVector) / LIGHT_SPEED_KM_PER_SEC;
    }

    public async getConjunctionInRightAscensionTo(astronomicalObjectConstructor: any): Promise<Conjunction> {
        return await getConjunctionInRightAscension(this.constructor, astronomicalObjectConstructor, this.jd0);
    }

    public async getConjunctionInLongitudeTo(astronomicalObjectConstructor: any): Promise<Conjunction> {
        return await getConjunctionInLongitude(this.constructor, astronomicalObjectConstructor, this.jd0);
    }
}
