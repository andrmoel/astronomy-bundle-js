import * as vsop87EarthDate from '@app/resources/vsop87/vsop87EarthSphericalDate';
import * as vsop87EarthJ2000 from '@app/resources/vsop87/vsop87EarthSphericalJ2000';
import * as vsop87SaturnDate from '@app/resources/vsop87/vsop87SaturnSphericalDate';
import * as vsop87SaturnJ2000 from '@app/resources/vsop87/vsop87SaturnSphericalJ2000';
import Earth from '@package/earth/models/Earth';
import Sun from '@package/sun/models/Sun';
import type TimeOfInterest from '@package/time/models/TimeOfInterest';
import SaturnClass from './models/Saturn';

class Saturn extends SaturnClass {
    public constructor(toi?: TimeOfInterest) {
        const earth = new Earth(toi, vsop87EarthDate, vsop87EarthJ2000);

        super(toi, earth, new Sun(toi, earth), vsop87SaturnDate, vsop87SaturnJ2000);
    }

    public static create(toi?: TimeOfInterest): Saturn {
        return new Saturn(toi);
    }
}

export {Saturn};
