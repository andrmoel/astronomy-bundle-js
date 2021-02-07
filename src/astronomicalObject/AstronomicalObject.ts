import TimeOfInterest from '../time/TimeOfInterest';
import IAstronomicalObject from './interfaces/IAstronomicalObject';
import {createTimeOfInterest} from '../time';
import {
    EclipticSphericalCoordinates,
    EquatorialSphericalCoordinates,
    LocalHorizontalCoordinates,
    RectangularCoordinates
} from '../coordinates/coordinateTypes';
import {getConjunctionInLongitude, getConjunctionInRightAscension} from '../utils/conjunctionCalc';
import {
    eclipticSpherical2equatorialSpherical,
    equatorialSpherical2topocentricHorizontal,
    equatorialSpherical2topocentricSpherical,
    spherical2rectangular
} from '../utils/coordinateCalc';
import {au2km} from '../utils/distanceCalc';
import {LIGHT_SPEED_KM_PER_SEC} from '../constants/lightSpeed';
import ILocation from '../earth/interfaces/ILocation';
import {correctEffectOfRefraction} from '../utils/apparentCoordinateCalc';
import IConjunction from '../planets/interfaces/IConjunction';

export default abstract class AstronomicalObject implements IAstronomicalObject {
    protected name = 'astronomical object';

    protected jd: number = 0.0;
    protected jd0: number = 0.0;
    protected T: number = 0.0;
    protected t: number = 0.0;

    public constructor(public toi: TimeOfInterest = createTimeOfInterest.fromCurrentTime()) {
        this.jd = toi.getJulianDay();
        this.jd0 = toi.getJulianDay0();
        this.T = toi.getJulianCenturiesJ2000();
        this.t = toi.getJulianMillenniaJ2000();
    }

    public getName() {
        return this.name;
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
        const {lon, lat, radiusVector} = await this.getGeocentricEclipticSphericalJ2000Coordinates();

        return eclipticSpherical2equatorialSpherical(lon, lat, radiusVector, this.T);
    }

    public async getGeocentricEquatorialSphericalDateCoordinates(): Promise<EquatorialSphericalCoordinates> {
        const {lon, lat, radiusVector} = await this.getGeocentricEclipticSphericalDateCoordinates();

        return eclipticSpherical2equatorialSpherical(lon, lat, radiusVector, this.T);
    }

    public async getApparentGeocentricEclipticRectangularCoordinates(): Promise<RectangularCoordinates> {
        const {lon, lat, radiusVector} = await this.getApparentGeocentricEclipticSphericalCoordinates();

        return spherical2rectangular(lon, lat, radiusVector);
    }

    abstract getApparentGeocentricEclipticSphericalCoordinates(): Promise<EclipticSphericalCoordinates>;

    public async getApparentGeocentricEquatorialSphericalCoordinates(): Promise<EquatorialSphericalCoordinates> {
        const {lon, lat, radiusVector} = await this.getApparentGeocentricEclipticSphericalCoordinates();

        return eclipticSpherical2equatorialSpherical(lon, lat, radiusVector, this.T);
    }

    public async getTopocentricEquatorialSphericalCoordinates(
        location: ILocation
    ): Promise<EquatorialSphericalCoordinates> {
        const {rightAscension, declination, radiusVector}
            = await this.getApparentGeocentricEquatorialSphericalCoordinates();
        const {lat, lon, elevation} = location;

        return equatorialSpherical2topocentricSpherical(
            this.T,
            rightAscension,
            declination,
            radiusVector,
            lat,
            lon,
            elevation,
        );
    }

    public async getTopocentricHorizontalCoordinates(location: ILocation): Promise<LocalHorizontalCoordinates> {
        const {rightAscension, declination, radiusVector}
            = await this.getApparentGeocentricEquatorialSphericalCoordinates();
        const {lat, lon, elevation} = location;

        return equatorialSpherical2topocentricHorizontal(
            this.T,
            rightAscension,
            declination,
            radiusVector,
            lat,
            lon,
            elevation,
        );
    }

    public async getApparentTopocentricHorizontalCoordinates(
        location: ILocation
    ): Promise<LocalHorizontalCoordinates> {
        const {azimuth, altitude, radiusVector} = await this.getTopocentricHorizontalCoordinates(location);

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

    public async getTopocentricDistanceToEarth(location: ILocation): Promise<number> {
        const coords = await this.getTopocentricEquatorialSphericalCoordinates(location);

        return au2km(coords.radiusVector);
    }

    public async getLightTime(): Promise<number> {
        const {radiusVector} = await this.getGeocentricEclipticSphericalDateCoordinates();

        return au2km(radiusVector) / LIGHT_SPEED_KM_PER_SEC;
    }

    public async getConjunctionInRightAscensionTo(astronomicalObjectConstructor: any): Promise<IConjunction> {
        return await getConjunctionInRightAscension(this.constructor, astronomicalObjectConstructor, this.jd0);
    }

    public async getConjunctionInLongitudeTo(astronomicalObjectConstructor: any): Promise<IConjunction> {
        return await getConjunctionInLongitude(this.constructor, astronomicalObjectConstructor, this.jd0);
    }
}
