import { Time } from './timeTypes';
import Location from '../earth/Location';
import { timeCalc } from '../utils';

export default class TimeOfInterest {

    private readonly julianDay: number;

    private readonly julianCenturies: number;

    constructor(public readonly time: Time) {
        this.julianDay = timeCalc.time2julianDay(time);
        this.julianCenturies = timeCalc.julianDay2julianCenturiesJ2000(this.julianDay);
    }

    public getDate(): Date {
        const { year, month, day, hour, min, sec } = this.time;

        return new Date(Date.UTC(year, month - 1, day, hour, min, sec));
    }

    public getDecimalYear(): number {
        return timeCalc.getDecimalYear(this.time);
    }

    public getDayOfYear(): number {
        return timeCalc.getDayOfYear(this.time);
    }

    public getDayOfWeek(): number {
        return timeCalc.getDayOfWeek(this.time);
    }

    public isLeapYear(): boolean {
        return timeCalc.isLeapYear(this.time.year);
    }

    public getJulianDay(): number {
        return this.julianDay;
    }

    public getJulianDay0(): number {
        return timeCalc.julianDay2julianDay0(this.julianDay);
    }

    public getJulianCenturiesJ2000(): number {
        return this.julianCenturies;
    }

    public getJulianMillenniaJ2000(): number {
        return timeCalc.julianDay2julianMillenniaJ2000(this.julianDay);
    }

    public getGreenwichMeanSiderealTime(): number {
        return timeCalc.getGreenwichMeanSiderealTime(this.julianCenturies);
    }

    public getGreenwichApparentSiderealTime(): number {
        return timeCalc.getGreenwichApparentSiderealTime(this.julianCenturies);
    }

    public getLocalMeanSiderealTime(location: Location): number {
        return timeCalc.getLocalMeanSiderealTime(this.julianCenturies, location.lon);
    }

    public getLocalApparentSiderealTime(location: Location): number {
        return timeCalc.getLocalApparentSiderealTime(this.julianCenturies, location.lon);
    }

    public getDeltaT(): number {
        const { year, month } = this.time;

        return timeCalc.getDeltaT(year, month);
    }
}
