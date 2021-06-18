import {createTimeOfInterest} from '../time';
import TimeOfInterest from '../time/TimeOfInterest';

import {TimeLocalDependentCircumstances} from './types/circumstancesTypes';
import {circumstancesToJulianDay} from './calculations/circumstancesCalc';

export default class SolarEclipseCircumstances {
    constructor(private circumstances: TimeLocalDependentCircumstances) {
    }

    public getTimeOfInterest(): TimeOfInterest {
        const jd = circumstancesToJulianDay(this.circumstances);

        return createTimeOfInterest.fromJulianDay(jd);
    }
}
