import {SATURN_DIAMETER_KM} from '@app/constants/planets';
import * as vsop87DateDefault from '@app/resources/vsop87/vsop87SaturnSphericalDateReduced';
import * as vsop87J2000Default from '@app/resources/vsop87/vsop87SaturnSphericalJ2000Reduced';
import type {Vsop87} from '@app/types/Vsop87Types';
import type Earth from '@package/earth/models/Earth';
import type Sun from '@package/sun/models/Sun';
import type TimeOfInterest from '@package/time/models/TimeOfInterest';
import {getApparentMagnitudeSaturn} from '../utils/magnitude';
import Planet from './Planet';

export default class Saturn extends Planet {
    public constructor(
        toi?: TimeOfInterest,
        earth?: Earth,
        sun?: Sun,
        vsop87Date: Vsop87 = vsop87DateDefault,
        vsop87J2000: Vsop87 = vsop87J2000Default,
    ) {
        super(toi, 'saturn', SATURN_DIAMETER_KM, earth, sun, vsop87Date, vsop87J2000);
    }

    public static create(toi?: TimeOfInterest): Saturn {
        return new Saturn(toi);
    }

    protected calculateApparentMagnitude(distanceSun: number, distanceEarth: number, phaseAngle: number): number {
        return getApparentMagnitudeSaturn(distanceSun, distanceEarth, phaseAngle, this.getSaturnRingInclination());
    }
}
