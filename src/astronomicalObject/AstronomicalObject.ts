import TimeOfInterest from '../time/TimeOfInterest';
import IAstronomicalObject from './interfaces/IAstronomicalObject';
import {createTimeOfInterest} from '../time';
import IEquatorialSphericalCoordinates from '../coordinates/interfaces/IEquatorialSphericalCoordinates';
import {getConjunctionInRightAscension} from '../utils/conjunctionCalc';
import IRectangularCoordinates from '../coordinates/interfaces/IRectangularCoordinates';
import IEclipticSphericalCoordinates from '../coordinates/interfaces/IEclipticSphericalCoordinates';
import {eclipticSpherical2equatorialSpherical} from '../utils/coordinateCalc';
import {au2km} from '../utils/distanceCalc';

export default abstract class AstronomicalObject implements IAstronomicalObject {
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

    abstract getGeocentricEclipticRectangularJ2000Coordinates(): Promise<IRectangularCoordinates>;

    abstract getGeocentricEclipticRectangularDateCoordinates(): Promise<IRectangularCoordinates>;

    abstract getGeocentricEclipticSphericalJ2000Coordinates(): Promise<IEclipticSphericalCoordinates>;

    abstract getGeocentricEclipticSphericalDateCoordinates(): Promise<IEclipticSphericalCoordinates>;

    public async getGeocentricEquatorialSphericalJ2000Coordinates(): Promise<IEquatorialSphericalCoordinates> {
        const {lon, lat, radiusVector} = await this.getGeocentricEclipticSphericalJ2000Coordinates();

        return eclipticSpherical2equatorialSpherical(lon, lat, radiusVector, this.T);
    }

    public async getGeocentricEquatorialSphericalDateCoordinates(): Promise<IEquatorialSphericalCoordinates> {
        const {lon, lat, radiusVector} = await this.getGeocentricEclipticSphericalDateCoordinates();

        return eclipticSpherical2equatorialSpherical(lon, lat, radiusVector, this.T);
    }

    abstract async getApparentGeocentricEclipticSphericalCoordinates(): Promise<IEclipticSphericalCoordinates>;

    public async getApparentGeocentricEquatorialSphericalCoordinates(): Promise<IEquatorialSphericalCoordinates> {
        const {lon, lat, radiusVector} = await this.getApparentGeocentricEclipticSphericalCoordinates();

        return eclipticSpherical2equatorialSpherical(lon, lat, radiusVector, this.T);
    }

    public async getLightTime(): Promise<number> {
        const {radiusVector} = await this.getGeocentricEclipticSphericalDateCoordinates();

        return au2km(radiusVector) / 299792.458;
    }

    public async getConjunctionInRightAscensionTo(astronomicalObjectConstructor: any): Promise<TimeOfInterest> {
        const jd = await getConjunctionInRightAscension(this.constructor, astronomicalObjectConstructor, this.jd0);

        return createTimeOfInterest.fromJulianDay(jd);
    }
}
