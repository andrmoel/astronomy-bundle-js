import TimeOfInterest from '../time/TimeOfInterest';
import {getApparentMagnitudeNeptune} from './calculations/magnitudeCalc';
import {DIAMETER_NEPTUNE} from './constants/diameters';
import Planet from './Planet';

export default class Neptune extends Planet {
    constructor(toi?: TimeOfInterest, useVsop87Short?: boolean) {
        super('neptune', toi, useVsop87Short);
    }

    public get diameter(): number {
        return DIAMETER_NEPTUNE;
    }

    protected calculateApparentMagnitude(
        distanceSun: number,
        distanceEarth: number,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        phaseAngle: number
    ): number {
        return getApparentMagnitudeNeptune(distanceSun, distanceEarth, this.toi.getDecimalYear());
    }
}
