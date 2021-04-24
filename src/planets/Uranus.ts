import {getAsyncCachedCalculation} from '../cache/calculationCache';
import {EclipticSphericalCoordinates} from '../coordinates/types/CoordinateTypes';
import {normalizeAngle} from '../utils/angleCalc';
import TimeOfInterest from '../time/TimeOfInterest';
import {getApparentMagnitudeUranus} from './calculations/magnitudeCalc';
import {calculateVSOP87, calculateVSOP87Angle} from './calculations/vsop87Calc';
import {DIAMETER_URANUS} from './constants/diameters';
import Planet from './Planet';

export default class Uranus extends Planet {
    constructor(toi?: TimeOfInterest, useVsop87Short?: boolean) {
        super('uranus', toi, useVsop87Short);
    }

    public get diameter(): number {
        return DIAMETER_URANUS;
    }

    public async getHeliocentricEclipticSphericalJ2000Coordinates(): Promise<EclipticSphericalCoordinates> {
        return await getAsyncCachedCalculation('uranus_heliocentric_spherical_j2000', this.t, async () => {
            const vsop87 = await import('./vsop87/vsop87UranusSphericalJ2000');

            return {
                lon: normalizeAngle(calculateVSOP87Angle(vsop87.VSOP87_X, this.t)),
                lat: calculateVSOP87Angle(vsop87.VSOP87_Y, this.t),
                radiusVector: calculateVSOP87(vsop87.VSOP87_Z, this.t),
            };
        });
    }

    public async getHeliocentricEclipticSphericalDateCoordinates(): Promise<EclipticSphericalCoordinates> {
        return await getAsyncCachedCalculation('uranus_heliocentric_spherical_date', this.t, async () => {
            const vsop87 = this.useVsop87Short
                ? await import('./vsop87/vsop87UranusSphericalDateShort')
                : await import('./vsop87/vsop87UranusSphericalDate');

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
        return getApparentMagnitudeUranus(distanceSun, distanceEarth, phaseAngle);
    }
}
