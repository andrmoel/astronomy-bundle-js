import TimeInterface from '../time/interfaces/TimeInterface';
export declare function time2julianDay(time: TimeInterface): number;
export declare function julianDay2time(jd: number): TimeInterface;
export declare function julianDay2julianDay0(jd: number): number;
export declare function julianDay2ModifiedJulianDay(jd: number): number;
export declare function julianDay2julianCenturiesJ2000(jd: number): number;
export declare function julianCenturiesJ20002julianDay(T: number): number;
export declare function julianDay2julianMillenniaJ2000(jd: number): number;
export declare function julianMillenniaJ20002julianDay(t: number): number;
export declare function dayOfYear2time(year: number, dayOfYear: number): TimeInterface;
export declare function getDayOfYear(time: TimeInterface): number;
export declare function getDayOfWeek(time: TimeInterface): number;
export declare function isLeapYear(year: number): boolean;
