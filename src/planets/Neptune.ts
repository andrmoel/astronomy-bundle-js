import {getAsyncCachedCalculation} from '../cache/calculationCache';
import {EclipticSphericalCoordinates} from '../coordinates/types/CoordinateTypes';
import {normalizeAngle} from '../utils/angleCalc';
import {getApparentMagnitudeNeptune} from '../utils/magnitudeCalc';
import TimeOfInterest from '../time/TimeOfInterest';
import {calculateVSOP87, calculateVSOP87Angle} from './calculations/vsop87Calc';
import {DIAMETER_NEPTUNE} from './constants/diameters';
import Planet from './Planet';

export default class Neptune extends Planet {
    constructor(toi?: TimeOfInterest, useVsop87Short?: boolean) {
        super('neptune', toi, useVsop87Short);
    }

    public get diameter(): number {
        return DIAMETER_NEPTUNE;
    }

    public async getHeliocentricEclipticSphericalJ2000Coordinates(): Promise<EclipticSphericalCoordinates> {
        return await getAsyncCachedCalculation('neptune_heliocentric_spherical_j2000', this.t, async () => {
            const vsop87 = await import('./vsop87/vsop87NeptuneSphericalJ2000');

            return {
                lon: normalizeAngle(calculateVSOP87Angle(vsop87.VSOP87_X, this.t)),
                lat: calculateVSOP87Angle(vsop87.VSOP87_Y, this.t),
                radiusVector: calculateVSOP87(vsop87.VSOP87_Z, this.t),
            };
        });
    }

    public async getHeliocentricEclipticSphericalDateCoordinates(): Promise<EclipticSphericalCoordinates> {
        return await getAsyncCachedCalculation('neptune_heliocentric_spherical_date', this.t, async () => {
            const vsop87 = this.useVsop87Short
                ? await import('./vsop87/vsop87NeptuneSphericalDateShort')
                : await import('./vsop87/vsop87NeptuneSphericalDate');

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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        phaseAngle: number
    ): number {
        return getApparentMagnitudeNeptune(distanceSun, distanceEarth, this.toi.getDecimalYear());
    }
}
