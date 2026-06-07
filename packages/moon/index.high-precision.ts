import * as vsop87Date from '@app/resources/vsop87/vsop87EarthSphericalDate';
import * as vsop87J2000 from '@app/resources/vsop87/vsop87EarthSphericalJ2000';
import Earth from '@package/earth/models/Earth';
import Sun from '@package/sun/models/Sun';
import type TimeOfInterest from '@package/time/models/TimeOfInterest';
import MoonClass from './models/Moon';

class Moon extends MoonClass {
    public constructor(toi?: TimeOfInterest) {
        const earth = new Earth(toi, vsop87Date, vsop87J2000);
        super(toi, new Sun(toi, earth), earth);
    }

    public static create(toi?: TimeOfInterest): Moon {
        return new Moon(toi);
    }
}

export {Moon};
