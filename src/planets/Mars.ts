import TimeOfInterest from '../time/TimeOfInterest';
import {getApparentMagnitudeMars} from './calculations/magnitudeCalc';
import {DIAMETER_MARS} from './constants/diameters';
import Planet from './Planet';
import {Vsop87} from './types/Vsop87Types';

export default class Mars extends Planet {
    public constructor(toi?: TimeOfInterest, useVsop87Short?: boolean) {
        super(toi, 'mars', useVsop87Short);
    }

    public get diameter(): number {
        return DIAMETER_MARS;
    }

    protected get vsop87J2000(): Promise<Vsop87> {
        return import('./vsop87/vsop87MarsSphericalJ2000');
    }

    protected get vsop87Date(): Promise<Vsop87> {
        return import('./vsop87/vsop87MarsSphericalDate');
    }

    protected get vsop87DateShort(): Promise<Vsop87> {
        return import('./vsop87/vsop87MarsSphericalDateShort');
    }

    protected calculateApparentMagnitude(
        distanceSun: number,
        distanceEarth: number,
        phaseAngle: number,
    ): number {
        return getApparentMagnitudeMars(distanceSun, distanceEarth, phaseAngle);
    }

    public async getCentralMeridian(): Promise<number> {
        return 0.0;
    }
}
