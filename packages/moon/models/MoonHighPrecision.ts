import Earth from '@package/earth/models/EarthHighPrecision';
import Sun from '@package/sun/models/SunHighPrecision';
import type TimeOfInterest from '@package/time/models/TimeOfInterest';
import MoonBase from './MoonBase';

export default class Moon extends MoonBase {
    public constructor(toi?: TimeOfInterest) {
        super(toi, new Sun(toi), new Earth(toi));
    }

    public static create(toi?: TimeOfInterest): Moon {
        return new Moon(toi);
    }
}
