import {Time} from '../types/TimeTypes';
import {pad} from '@app/utils/math';
import {LatLon} from '@app/types/LocationTypes';
import {
    dayOfYear2time,
    getDayOfWeek,
    getDayOfYear,
    getDecimalYear,
    isLeapYear,
    julianCenturiesJ20002julianDay,
    julianDay2julianCenturiesJ2000,
    julianDay2julianDay0,
    julianDay2julianMillenniaJ2000,
    julianDay2time,
    time2julianDay
} from '@package/time/utils/dateTime';
import {
    getGreenwichApparentSiderealTime,
    getGreenwichMeanSiderealTime,
    getLocalApparentSiderealTime,
    getLocalMeanSiderealTime,
} from '@app/utils/siderealTime';
import {getDeltaT} from '@package/time/utils/deltaT';

export default class TimeOfInterest {
    public readonly jd: number = 0.0;

    public readonly T: number = 0.0;

    public constructor(public readonly time: Time) {
        this.jd = time2julianDay(time);
        this.T = julianDay2julianCenturiesJ2000(this.jd);
    }

    public static fromCurrentTime(): TimeOfInterest {
        const date = new Date(Date.now());

        return new TimeOfInterest({
            year: date.getUTCFullYear(),
            month: date.getUTCMonth() + 1,
            day: date.getUTCDate(),
            hour: date.getUTCHours(),
            min: date.getUTCMinutes(),
            sec: date.getUTCSeconds(),
        });
    }

    public static fromTime(
        year: number,
        month: number,
        day: number,
        hour = 0,
        min = 0,
        sec = 0,
    ): TimeOfInterest {
        return new TimeOfInterest({year, month, day, hour, min, sec});
    }

    public static fromDate(date: Date): TimeOfInterest {
        return new TimeOfInterest({
            year: date.getUTCFullYear(),
            month: date.getUTCMonth() + 1,
            day: date.getUTCDate(),
            hour: date.getUTCHours(),
            min: date.getUTCMinutes(),
            sec: date.getUTCSeconds(),
        });
    }

    public static fromYearOfDay(year: number, dayOfYear: number): TimeOfInterest {
        const time = dayOfYear2time(year, dayOfYear);

        return new TimeOfInterest(time);
    }

    public static fromJulianDay(jd: number): TimeOfInterest {
        const time = julianDay2time(jd);

        return new TimeOfInterest(time);
    }

    public static fromJulianCenturiesJ2000(T: number): TimeOfInterest {
        const jd = julianCenturiesJ20002julianDay(T);
        const time = julianDay2time(jd);

        return new TimeOfInterest(time);
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
        return getDecimalYear(this.time);
    }

    public getDayOfYear(): number {
        return getDayOfYear(this.time);
    }

    public getDayOfWeek(): number {
        return getDayOfWeek(this.time);
    }

    public isLeapYear(): boolean {
        return isLeapYear(this.time.year);
    }

    public getJulianDay(): number {
        return this.jd;
    }

    public getJulianDay0(): number {
        return julianDay2julianDay0(this.jd);
    }

    public getJulianCenturiesJ2000(): number {
        return this.T;
    }

    public getJulianMillenniaJ2000(): number {
        return julianDay2julianMillenniaJ2000(this.jd);
    }

    public getGreenwichMeanSiderealTime(): number {
        return getGreenwichMeanSiderealTime(this.T);
    }

    public getGreenwichApparentSiderealTime(): number {
        return getGreenwichApparentSiderealTime(this.T);
    }

    public getLocalMeanSiderealTime(location: LatLon): number {
        return getLocalMeanSiderealTime(this.T, location.lon);
    }

    public getLocalApparentSiderealTime(location: LatLon): number {
        return getLocalApparentSiderealTime(this.T, location.lon);
    }

    public getDeltaT(): number {
        const {year, month} = this.time;

        return getDeltaT(year, month);
    }
}
