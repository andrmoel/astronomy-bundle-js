import TimeOfInterest from '../time/TimeOfInterest';
import {getApparentMagnitudeNeptune} from './calculations/magnitudeCalc';
import {DIAMETER_NEPTUNE} from './constants/diameters';
import Planet from './Planet';
import {Vsop87} from './types/Vsop87Types';

export default class Neptune extends Planet {
    public constructor(toi?: TimeOfInterest, useVsop87Short?: boolean) {
        super(toi, 'neptune', useVsop87Short);
    }

    public get diameter(): number {
        return DIAMETER_NEPTUNE;
    }

    protected get vsop87J2000(): Promise<Vsop87> {
        return import('./vsop87/vsop87NeptuneSphericalJ2000');
    }

    protected get vsop87Date(): Promise<Vsop87> {
        return import('./vsop87/vsop87NeptuneSphericalDate');
    }

    protected get vsop87DateShort(): Promise<Vsop87> {
        return import('./vsop87/vsop87NeptuneSphericalDateShort');
    }

    protected calculateApparentMagnitude(
        distanceSun: number,
        distanceEarth: number,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        phaseAngle: number,
    ): number {
        return getApparentMagnitudeNeptune(distanceSun, distanceEarth, this.toi.getDecimalYear());
    }
}
