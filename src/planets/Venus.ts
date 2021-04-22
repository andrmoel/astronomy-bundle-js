import {getAsyncCachedCalculation} from '../cache/calculationCache';
import {calculateVSOP87, calculateVSOP87Angle} from '../utils/vsop87Calc';
import {normalizeAngle} from '../utils/angleCalc';
import {EclipticSphericalCoordinates} from '../coordinates/types/CoordinateTypes';
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
        let v = 5 * Math.log10(distanceSun * distanceEarth);

        if (phaseAngle <= 163.7) {
            v += -4.384
                - 1.044E-3 * phaseAngle
                + 3.687E-4 * Math.pow(phaseAngle, 2)
                - 2.814E-6 * Math.pow(phaseAngle, 3)
                + 8.938E-9 * Math.pow(phaseAngle, 4);
        } else {
            v += 236.05828
                - 2.81914 * phaseAngle
                + 8.39034E-3 * Math.pow(phaseAngle, 2);
        }

        return v;
    }
}
