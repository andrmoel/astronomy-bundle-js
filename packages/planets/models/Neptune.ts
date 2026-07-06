import {NEPTUNE_DIAMETER_KM} from '@app/constants/planets';
import * as vsop87DateDefault from '@app/resources/vsop87/vsop87NeptuneSphericalDateReduced';
import * as vsop87J2000Default from '@app/resources/vsop87/vsop87NeptuneSphericalJ2000Reduced';
import type {Vsop87} from '@app/types/Vsop87Types';
import type Earth from '@package/earth/models/Earth';
import type Sun from '@package/sun/models/Sun';
import type TimeOfInterest from '@package/time/models/TimeOfInterest';
import {getApparentMagnitudeNeptune} from '../utils/magnitude';
import Planet from './Planet';

export default class Neptune extends Planet {
    public constructor(
        toi?: TimeOfInterest,
        earth?: Earth,
        sun?: Sun,
        vsop87Date: Vsop87 = vsop87DateDefault,
        vsop87J2000: Vsop87 = vsop87J2000Default,
    ) {
        super(toi, 'neptune', NEPTUNE_DIAMETER_KM, earth, sun, vsop87Date, vsop87J2000);
    }

    public static create(toi?: TimeOfInterest): Neptune {
        return new Neptune(toi);
    }

    protected calculateApparentMagnitude(distanceSun: number, distanceEarth: number): number {
        return getApparentMagnitudeNeptune(distanceSun, distanceEarth, this.getTimeOfInterest().getDecimalYear());
    }
}
