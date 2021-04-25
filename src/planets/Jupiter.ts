import TimeOfInterest from '../time/TimeOfInterest';
import {getApparentMagnitudeJupiter} from './calculations/magnitudeCalc';
import {DIAMETER_JUPITER} from './constants/diameters';
import Planet from './Planet';

export default class Jupiter extends Planet {
    constructor(toi?: TimeOfInterest, useVsop87Short?: boolean) {
        super('jupiter', toi, useVsop87Short);
    }

    public get diameter(): number {
        return DIAMETER_JUPITER;
    }

    protected calculateApparentMagnitude(
        distanceSun: number,
        distanceEarth: number,
        phaseAngle: number
    ): number {
        return getApparentMagnitudeJupiter(distanceSun, distanceEarth, phaseAngle);
    }
}
