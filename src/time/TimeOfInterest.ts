import Location from '../earth/Location';
import {timeCalc} from '../time/calculations';
import {pad} from '../utils/math';
import {Time} from './types/TimeTypes';

export default class TimeOfInterest {
    public readonly jd: number = 0.0;

    public readonly T: number = 0.0;

    public constructor(public readonly time: Time) {
        this.jd = timeCalc.time2julianDay(time);
        this.T = timeCalc.julianDay2julianCenturiesJ2000(this.jd);
    }

    public getTime(): Time {
        return this.time;
    }

    public getString(): string {
        const {year, month, day, hour, min, sec} = this.time;

        return `${year}-${pad(month, 2)}-${pad(day, 2)} ${pad(hour, 2)}:${pad(min, 2)}:${pad(sec, 2)}`;
    }

    public getDate(): Date {
        const {year, month, day, hour, min, sec} = this.time;

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
        return this.jd;
    }

    public getJulianDay0(): number {
        return timeCalc.julianDay2julianDay0(this.jd);
    }

    public getJulianCenturiesJ2000(): number {
        return this.T;
    }

    public getJulianMillenniaJ2000(): number {
        return timeCalc.julianDay2julianMillenniaJ2000(this.jd);
    }

    public getGreenwichMeanSiderealTime(): number {
        return timeCalc.getGreenwichMeanSiderealTime(this.T);
    }

    public getGreenwichApparentSiderealTime(): number {
        return timeCalc.getGreenwichApparentSiderealTime(this.T);
    }

    public getLocalMeanSiderealTime(location: Location): number {
        return timeCalc.getLocalMeanSiderealTime(this.T, location.lon);
    }

    public getLocalApparentSiderealTime(location: Location): number {
        return timeCalc.getLocalApparentSiderealTime(this.T, location.lon);
    }

    public getDeltaT(): number {
        const {year, month} = this.time;

        return timeCalc.getDeltaT(year, month);
    }
}
