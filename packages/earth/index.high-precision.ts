import * as vsop87Date from '@app/resources/vsop87/vsop87EarthSphericalDate';
import * as vsop87J2000 from '@app/resources/vsop87/vsop87EarthSphericalJ2000';
import type TimeOfInterest from '@package/time/models/TimeOfInterest';
import EarthClass from './models/Earth';

class Earth extends EarthClass {
    public constructor(toi?: TimeOfInterest) {
        super(toi, vsop87Date, vsop87J2000);
    }

    public static create(toi?: TimeOfInterest): Earth {
        return new Earth(toi);
    }
}

export {Earth};
