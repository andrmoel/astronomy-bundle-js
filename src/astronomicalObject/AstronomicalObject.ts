import IAstronomicalObject from './interfaces/IAstronomicalObject';
import { LIGHT_SPEED_KM_PER_SEC } from '../constants/lightSpeed';
import {
    EclipticSphericalCoordinates,
    EquatorialSphericalCoordinates,
    LocalHorizontalCoordinates,
    RectangularCoordinates
    } from '../coordinates/coordinateTypes';
import { Location } from '../earth/LocationTypes';
import { Conjunction } from '../planets/planetTypes';
import { createTimeOfInterest } from '../time';
import TimeOfInterest from '../time/TimeOfInterest';
import { correctEffectOfRefraction } from '../utils/apparentCoordinateCalc';
import { getConjunctionInLongitude, getConjunctionInRightAscension } from '../utils/conjunctionCalc';
import {
    eclipticSpherical2equatorialSpherical,
    equatorialSpherical2topocentricHorizontal,
    equatorialSpherical2topocentricSpherical,
    spherical2rectangular
    } from '../utils/coordinateCalc';
import { au2km } from '../utils/distanceCalc';

export default abstract class AstronomicalObject implements IAstronomicalObject {

    protected readonly jd: number;
    protected readonly jd0: number;
    protected readonly T: number;
    protected readonly t: number;

    public constructor(
        private readonly _name: string,
        public readonly toi: TimeOfInterest = createTimeOfInterest.fromCurrentTime()
    ) {
        this.jd = toi.getJulianDay();
        this.jd0 = toi.getJulianDay0();
        this.T = toi.getJulianCenturiesJ2000();
        this.t = toi.getJulianMillenniaJ2000();
    }

    public get name(): string {
        return this._name;
    }

    abstract getHeliocentricEclipticRectangularJ2000Coordinates(): Promise<RectangularCoordinates>;

    abstract getHeliocentricEclipticRectangularDateCoordinates(): Promise<RectangularCoordinates>;

    abstract getHeliocentricEclipticSphericalJ2000Coordinates(): Promise<EclipticSphericalCoordinates>;

    abstract getHeliocentricEclipticSphericalDateCoordinates(): Promise<EclipticSphericalCoordinates>;

    abstract getGeocentricEclipticRectangularJ2000Coordinates(): Promise<RectangularCoordinates>;

    abstract getGeocentricEclipticRectangularDateCoordinates(): Promise<RectangularCoordinates>;

    abstract getGeocentricEclipticSphericalJ2000Coordinates(): Promise<EclipticSphericalCoordinates>;

    abstract getGeocentricEclipticSphericalDateCoordinates(): Promise<EclipticSphericalCoordinates>;

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

    abstract getApparentGeocentricEclipticSphericalCoordinates(): Promise<EclipticSphericalCoordinates>;

    public async getApparentGeocentricEquatorialSphericalCoordinates(): Promise<EquatorialSphericalCoordinates> {
        const coords = await this.getApparentGeocentricEclipticSphericalCoordinates();

        return eclipticSpherical2equatorialSpherical(coords, this.T);
    }

    public async getTopocentricEquatorialSphericalCoordinates(
        location: Location
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
        location: Location
    ): Promise<LocalHorizontalCoordinates> {
        const { azimuth, altitude, radiusVector } = await this.getTopocentricHorizontalCoordinates(location);

        return {
            azimuth: azimuth,
            altitude: correctEffectOfRefraction(altitude),
            radiusVector: radiusVector,
        }
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
        const { radiusVector } = await this.getGeocentricEclipticSphericalDateCoordinates();

        return au2km(radiusVector) / LIGHT_SPEED_KM_PER_SEC;
    }

    public async getConjunctionInRightAscensionTo(astronomicalObjectConstructor: any): Promise<Conjunction> {
        return await getConjunctionInRightAscension(this.constructor, astronomicalObjectConstructor, this.jd0);
    }

    public async getConjunctionInLongitudeTo(astronomicalObjectConstructor: any): Promise<Conjunction> {
        return await getConjunctionInLongitude(this.constructor, astronomicalObjectConstructor, this.jd0);
    }
}
