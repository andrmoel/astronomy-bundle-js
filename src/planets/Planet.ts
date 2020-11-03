import AstronomicalObject from '../astronomicalObject/AstronomicalObject';
import IRectangularCoordinates from '../coordinates/interfaces/IRectangularCoordinates';
import {getAsyncCachedCalculation} from '../cache/calculationCache';

export default class Planet extends AstronomicalObject {
    protected async getEarthHeliocentricRectangularJ2000Coordinates(): Promise<IRectangularCoordinates> {
        return await getAsyncCachedCalculation('earth_heliocentric_rectangular_j2000', this.t, async () => {
            const vsop87 = await import('./vspo87/vsop87EarthRectangularJ2000');

            return {
                x: vsop87.calculateX(this.t),
                y: vsop87.calculateY(this.t),
                z: vsop87.calculateZ(this.t),
            }
        });
    }

    protected async getEarthHeliocentricRectangularDateCoordinates(): Promise<IRectangularCoordinates> {
        return await getAsyncCachedCalculation('earth_heliocentric_rectangular_date', this.t, async () => {
            const vsop87 = await import('./vspo87/vsop87EarthRectangularDate');

            return {
                x: vsop87.calculateX(this.t),
                y: vsop87.calculateY(this.t),
                z: vsop87.calculateZ(this.t),
            }
        });
    }
}
