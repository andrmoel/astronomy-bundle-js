import * as vsop87EarthDate from '@app/resources/vsop87/vsop87EarthSphericalDate';
import * as vsop87EarthJ2000 from '@app/resources/vsop87/vsop87EarthSphericalJ2000';
import * as vsop87VenusDate from '@app/resources/vsop87/vsop87VenusSphericalDate';
import * as vsop87VenusJ2000 from '@app/resources/vsop87/vsop87VenusSphericalJ2000';
import Earth from '@package/earth/models/Earth';
import Sun from '@package/sun/models/Sun';
import type TimeOfInterest from '@package/time/models/TimeOfInterest';
import VenusClass from './models/Venus';

class Venus extends VenusClass {
    public constructor(toi?: TimeOfInterest) {
        const earth = new Earth(toi, vsop87EarthDate, vsop87EarthJ2000);

        super(toi, earth, new Sun(toi, earth), vsop87VenusDate, vsop87VenusJ2000);
    }

    public static create(toi?: TimeOfInterest): Venus {
        return new Venus(toi);
    }
}

export {Venus};
