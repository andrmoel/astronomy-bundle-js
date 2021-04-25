import TimeOfInterest from '../time/TimeOfInterest';
import {getApparentMagnitudeUranus} from './calculations/magnitudeCalc';
import {DIAMETER_URANUS} from './constants/diameters';
import Planet from './Planet';

export default class Uranus extends Planet {
    constructor(toi?: TimeOfInterest, useVsop87Short?: boolean) {
        super('uranus', toi, useVsop87Short);
    }

    public get diameter(): number {
        return DIAMETER_URANUS;
    }

    protected calculateApparentMagnitude(
        distanceSun: number,
        distanceEarth: number,
        phaseAngle: number
    ): number {
        return getApparentMagnitudeUranus(distanceSun, distanceEarth, phaseAngle);
    }
}
