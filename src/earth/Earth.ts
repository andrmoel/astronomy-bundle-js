import AstronomicalObject from '../astronomicalObject/AstronomicalObject';
import {earthCalc} from '../utils';
import IRectangularCoordinates from '../coordinates/interfaces/IRectangularCoordinates';
import {getAsyncCachedCalculation} from '../cache/calculationCache';
import {calculateVSOP87, calculateVSOP87Angle} from '../utils/vsop87Calc';
import IEclipticSphericalCoordinates from '../coordinates/interfaces/IEclipticSphericalCoordinates';
import {normalizeAngle} from '../utils/angleCalc';
import {spherical2rectangular} from '../utils/coordinateCalc';

export default class Earth extends AstronomicalObject {
    public async getHeliocentricEclipticRectangularJ2000Coordinates(): Promise<IRectangularCoordinates> {
        const {lon, lat, radiusVector} = await this.getHeliocentricEclipticSphericalJ2000Coordinates();

        return spherical2rectangular(lon, lat, radiusVector);
    }

    public async getHeliocentricEclipticRectangularDateCoordinates(): Promise<IRectangularCoordinates> {
        const {lon, lat, radiusVector} = await this.getHeliocentricEclipticSphericalDateCoordinates();

        return spherical2rectangular(lon, lat, radiusVector);
    }

    public async getHeliocentricEclipticSphericalJ2000Coordinates(): Promise<IEclipticSphericalCoordinates> {
        return await getAsyncCachedCalculation('earth_heliocentric_spherical_j2000', this.t, async () => {
            const vsop87 = await import('./vsop87/vsop87EarthSphericalJ2000');

            return {
                lon: normalizeAngle(calculateVSOP87Angle(vsop87.VSOP87_X, this.t)),
                lat: calculateVSOP87Angle(vsop87.VSOP87_Y, this.t),
                radiusVector: calculateVSOP87(vsop87.VSOP87_Z, this.t),
            }
        });
    }

    public async getHeliocentricEclipticSphericalDateCoordinates(): Promise<IEclipticSphericalCoordinates> {
        return await getAsyncCachedCalculation('earth_heliocentric_spherical_date', this.t, async () => {
            const vsop87 = await import('./vsop87/vsop87EarthSphericalDate');

            return {
                lon: normalizeAngle(calculateVSOP87Angle(vsop87.VSOP87_X, this.t)),
                lat: calculateVSOP87Angle(vsop87.VSOP87_Y, this.t),
                radiusVector: calculateVSOP87(vsop87.VSOP87_Z, this.t),
            }
        });
    }

    getGeocentricEclipticRectangularJ2000Coordinates(): Promise<IRectangularCoordinates> {
        return Promise.reject({x: 0, y: 0, z: 0});
    }

    getGeocentricEclipticRectangularDateCoordinates(): Promise<IRectangularCoordinates> {
        return Promise.reject({x: 0, y: 0, z: 0});
    }

    getGeocentricEclipticSphericalJ2000Coordinates(): Promise<IEclipticSphericalCoordinates> {
        return Promise.reject({lon: 0, lat: 0, radiusVector: 0});
    }

    getGeocentricEclipticSphericalDateCoordinates(): Promise<IEclipticSphericalCoordinates> {
        return Promise.reject({lon: 0, lat: 0, radiusVector: 0});
    }

    async getApparentGeocentricEclipticSphericalCoordinates(): Promise<IEclipticSphericalCoordinates> {
        return Promise.reject({lon: 0, lat: 0, radiusVector: 0});
    }

    public getNutationInLongitude() {
        return earthCalc.getNutationInLongitude(this.T);
    }

    public getNutationInObliquity() {
        return earthCalc.getNutationInObliquity(this.T);
    }

    public getMeanObliquityOfEcliptic() {
        return earthCalc.getMeanObliquityOfEcliptic(this.T);
    }

    public getTrueObliquityOfEcliptic() {
        return earthCalc.getTrueObliquityOfEcliptic(this.T);
    }
}
