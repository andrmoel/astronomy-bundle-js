import TimeOfInterest from '../time/TimeOfInterest';
import {getApparentMagnitudeVenus} from './calculations/magnitudeCalc';
import {DIAMETER_VENUS} from './constants/diameters';
import Planet from './Planet';

export default class Venus extends Planet {
    constructor(toi?: TimeOfInterest, useVsop87Short?: boolean) {
        super('venus', toi, useVsop87Short);
    }

    public get diameter(): number {
        return DIAMETER_VENUS;
    }

    protected calculateApparentMagnitude(
        distanceSun: number,
        distanceEarth: number,
        phaseAngle: number
    ): number {
        return getApparentMagnitudeVenus(distanceSun, distanceEarth, phaseAngle);
    }
}
