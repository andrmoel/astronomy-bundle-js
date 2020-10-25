import ITime from './interfaces/ITime';
import {timeCalc} from '../utils';

export default class TimeOfInterest {
    public jd: number = 0.0;
    public T: number = 0.0;

    constructor(public time: ITime) {
        this.jd = timeCalc.time2julianDay(time);
        this.T = timeCalc.julianDay2julianCenturiesJ2000(this.jd);
    }

    public getDate() {
        const {year, month, day, hour, min, sec} = this.time;

        return new Date(Date.UTC(year, month - 1, day, hour, min, sec));
    }

    public getDayOfYear() {
        return timeCalc.getDayOfYear(this.time);
    }

    public getDayOfWeek() {
        return timeCalc.getDayOfWeek(this.time);
    }

    public isLeapYear() {
        return timeCalc.isLeapYear(this.time.year);
    }

    public getJulianDay() {
        return this.jd;
    }

    public getJulianCenturiesJ2000() {
        return this.T;
    }
}
