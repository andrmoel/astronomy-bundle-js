import IRectangularCoordinates from '../coordinates/interfaces/IRectangularCoordinates';
import Planet from './Planet';

export default class Mars extends Planet {
    async getHeliocentricRectangularJ2000Coordinates(): Promise<IRectangularCoordinates> {
        const vsop87 = await import('./vspo87/vsop87MarsRectangularJ2000');

        return {
            x: vsop87.calculateX(this.t),
            y: vsop87.calculateY(this.t),
            z: vsop87.calculateZ(this.t),
        }
    }

    async getHeliocentricRectangularDateCoordinates(): Promise<IRectangularCoordinates> {
        const vsop87 = await import('./vspo87/vsop87MarsRectangularDate');

        return {
            x: vsop87.calculateX(this.t),
            y: vsop87.calculateY(this.t),
            z: vsop87.calculateZ(this.t),
        }
    }
}
