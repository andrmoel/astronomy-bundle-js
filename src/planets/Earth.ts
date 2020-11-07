import {calculateVSOP87, calculateVSOP87Angle} from './calculations/vsop87Calc';
import {getAsyncCachedCalculation} from '../cache/calculationCache';
import AstronomicalObject from '../astronomicalObject/AstronomicalObject';
import IEclipticSphericalCoordinates from '../coordinates/interfaces/IEclipticSphericalCoordinates';
import {normalizeAngle} from '../utils/angleCalc';
import IRectangularCoordinates from "../coordinates/interfaces/IRectangularCoordinates";

export default class Earth extends AstronomicalObject {
    public async getHeliocentricRectangularJ2000Coordinates(): Promise<IRectangularCoordinates> {
        return await getAsyncCachedCalculation('earth_heliocentric_rectangular_j2000', this.t, async () => {
            const vsop87 = await import('./vspo87/vsop87EarthRectangularJ2000');

            return {
                x: calculateVSOP87(vsop87.VSOP87_X, this.t),
                y: calculateVSOP87(vsop87.VSOP87_Y, this.t),
                z: calculateVSOP87(vsop87.VSOP87_Z, this.t),
            }
        });
    }

    public async getHeliocentricRectangularDateCoordinates(): Promise<IRectangularCoordinates> {
        return await getAsyncCachedCalculation('earth_heliocentric_rectangular_date', this.t, async () => {
            const vsop87 = await import('./vspo87/vsop87EarthRectangularDate');

            return {
                x: calculateVSOP87(vsop87.VSOP87_X, this.t),
                y: calculateVSOP87(vsop87.VSOP87_Y, this.t),
                z: calculateVSOP87(vsop87.VSOP87_Z, this.t),
            }
        });
    }

    public async getHeliocentricEclipticSphericalJ2000Coordinates(): Promise<IEclipticSphericalCoordinates> {
        return await getAsyncCachedCalculation('earth_heliocentric_spherical_j2000', this.t, async () => {
            const vsop87 = await import('./vspo87/vsop87EarthSphericalJ2000');

            return {
                lon: normalizeAngle(calculateVSOP87Angle(vsop87.VSOP87_X, this.t)),
                lat: calculateVSOP87Angle(vsop87.VSOP87_Y, this.t),
                radiusVector: calculateVSOP87(vsop87.VSOP87_Z, this.t),
            }
        });
    }

    public async getHeliocentricEclipticSphericalDateCoordinates(): Promise<IEclipticSphericalCoordinates> {
        return await getAsyncCachedCalculation('earth_heliocentric_spherical_date', this.t, async () => {
            const vsop87 = await import('./vspo87/vsop87EarthSphericalDate');

            return {
                lon: normalizeAngle(calculateVSOP87Angle(vsop87.VSOP87_X, this.t)),
                lat: calculateVSOP87Angle(vsop87.VSOP87_Y, this.t),
                radiusVector: calculateVSOP87(vsop87.VSOP87_Z, this.t),
            }
        });
    }
}
