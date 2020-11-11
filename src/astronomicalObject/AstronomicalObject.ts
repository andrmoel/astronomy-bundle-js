import TimeOfInterest from '../time/TimeOfInterest';
import IAstronomicalObject from './interfaces/IAstronomicalObject';
import {createTimeOfInterest} from '../time';

export default abstract class AstronomicalObject implements IAstronomicalObject {
    protected jd: number = 0.0;
    protected jd0: number = 0.0;
    protected T: number = 0.0;
    protected t: number = 0.0;

    public constructor(public toi: TimeOfInterest = createTimeOfInterest.fromCurrentTime()) {
        this.jd = toi.getJulianDay();
        this.jd0 = toi.getJulianDay0();
        this.T = toi.getJulianCenturiesJ2000();
        this.t = toi.getJulianMillenniaJ2000();
    }
}
