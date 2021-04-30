import TimeOfInterest from '../time/TimeOfInterest';
import {getApparentMagnitudeMercury} from './calculations/magnitudeCalc';
import {DIAMETER_MERCURY} from './constants/diameters';
import Planet from './Planet';
import {Vsop87} from './types/Vsop87Types';

export default class Mercury extends Planet {
    constructor(toi?: TimeOfInterest, useVsop87Short?: boolean) {
        super('mercury', toi, useVsop87Short);
    }

    public get diameter(): number {
        return DIAMETER_MERCURY;
    }

    protected get vsop87J2000(): Promise<Vsop87> {
        return import('./vsop87/vsop87MercurySphericalJ2000');
    }

    protected get vsop87Date(): Promise<Vsop87> {
        return import('./vsop87/vsop87MercurySphericalDate');
    }

    protected get vsop87DateShort(): Promise<Vsop87> {
        return import('./vsop87/vsop87MercurySphericalDateShort');
    }

    protected calculateApparentMagnitude(
        distanceSun: number,
        distanceEarth: number,
        phaseAngle: number
    ): number {
        return getApparentMagnitudeMercury(distanceSun, distanceEarth, phaseAngle);
    }
}
