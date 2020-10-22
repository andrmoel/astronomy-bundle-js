import ITime from './interfaces/ITime';
import {timeCalc} from '../utils';

export default class TimeOfInterest {
    public jd: number = 0.0;
    public T: number = 0.0;

    constructor(public time: ITime) {
        this.jd = timeCalc.time2julianDay(time);
        this.T = timeCalc.julianDay2julianCenturiesJ2000(this.jd);
    }
}
