import TimeOfInterest from '../time/TimeOfInterest';
import {getApparentMagnitudeVenus} from './calculations/magnitudeCalc';
import {DIAMETER_VENUS} from './constants/diameters';
import Planet from './Planet';
import {Vsop87} from './types/Vsop87Types';

export default class Venus extends Planet {
    public constructor(toi?: TimeOfInterest, useVsop87Short?: boolean) {
        super('venus', toi, useVsop87Short);
    }

    public get diameter(): number {
        return DIAMETER_VENUS;
    }

    protected get vsop87J2000(): Promise<Vsop87> {
        return import('./vsop87/vsop87VenusSphericalJ2000');
    }

    protected get vsop87Date(): Promise<Vsop87> {
        return import('./vsop87/vsop87VenusSphericalDate');
    }

    protected get vsop87DateShort(): Promise<Vsop87> {
        return import('./vsop87/vsop87VenusSphericalDateShort');
    }

    protected calculateApparentMagnitude(
        distanceSun: number,
        distanceEarth: number,
        phaseAngle: number
    ): number {
        return getApparentMagnitudeVenus(distanceSun, distanceEarth, phaseAngle);
    }
}
