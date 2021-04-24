import {getAsyncCachedCalculation} from '../cache/calculationCache';
import {calculateVSOP87, calculateVSOP87Angle} from '../utils/vsop87Calc';
import {normalizeAngle} from '../utils/angleCalc';
import {EclipticSphericalCoordinates} from '../coordinates/types/CoordinateTypes';
import {getApparentMagnitudeVenus} from '../utils/magnitudeCalc';
import TimeOfInterest from '../time/TimeOfInterest';
import {DIAMETER_VENUS} from './constants/diameters';
import Planet from './Planet';

export default class Venus extends Planet {
    constructor(toi?: TimeOfInterest, useVsop87Short?: boolean) {
        super('venus', toi, useVsop87Short);
    }

    public get diameter(): number {
        return DIAMETER_VENUS;
    }

    public async getHeliocentricEclipticSphericalJ2000Coordinates(): Promise<EclipticSphericalCoordinates> {
        return await getAsyncCachedCalculation('venus_heliocentric_spherical_j2000', this.t, async () => {
            const vsop87 = await import('./vsop87/vsop87VenusSphericalJ2000');

            return {
                lon: normalizeAngle(calculateVSOP87Angle(vsop87.VSOP87_X, this.t)),
                lat: calculateVSOP87Angle(vsop87.VSOP87_Y, this.t),
                radiusVector: calculateVSOP87(vsop87.VSOP87_Z, this.t),
            };
        });
    }

    public async getHeliocentricEclipticSphericalDateCoordinates(): Promise<EclipticSphericalCoordinates> {
        return await getAsyncCachedCalculation('venus_heliocentric_spherical_date', this.t, async () => {
            const vsop87 = this.useVsop87Short
                ? await import('./vsop87/vsop87VenusSphericalDateShort')
                : await import('./vsop87/vsop87VenusSphericalDate');

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
        return getApparentMagnitudeVenus(distanceSun, distanceEarth, phaseAngle);
    }
}
