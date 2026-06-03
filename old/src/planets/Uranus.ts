import TimeOfInterest from '../time/TimeOfInterest';
import {getApparentMagnitudeUranus} from './calculations/magnitudeCalc';
import {DIAMETER_URANUS} from './constants/diameters';
import Planet from './Planet';
import {Vsop87} from './types/Vsop87Types';

export default class Uranus extends Planet {
    public constructor(toi?: TimeOfInterest, useVsop87Short?: boolean) {
        super(toi, 'uranus', useVsop87Short);
    }

    public get diameter(): number {
        return DIAMETER_URANUS;
    }

    protected get vsop87J2000(): Promise<Vsop87> {
        return import('./vsop87/vsop87UranusSphericalJ2000');
    }

    protected get vsop87Date(): Promise<Vsop87> {
        return import('./vsop87/vsop87UranusSphericalDate');
    }

    protected get vsop87DateShort(): Promise<Vsop87> {
        return import('./vsop87/vsop87UranusSphericalDateShort');
    }

    protected calculateApparentMagnitude(
        distanceSun: number,
        distanceEarth: number,
        phaseAngle: number,
    ): number {
        return getApparentMagnitudeUranus(distanceSun, distanceEarth, phaseAngle);
    }
}
