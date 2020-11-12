import AstronomicalObject from '../astronomicalObject/AstronomicalObject';
import {earthCalc} from '../utils';
import IRectangularCoordinates from '../coordinates/interfaces/IRectangularCoordinates';
import {getAsyncCachedCalculation} from '../cache/calculationCache';
import {calculateVSOP87, calculateVSOP87Angle} from '../utils/vsop87Calc';
import IEclipticSphericalCoordinates from '../coordinates/interfaces/IEclipticSphericalCoordinates';
import {normalizeAngle} from '../utils/angleCalc';
import IEquatorialSphericalCoordinates from '../coordinates/interfaces/IEquatorialSphericalCoordinates';

export default class Earth extends AstronomicalObject {
    public async getHeliocentricRectangularJ2000Coordinates(): Promise<IRectangularCoordinates> {
        return await getAsyncCachedCalculation('earth_heliocentric_rectangular_j2000', this.t, async () => {
            const vsop87 = await import('./vsop87/vsop87EarthRectangularJ2000');

            return {
                x: calculateVSOP87(vsop87.VSOP87_X, this.t),
                y: calculateVSOP87(vsop87.VSOP87_Y, this.t),
                z: calculateVSOP87(vsop87.VSOP87_Z, this.t),
            }
        });
    }

    public async getHeliocentricRectangularDateCoordinates(): Promise<IRectangularCoordinates> {
        return await getAsyncCachedCalculation('earth_heliocentric_rectangular_date', this.t, async () => {
            const vsop87 = await import('./vsop87/vsop87EarthRectangularDate');

            return {
                x: calculateVSOP87(vsop87.VSOP87_X, this.t),
                y: calculateVSOP87(vsop87.VSOP87_Y, this.t),
                z: calculateVSOP87(vsop87.VSOP87_Z, this.t),
            }
        });
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

    async getApparentGeocentricEquatorialSphericalCoordinates(): Promise<IEquatorialSphericalCoordinates> {
        return Promise.reject('Cannot obtain geocentric coordinates from Earth');
    }
}
