import {getAsyncCachedCalculation} from '../cache/calculationCache';
import {EclipticSphericalCoordinates} from '../coordinates/types/CoordinateTypes';
import {normalizeAngle} from '../utils/angleCalc';
import TimeOfInterest from '../time/TimeOfInterest';
import {getApparentMagnitudeMars} from './calculations/magnitudeCalc';
import {calculateVSOP87, calculateVSOP87Angle} from './calculations/vsop87Calc';
import {DIAMETER_MARS} from './constants/diameters';
import Planet from './Planet';

export default class Mars extends Planet {
    constructor(toi?: TimeOfInterest, useVsop87Short?: boolean) {
        super('mars', toi, useVsop87Short);
    }

    public get diameter(): number {
        return DIAMETER_MARS;
    }

    public async getHeliocentricEclipticSphericalJ2000Coordinates(): Promise<EclipticSphericalCoordinates> {
        return await getAsyncCachedCalculation('mars_heliocentric_spherical_j2000', this.t, async () => {
            const vsop87 = await import('./vsop87/vsop87MarsSphericalJ2000');

            return {
                lon: normalizeAngle(calculateVSOP87Angle(vsop87.VSOP87_X, this.t)),
                lat: calculateVSOP87Angle(vsop87.VSOP87_Y, this.t),
                radiusVector: calculateVSOP87(vsop87.VSOP87_Z, this.t),
            };
        });
    }

    public async getHeliocentricEclipticSphericalDateCoordinates(): Promise<EclipticSphericalCoordinates> {
        return await getAsyncCachedCalculation('mars_heliocentric_spherical_date', this.t, async () => {
            const vsop87 = this.useVsop87Short
                ? await import('./vsop87/vsop87MarsSphericalDateShort')
                : await import('./vsop87/vsop87MarsSphericalDate');

            return {
                lon: normalizeAngle(calculateVSOP87Angle(vsop87.VSOP87_X, this.t)),
                lat: calculateVSOP87Angle(vsop87.VSOP87_Y, this.t),
                radiusVector: calculateVSOP87(vsop87.VSOP87_Z, this.t),
            };
        });
    }

    protected calculateApparentMagnitude(
        distanceSun: number,
        distanceEarth: number,
        phaseAngle: number
    ): number {
        return getApparentMagnitudeMars(distanceSun, distanceEarth, phaseAngle);
    }
}
