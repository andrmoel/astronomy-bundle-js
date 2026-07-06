import * as vsop87EarthDate from '@app/resources/vsop87/vsop87EarthSphericalDate';
import * as vsop87EarthJ2000 from '@app/resources/vsop87/vsop87EarthSphericalJ2000';
import * as vsop87NeptuneDate from '@app/resources/vsop87/vsop87NeptuneSphericalDate';
import * as vsop87NeptuneJ2000 from '@app/resources/vsop87/vsop87NeptuneSphericalJ2000';
import Earth from '@package/earth/models/Earth';
import Sun from '@package/sun/models/Sun';
import type TimeOfInterest from '@package/time/models/TimeOfInterest';
import NeptuneClass from './models/Neptune';

class Neptune extends NeptuneClass {
    public constructor(toi?: TimeOfInterest) {
        const earth = new Earth(toi, vsop87EarthDate, vsop87EarthJ2000);

        super(toi, earth, new Sun(toi, earth), vsop87NeptuneDate, vsop87NeptuneJ2000);
    }

    public static create(toi?: TimeOfInterest): Neptune {
        return new Neptune(toi);
    }
}

export {Neptune};
