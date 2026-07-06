import * as vsop87EarthDate from '@app/resources/vsop87/vsop87EarthSphericalDate';
import * as vsop87EarthJ2000 from '@app/resources/vsop87/vsop87EarthSphericalJ2000';
import * as vsop87UranusDate from '@app/resources/vsop87/vsop87UranusSphericalDate';
import * as vsop87UranusJ2000 from '@app/resources/vsop87/vsop87UranusSphericalJ2000';
import Earth from '@package/earth/models/Earth';
import Sun from '@package/sun/models/Sun';
import type TimeOfInterest from '@package/time/models/TimeOfInterest';
import UranusClass from './models/Uranus';

class Uranus extends UranusClass {
    public constructor(toi?: TimeOfInterest) {
        const earth = new Earth(toi, vsop87EarthDate, vsop87EarthJ2000);

        super(toi, earth, new Sun(toi, earth), vsop87UranusDate, vsop87UranusJ2000);
    }

    public static create(toi?: TimeOfInterest): Uranus {
        return new Uranus(toi);
    }
}

export {Uranus};
