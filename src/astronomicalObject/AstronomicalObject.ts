import TimeOfInterest from '../time/TimeOfInterest';
import IAstronomicalObject from './interfaces/IAstronomicalObject';

export default abstract class AstronomicalObject implements IAstronomicalObject {
    protected T: number = 0.0;

    public constructor(public toi: TimeOfInterest) {
        this.T = toi.T;
    }
}
