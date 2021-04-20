import {getAsyncCachedCalculation} from '../cache/calculationCache';
import {calculateVSOP87, calculateVSOP87Angle} from '../utils/vsop87Calc';
import {observationCalc} from '../utils';
import {DIAMETER_SATURN} from '../constants/diameters';
import {EclipticSphericalCoordinates} from '../coordinates/types/CoordinateTypes';
import {normalizeAngle} from '../utils/angleCalc';
import {getApparentMagnitudeSaturn} from '../utils/magnitudeCalc';
import Planet from './Planet';

export default class Saturn extends Planet {
    protected name = 'saturn';

    public async getHeliocentricEclipticSphericalJ2000Coordinates(): Promise<EclipticSphericalCoordinates> {
        return await getAsyncCachedCalculation('saturn_heliocentric_spherical_j2000', this.t, async () => {
            const vsop87 = await import('./vsop87/vsop87SaturnSphericalJ2000');

            return {
                lon: normalizeAngle(calculateVSOP87Angle(vsop87.VSOP87_X, this.t)),
                lat: calculateVSOP87Angle(vsop87.VSOP87_Y, this.t),
                radiusVector: calculateVSOP87(vsop87.VSOP87_Z, this.t),
            };
        });
    }

    public async getHeliocentricEclipticSphericalDateCoordinates(): Promise<EclipticSphericalCoordinates> {
        return await getAsyncCachedCalculation('saturn_heliocentric_spherical_date', this.t, async () => {
            const vsop87 = this.useVsop87Short
                ? await import('./vsop87/vsop87SaturnSphericalDateShort')
                : await import('./vsop87/vsop87SaturnSphericalDate');

            return {
                lon: normalizeAngle(calculateVSOP87Angle(vsop87.VSOP87_X, this.t)),
                lat: calculateVSOP87Angle(vsop87.VSOP87_Y, this.t),
                radiusVector: calculateVSOP87(vsop87.VSOP87_Z, this.t),
            };
        });
    }

    public async getAngularDiameter(): Promise<number> {
        const distance = await this.getApparentDistanceToEarth();

        return observationCalc.getAngularDiameter(distance, DIAMETER_SATURN);
    }

    public async getApparentMagnitude(): Promise<number> {
        const coordsHelio = await this.getHeliocentricEclipticSphericalDateCoordinates();
        const coordsGeo = await this.getGeocentricEclipticSphericalDateCoordinates();
        const i = await this.getPhaseAngle();

        return getApparentMagnitudeSaturn(coordsHelio.radiusVector, coordsGeo.radiusVector, i);
    }
}
