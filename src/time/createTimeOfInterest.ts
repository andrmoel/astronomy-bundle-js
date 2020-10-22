import {timeCalc} from "../utils";
import TimeOfInterest from './TimeOfInterest';

export default function(): TimeOfInterest {
    return fromCurrentTime();
}

export function fromCurrentTime() {
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

export function fromTime(
    year: number,
    month: number,
    day: number,
    hour: number,
    min: number,
    sec: number
): TimeOfInterest {
    return new TimeOfInterest({year, month, day, hour, min, sec});
}

export function fromDate(date: Date): TimeOfInterest {
    return new TimeOfInterest({
        year: date.getUTCFullYear(),
        month: date.getUTCMonth() + 1,
        day: date.getUTCDate(),
        hour: date.getUTCHours(),
        min: date.getUTCMinutes(),
        sec: date.getUTCSeconds(),
    });
}

export function fromYearOfDay(year: number, dayOfYear: number): TimeOfInterest {
    const time = timeCalc.dayOfYear2time(year, dayOfYear);

    return new TimeOfInterest(time);
}

export function fromJulianDay(jd: number): TimeOfInterest {
    const time = timeCalc.julianDay2time(jd);

    return new TimeOfInterest(time);
}

export function fromJulianCenturiesJ2000(T: number): TimeOfInterest {
    const jd = timeCalc.julianCenturiesJ20002julianDay(T);
    const time = timeCalc.julianDay2time(jd);

    return new TimeOfInterest(time);
}
