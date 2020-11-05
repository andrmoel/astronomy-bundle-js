import IRectangularCoordinates from '../coordinates/interfaces/IRectangularCoordinates';
import Planet from './Planet';
import {getAsyncCachedCalculation} from '../cache/calculationCache';
import {calculateVSOP87} from './calculations/vsop87Calc';

export default class Uranus extends Planet {
    async getHeliocentricRectangularJ2000Coordinates(): Promise<IRectangularCoordinates> {
        return await getAsyncCachedCalculation('uranus_heliocentric_rectangular_j2000', this.t, async () => {
            const vsop87 = await import('./vspo87/vsop87UranusRectangularJ2000');

            return {
                x: calculateVSOP87(vsop87.VSOP87_X, this.t),
                y: calculateVSOP87(vsop87.VSOP87_Y, this.t),
                z: calculateVSOP87(vsop87.VSOP87_Z, this.t),
            }
        });
    }

    async getHeliocentricRectangularDateCoordinates(): Promise<IRectangularCoordinates> {
        return await getAsyncCachedCalculation('uranus_heliocentric_rectangular_date', this.t, async () => {
            const vsop87 = await import('./vspo87/vsop87UranusRectangularDate');

            return {
                x: calculateVSOP87(vsop87.VSOP87_X, this.t),
                y: calculateVSOP87(vsop87.VSOP87_Y, this.t),
                z: calculateVSOP87(vsop87.VSOP87_Z, this.t),
            }
        });
    }
}
