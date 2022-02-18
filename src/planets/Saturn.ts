import TimeOfInterest from '../time/TimeOfInterest';
import {getApparentMagnitudeSaturn} from './calculations/magnitudeCalc';
import {DIAMETER_SATURN} from './constants/diameters';
import Planet from './Planet';
import {Vsop87} from './types/Vsop87Types';

export default class Saturn extends Planet {
    public constructor(toi?: TimeOfInterest, useVsop87Short?: boolean) {
        super(toi, 'saturn', useVsop87Short);
    }

    public get diameter(): number {
        return DIAMETER_SATURN;
    }

    protected get vsop87J2000(): Promise<Vsop87> {
        return import('./vsop87/vsop87SaturnSphericalJ2000');
    }

    protected get vsop87Date(): Promise<Vsop87> {
        return import('./vsop87/vsop87SaturnSphericalDate');
    }

    protected get vsop87DateShort(): Promise<Vsop87> {
        return import('./vsop87/vsop87SaturnSphericalDateShort');
    }

    protected calculateApparentMagnitude(
        distanceSun: number,
        distanceEarth: number,
        phaseAngle: number,
    ): number {
        return getApparentMagnitudeSaturn(distanceSun, distanceEarth, phaseAngle);
    }
}
