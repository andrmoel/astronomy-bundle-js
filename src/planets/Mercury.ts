import {calculateVSOP87, calculateVSOP87Angle} from '../utils/vsop87Calc';
import {getAsyncCachedCalculation} from '../cache/calculationCache';
import {DIAMETER_MERCURY} from '../constants/diameters';
import {EclipticSphericalCoordinates} from '../coordinates/types/CoordinateTypes';
import {normalizeAngle} from '../utils/angleCalc';
import {getApparentMagnitudeMercury} from '../utils/magnitudeCalc';
import TimeOfInterest from '../time/TimeOfInterest';
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

    public async getApparentMagnitude(): Promise<number> {
        const coordsHelio = await this.getHeliocentricEclipticSphericalDateCoordinates();
        const coordsGeo = await this.getGeocentricEclipticSphericalDateCoordinates();
        const i = await this.getPhaseAngle();

        return getApparentMagnitudeMercury(coordsHelio.radiusVector, coordsGeo.radiusVector, i);
    }
}
