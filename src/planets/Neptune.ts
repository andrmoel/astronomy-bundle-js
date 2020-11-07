import IRectangularCoordinates from '../coordinates/interfaces/IRectangularCoordinates';
import Planet from './Planet';
import {calculateVSOP87} from '../utils/vsop87Calc';
import {getAsyncCachedCalculation} from '../cache/calculationCache';
import {au2km} from '../utils/distanceCalc';
import {observationCalc} from '../utils';
import {DIAMETER_NEPTUNE} from '../constants/diameters';

export default class Neptune extends Planet {
    public async getHeliocentricRectangularJ2000Coordinates(): Promise<IRectangularCoordinates> {
        return await getAsyncCachedCalculation('neptune_heliocentric_rectangular_j2000', this.t, async () => {
            const vsop87 = await import('./vsop87/vsop87NeptuneRectangularJ2000');

            return {
                x: calculateVSOP87(vsop87.VSOP87_X, this.t),
                y: calculateVSOP87(vsop87.VSOP87_Y, this.t),
                z: calculateVSOP87(vsop87.VSOP87_Z, this.t),
            }
        });
    }

    public async getHeliocentricRectangularDateCoordinates(): Promise<IRectangularCoordinates> {
        return await getAsyncCachedCalculation('neptune_heliocentric_rectangular_date', this.t, async () => {
            const vsop87 = await import('./vsop87/vsop87NeptuneRectangularDate');

            return {
                x: calculateVSOP87(vsop87.VSOP87_X, this.t),
                y: calculateVSOP87(vsop87.VSOP87_Y, this.t),
                z: calculateVSOP87(vsop87.VSOP87_Z, this.t),
            }
        });
    }

    public async getAngularDiameter(): Promise<number> {
        const coords = await this.getApparentGeocentricEquatorialSphericalCoordinates();
        const distance = au2km(coords.radiusVector);

        return observationCalc.getAngularDiameter(distance, DIAMETER_NEPTUNE);
    }
}
