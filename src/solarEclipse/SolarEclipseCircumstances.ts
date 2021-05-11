import {createTimeOfInterest} from '../time';
import {TimeLocalDependentCircumstances} from './types/circumstancesTypes';
import {circumstancesToJulianDay} from './calculations/circumstancesCalc';

export default class SolarEclipseCircumstances {
    constructor(private circumstances: TimeLocalDependentCircumstances) {
    }

    public getTimeOfInterest() {
        const jd = circumstancesToJulianDay(this.circumstances);

        return createTimeOfInterest.fromJulianDay(jd);
    }
}
