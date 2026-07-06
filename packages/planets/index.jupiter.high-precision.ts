import * as vsop87EarthDate from '@app/resources/vsop87/vsop87EarthSphericalDate';
import * as vsop87EarthJ2000 from '@app/resources/vsop87/vsop87EarthSphericalJ2000';
import * as vsop87JupiterDate from '@app/resources/vsop87/vsop87JupiterSphericalDate';
import * as vsop87JupiterJ2000 from '@app/resources/vsop87/vsop87JupiterSphericalJ2000';
import Earth from '@package/earth/models/Earth';
import Sun from '@package/sun/models/Sun';
import type TimeOfInterest from '@package/time/models/TimeOfInterest';
import JupiterClass from './models/Jupiter';

class Jupiter extends JupiterClass {
    public constructor(toi?: TimeOfInterest) {
        const earth = new Earth(toi, vsop87EarthDate, vsop87EarthJ2000);

        super(toi, earth, new Sun(toi, earth), vsop87JupiterDate, vsop87JupiterJ2000);
    }

    public static create(toi?: TimeOfInterest): Jupiter {
        return new Jupiter(toi);
    }
}

export {Jupiter};
