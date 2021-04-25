import TimeOfInterest from '../time/TimeOfInterest';
import {getApparentMagnitudeMars} from './calculations/magnitudeCalc';
import {DIAMETER_MARS} from './constants/diameters';
import Planet from './Planet';

export default class Mars extends Planet {
    constructor(toi?: TimeOfInterest, useVsop87Short?: boolean) {
        super('mars', toi, useVsop87Short);
    }

    public get diameter(): number {
        return DIAMETER_MARS;
    }

    protected calculateApparentMagnitude(
        distanceSun: number,
        distanceEarth: number,
        phaseAngle: number
    ): number {
        return getApparentMagnitudeMars(distanceSun, distanceEarth, phaseAngle);
    }
}
