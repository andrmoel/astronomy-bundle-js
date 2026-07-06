import * as vsop87EarthDate from '@app/resources/vsop87/vsop87EarthSphericalDate';
import * as vsop87EarthJ2000 from '@app/resources/vsop87/vsop87EarthSphericalJ2000';
import * as vsop87MercuryDate from '@app/resources/vsop87/vsop87MercurySphericalDate';
import * as vsop87MercuryJ2000 from '@app/resources/vsop87/vsop87MercurySphericalJ2000';
import Earth from '@package/earth/models/Earth';
import Sun from '@package/sun/models/Sun';
import type TimeOfInterest from '@package/time/models/TimeOfInterest';
import MercuryClass from './models/Mercury';

class Mercury extends MercuryClass {
    public constructor(toi?: TimeOfInterest) {
        const earth = new Earth(toi, vsop87EarthDate, vsop87EarthJ2000);

        super(toi, earth, new Sun(toi, earth), vsop87MercuryDate, vsop87MercuryJ2000);
    }

    public static create(toi?: TimeOfInterest): Mercury {
        return new Mercury(toi);
    }
}

export {Mercury};
