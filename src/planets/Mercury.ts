import TimeOfInterest from '../time/TimeOfInterest';
import {getApparentMagnitudeMercury} from './calculations/magnitudeCalc';
import {DIAMETER_MERCURY} from './constants/diameters';
import Planet from './Planet';

export default class Mercury extends Planet {
    constructor(toi?: TimeOfInterest, useVsop87Short?: boolean) {
        super('mercury', toi, useVsop87Short);
    }

    public get diameter(): number {
        return DIAMETER_MERCURY;
    }

    protected calculateApparentMagnitude(
        distanceSun: number,
        distanceEarth: number,
        phaseAngle: number
    ): number {
        return getApparentMagnitudeMercury(distanceSun, distanceEarth, phaseAngle);
    }
}
