import {createTimeOfInterest} from '../time';
import TimeOfInterest from '../time/TimeOfInterest';
import {ObservationalCircumstances, TimeLocationCircumstances} from './types/circumstancesTypes';
import {circumstancesToJulianDay, getObservationalCircumstances} from './calculations/circumstancesCalc';

export default class SolarEclipseCircumstances {
    private observationalCircumstances: ObservationalCircumstances;

    constructor(private circumstances: TimeLocationCircumstances) {
        this.observationalCircumstances = getObservationalCircumstances(circumstances);
    }

    public getTimeOfInterest(): TimeOfInterest {
        const jd = circumstancesToJulianDay(this.circumstances);

        return createTimeOfInterest.fromJulianDay(jd);
    }

    public getMagnitude(): number {
        return this.observationalCircumstances.magnitude;
    }

    public getMoonSunRatio(): number {
        return this.observationalCircumstances.moonSunRatio;
    }
}
