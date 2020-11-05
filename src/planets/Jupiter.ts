import IRectangularCoordinates from '../coordinates/interfaces/IRectangularCoordinates';
import Planet from './Planet';
import {getAsyncCachedCalculation} from "../cache/calculationCache";

export default class Jupiter extends Planet {
    async getHeliocentricRectangularJ2000Coordinates(): Promise<IRectangularCoordinates> {
        return await getAsyncCachedCalculation('jupiter_heliocentric_rectangular_j2000', this.t, async () => {
            const vsop87 = await import('./vspo87/vsop87JupiterRectangularJ2000');

            return {
                x: vsop87.calculateX(this.t),
                y: vsop87.calculateY(this.t),
                z: vsop87.calculateZ(this.t),
            }
        });
    }

    async getHeliocentricRectangularDateCoordinates(): Promise<IRectangularCoordinates> {
        return await getAsyncCachedCalculation('jupiter_heliocentric_rectangular_date', this.t, async () => {
            const vsop87 = await import('./vspo87/vsop87JupiterRectangularDate');

            return {
                x: vsop87.calculateX(this.t),
                y: vsop87.calculateY(this.t),
                z: vsop87.calculateZ(this.t),
            }
        });
    }
}
