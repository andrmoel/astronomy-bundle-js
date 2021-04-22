import {calculateVSOP87, calculateVSOP87Angle} from '../utils/vsop87Calc';
import {getAsyncCachedCalculation} from '../cache/calculationCache';
import {EclipticSphericalCoordinates} from '../coordinates/types/CoordinateTypes';
import {normalizeAngle} from '../utils/angleCalc';
import {getApparentMagnitudeJupiter} from '../utils/magnitudeCalc';
import TimeOfInterest from '../time/TimeOfInterest';
import {DIAMETER_JUPITER} from './constants/diameters';
import Planet from './Planet';

export default class Jupiter extends Planet {
    constructor(toi?: TimeOfInterest, useVsop87Short?: boolean) {
        super('jupiter', toi, useVsop87Short);
    }

    public get diameter(): number {
        return DIAMETER_JUPITER;
    }

    public async getHeliocentricEclipticSphericalJ2000Coordinates(): Promise<EclipticSphericalCoordinates> {
        return await getAsyncCachedCalculation('jupiter_heliocentric_spherical_j2000', this.t, async () => {
            const vsop87 = await import('./vsop87/vsop87JupiterSphericalJ2000');

            return {
                lon: normalizeAngle(calculateVSOP87Angle(vsop87.VSOP87_X, this.t)),
                lat: calculateVSOP87Angle(vsop87.VSOP87_Y, this.t),
                radiusVector: calculateVSOP87(vsop87.VSOP87_Z, this.t),
            };
        });
    }

    public async getHeliocentricEclipticSphericalDateCoordinates(): Promise<EclipticSphericalCoordinates> {
        return await getAsyncCachedCalculation('jupiter_heliocentric_spherical_date', this.t, async () => {
            const vsop87 = this.useVsop87Short
                ? await import('./vsop87/vsop87JupiterSphericalDateShort')
                : await import('./vsop87/vsop87JupiterSphericalDate');

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

        return getApparentMagnitudeJupiter(coordsHelio.radiusVector, coordsGeo.radiusVector, i);
    }
}
