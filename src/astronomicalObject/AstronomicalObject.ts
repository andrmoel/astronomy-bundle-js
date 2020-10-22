import TimeOfInterest from '../time/TimeOfInterest';
import IAstronomicalObject from './interfaces/IAstronomicalObject';
import {createTimeOfInterest} from '../time';

export default abstract class AstronomicalObject implements IAstronomicalObject {
    protected T: number = 0.0;

    public constructor(public toi: TimeOfInterest = createTimeOfInterest.fromCurrentTime()) {
        this.T = toi.T;
    }
}
