import {createTimeOfInterest} from '../time';
import {TimeLocalDependentCircumstances} from './types/circumstancesTypes';
import {BesselianElements} from './types/besselianElementsTypes';
import {circumstancesToJulianDay, getMid} from './calculations/circumstancesCalc';

export default class SolarEclipseCircumstances {
    constructor(
        private besselianElements: BesselianElements,
        private circumstances: TimeLocalDependentCircumstances,
    ) {
    }

    public getTimeOfInterest() {
        const jd = circumstancesToJulianDay(this.besselianElements, this.circumstances);

        return createTimeOfInterest.fromJulianDay(jd);
    }
}
