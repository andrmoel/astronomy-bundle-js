import Planet from './Planet';
import { getAsyncCachedCalculation } from '../cache/calculationCache';
import { DIAMETER_URANUS } from '../constants/diameters';
import { EclipticSphericalCoordinates } from '../coordinates/coordinateTypes';
import TimeOfInterest from '../time/TimeOfInterest';
import { observationCalc } from '../utils';
import { normalizeAngle } from '../utils/angleCalc';
import { getApparentMagnitudeUranus } from '../utils/magnitudeCalc';
import { calculateVSOP87, calculateVSOP87Angle } from '../utils/vsop87Calc';

export default class Uranus extends Planet {


    constructor(toi?: TimeOfInterest) {
        super('uranus', toi);
    }

    public async getHeliocentricEclipticSphericalJ2000Coordinates(): Promise<EclipticSphericalCoordinates> {
        return await getAsyncCachedCalculation('uranus_heliocentric_spherical_j2000', this.t, async () => {
            const vsop87 = await import('./vsop87/vsop87UranusSphericalJ2000');

            return {
                lon: normalizeAngle(calculateVSOP87Angle(vsop87.VSOP87_X, this.t)),
                lat: calculateVSOP87Angle(vsop87.VSOP87_Y, this.t),
                radiusVector: calculateVSOP87(vsop87.VSOP87_Z, this.t),
            }
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
            }
        });
    }

    public async getAngularDiameter(): Promise<number> {
        const distance = await this.getApparentDistanceToEarth();

        return observationCalc.getAngularDiameter(distance, DIAMETER_URANUS);
    }

    public async getApparentMagnitude(): Promise<number> {
        const coordsHelio = await this.getHeliocentricEclipticSphericalDateCoordinates();
        const coordsGeo = await this.getGeocentricEclipticSphericalDateCoordinates();
        const i = await this.getPhaseAngle();

        return getApparentMagnitudeUranus(coordsHelio.radiusVector, coordsGeo.radiusVector, i);
    }
}
