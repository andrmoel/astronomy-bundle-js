import * as vsop87Date from '@app/resources/vsop87/vsop87EarthSphericalDate';
import * as vsop87J2000 from '@app/resources/vsop87/vsop87EarthSphericalJ2000';
import Earth from '@package/earth/models/Earth';
import type TimeOfInterest from '@package/time/models/TimeOfInterest';
import SunClass from './models/Sun';

class Sun extends SunClass {
    public constructor(toi?: TimeOfInterest) {
        super(toi, new Earth(toi, vsop87Date, vsop87J2000));
    }

    public static create(toi?: TimeOfInterest): Sun {
        return new Sun(toi);
    }
}

export {Sun};
