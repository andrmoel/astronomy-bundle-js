import * as vsop87EarthDate from '@app/resources/vsop87/vsop87EarthSphericalDate';
import * as vsop87EarthJ2000 from '@app/resources/vsop87/vsop87EarthSphericalJ2000';
import * as vsop87MarsDate from '@app/resources/vsop87/vsop87MarsSphericalDate';
import * as vsop87MarsJ2000 from '@app/resources/vsop87/vsop87MarsSphericalJ2000';
import Earth from '@package/earth/models/Earth';
import Sun from '@package/sun/models/Sun';
import type TimeOfInterest from '@package/time/models/TimeOfInterest';
import MarsClass from './models/Mars';

class Mars extends MarsClass {
    public constructor(toi?: TimeOfInterest) {
        const earth = new Earth(toi, vsop87EarthDate, vsop87EarthJ2000);

        super(toi, earth, new Sun(toi, earth), vsop87MarsDate, vsop87MarsJ2000);
    }

    public static create(toi?: TimeOfInterest): Mars {
        return new Mars(toi);
    }
}

export {Mars};
