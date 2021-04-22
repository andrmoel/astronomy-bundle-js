import {calculateVSOP87, calculateVSOP87Angle} from '../utils/vsop87Calc';
import {getAsyncCachedCalculation} from '../cache/calculationCache';
import {EclipticSphericalCoordinates} from '../coordinates/types/CoordinateTypes';
import {normalizeAngle} from '../utils/angleCalc';
import TimeOfInterest from '../time/TimeOfInterest';
import {DIAMETER_MERCURY} from './constants/diameters';
import Planet from './Planet';

export default class Mercury extends Planet {
    constructor(toi?: TimeOfInterest, useVsop87Short?: boolean) {
        super('mercury', toi, useVsop87Short);
    }

    public get diameter(): number {
        return DIAMETER_MERCURY;
    }

    public async getHeliocentricEclipticSphericalJ2000Coordinates(): Promise<EclipticSphericalCoordinates> {
        return await getAsyncCachedCalculation('mercury_heliocentric_spherical_j2000', this.t, async () => {
            const vsop87 = await import('./vsop87/vsop87MercurySphericalJ2000');

            return {
                lon: normalizeAngle(calculateVSOP87Angle(vsop87.VSOP87_X, this.t)),
                lat: calculateVSOP87Angle(vsop87.VSOP87_Y, this.t),
                radiusVector: calculateVSOP87(vsop87.VSOP87_Z, this.t),
            };
        });
    }

    public async getHeliocentricEclipticSphericalDateCoordinates(): Promise<EclipticSphericalCoordinates> {
        return await getAsyncCachedCalculation('mercury_heliocentric_spherical_date', this.t, async () => {
            const vsop87 = this.useVsop87Short
                ? await import('./vsop87/vsop87MercurySphericalDateShort')
                : await import('./vsop87/vsop87MercurySphericalDate');

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
        let v = 5 * Math.log10(distanceSun * distanceEarth);

        v += -0.613
            + 6.3280E-2 * phaseAngle
            - 1.6336E-3 * Math.pow(phaseAngle, 2)
            + 3.3644E-5 * Math.pow(phaseAngle, 3)
            - 3.4265E-7 * Math.pow(phaseAngle, 4)
            + 1.6893E-9 * Math.pow(phaseAngle, 5)
            - 3.0334E-12 * Math.pow(phaseAngle, 6);

        return v;
    }
}
