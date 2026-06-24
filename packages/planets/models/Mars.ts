import {MARS_DIAMETER_KM} from '@app/constants/planets';
import * as vsop87DateDefault from '@app/resources/vsop87/vsop87MarsSphericalDateReduced';
import * as vsop87J2000Default from '@app/resources/vsop87/vsop87MarsSphericalJ2000Reduced';
import type {Vsop87} from '@app/types/Vsop87Types';
import type Earth from '@package/earth/models/Earth';
import type Sun from '@package/sun/models/Sun';
import type TimeOfInterest from '@package/time/models/TimeOfInterest';
import {getApparentMagnitudeMars} from '../utils/magnitude';
import Planet from './Planet';

export default class Mars extends Planet {
    public constructor(
        toi?: TimeOfInterest,
        earth?: Earth,
        sun?: Sun,
        vsop87Date: Vsop87 = vsop87DateDefault,
        vsop87J2000: Vsop87 = vsop87J2000Default,
    ) {
        super(toi, 'mars', MARS_DIAMETER_KM, earth, sun, vsop87Date, vsop87J2000);
    }

    public static create(toi?: TimeOfInterest): Mars {
        return new Mars(toi);
    }

    protected calculateApparentMagnitude(distanceSun: number, distanceEarth: number, phaseAngle: number): number {
        return getApparentMagnitudeMars(distanceSun, distanceEarth, phaseAngle);
    }
}
