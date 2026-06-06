import * as vsop87Date from '@app/resources/vsop87/vsop87EarthSphericalDateReduced';
import * as vsop87J2000 from '@app/resources/vsop87/vsop87EarthSphericalJ2000Reduced';
import type TimeOfInterest from '@package/time/models/TimeOfInterest';
import EarthBase from './EarthBase';

export default class Earth extends EarthBase {
    public constructor(toi?: TimeOfInterest) {
        super(toi, vsop87Date, vsop87J2000);
    }

    public static create(toi?: TimeOfInterest): Earth {
        return new Earth(toi);
    }
}
