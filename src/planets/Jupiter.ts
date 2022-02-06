import TimeOfInterest from '../time/TimeOfInterest';
import {getApparentMagnitudeJupiter} from './calculations/magnitudeCalc';
import {DIAMETER_JUPITER} from './constants/diameters';
import Planet from './Planet';
import {Vsop87} from './types/Vsop87Types';

export default class Jupiter extends Planet {
    public constructor(toi?: TimeOfInterest, useVsop87Short?: boolean) {
        super('jupiter', toi, useVsop87Short);
    }

    public get diameter(): number {
        return DIAMETER_JUPITER;
    }

    protected get vsop87J2000(): Promise<Vsop87> {
        return import('./vsop87/vsop87JupiterSphericalJ2000');
    }

    protected get vsop87Date(): Promise<Vsop87> {
        return import('./vsop87/vsop87JupiterSphericalDate');
    }

    protected get vsop87DateShort(): Promise<Vsop87> {
        return import('./vsop87/vsop87JupiterSphericalDateShort');
    }

    protected calculateApparentMagnitude(
        distanceSun: number,
        distanceEarth: number,
        phaseAngle: number,
    ): number {
        return getApparentMagnitudeJupiter(distanceSun, distanceEarth, phaseAngle);
    }
}
