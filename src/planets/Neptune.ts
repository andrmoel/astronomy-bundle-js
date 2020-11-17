import Planet from './Planet';
import {calculateVSOP87, calculateVSOP87Angle} from '../utils/vsop87Calc';
import {getAsyncCachedCalculation} from '../cache/calculationCache';
import {observationCalc} from '../utils';
import {DIAMETER_NEPTUNE} from '../constants/diameters';
import IEclipticSphericalCoordinates from '../coordinates/interfaces/IEclipticSphericalCoordinates';
import {normalizeAngle} from '../utils/angleCalc';
import {getApparentMagnitudeNeptune} from '../utils/magnitudeCalc';

export default class Neptune extends Planet {
    public async getHeliocentricEclipticSphericalJ2000Coordinates(): Promise<IEclipticSphericalCoordinates> {
        return await getAsyncCachedCalculation('neptune_heliocentric_spherical_j2000', this.t, async () => {
            const vsop87 = await import('./vsop87/vsop87NeptuneSphericalJ2000');

            return {
                lon: normalizeAngle(calculateVSOP87Angle(vsop87.VSOP87_X, this.t)),
                lat: calculateVSOP87Angle(vsop87.VSOP87_Y, this.t),
                radiusVector: calculateVSOP87(vsop87.VSOP87_Z, this.t),
            }
        });
    }

    public async getHeliocentricEclipticSphericalDateCoordinates(): Promise<IEclipticSphericalCoordinates> {
        return await getAsyncCachedCalculation('neptune_heliocentric_spherical_date', this.t, async () => {
            const vsop87 = await import('./vsop87/vsop87NeptuneSphericalDate');

            return {
                lon: normalizeAngle(calculateVSOP87Angle(vsop87.VSOP87_X, this.t)),
                lat: calculateVSOP87Angle(vsop87.VSOP87_Y, this.t),
                radiusVector: calculateVSOP87(vsop87.VSOP87_Z, this.t),
            }
        });
    }

    public async getAngularDiameter(): Promise<number> {
        const distance = await this.getApparentDistanceToEarth();

        return observationCalc.getAngularDiameter(distance, DIAMETER_NEPTUNE);
    }

    public async getApparentMagnitude(): Promise<number> {
        const coordsHelio = await this.getHeliocentricEclipticSphericalDateCoordinates();
        const coordsGeo = await this.getGeocentricEclipticSphericalDateCoordinates();
        const i = await this.getPhaseAngle();
        const year = this.toi.getDecimalYear();

        return getApparentMagnitudeNeptune(coordsHelio.radiusVector, coordsGeo.radiusVector, i, year);
    }
}
