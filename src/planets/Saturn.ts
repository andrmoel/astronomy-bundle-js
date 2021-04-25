import TimeOfInterest from '../time/TimeOfInterest';
import {getApparentMagnitudeSaturn} from './calculations/magnitudeCalc';
import {DIAMETER_SATURN} from './constants/diameters';
import Planet from './Planet';

export default class Saturn extends Planet {
    constructor(toi?: TimeOfInterest, useVsop87Short?: boolean) {
        super('saturn', toi, useVsop87Short);
    }

    public get diameter(): number {
        return DIAMETER_SATURN;
    }

    protected calculateApparentMagnitude(
        distanceSun: number,
        distanceEarth: number,
        phaseAngle: number
    ): number {
        return getApparentMagnitudeSaturn(distanceSun, distanceEarth, phaseAngle);
    }
}
