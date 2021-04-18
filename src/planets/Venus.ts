import Planet from './Planet';
import { getAsyncCachedCalculation } from '../cache/calculationCache';
import { DIAMETER_VENUS } from '../constants/diameters';
import { EclipticSphericalCoordinates } from '../coordinates/coordinateTypes';
import TimeOfInterest from '../time/TimeOfInterest';
import { observationCalc } from '../utils';
import { normalizeAngle } from '../utils/angleCalc';
import { getApparentMagnitudeVenus } from '../utils/magnitudeCalc';
import { calculateVSOP87, calculateVSOP87Angle } from '../utils/vsop87Calc';

export default class Venus extends Planet {


    constructor(toi?: TimeOfInterest) {
        super('venus', toi);
    }

    public async getHeliocentricEclipticSphericalJ2000Coordinates(): Promise<EclipticSphericalCoordinates> {
        return await getAsyncCachedCalculation('venus_heliocentric_spherical_j2000', this.t, async () => {
            const vsop87 = await import('./vsop87/vsop87VenusSphericalJ2000');

            return {
                lon: normalizeAngle(calculateVSOP87Angle(vsop87.VSOP87_X, this.t)),
                lat: calculateVSOP87Angle(vsop87.VSOP87_Y, this.t),
                radiusVector: calculateVSOP87(vsop87.VSOP87_Z, this.t),
            }
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
            }
        });
    }

    public async getAngularDiameter(): Promise<number> {
        const distance = await this.getApparentDistanceToEarth();

        return observationCalc.getAngularDiameter(distance, DIAMETER_VENUS);
    }

    public async getApparentMagnitude(): Promise<number> {
        const coordsHelio = await this.getHeliocentricEclipticSphericalDateCoordinates();
        const coordsGeo = await this.getGeocentricEclipticSphericalDateCoordinates();
        const i = await this.getPhaseAngle();

        return getApparentMagnitudeVenus(coordsHelio.radiusVector, coordsGeo.radiusVector, i);
    }
}
