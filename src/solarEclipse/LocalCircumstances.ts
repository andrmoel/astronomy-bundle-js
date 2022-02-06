import Location from '../earth/Location';
import {BesselianElements} from './types/besselianElementsTypes';
import ObservationalCircumstances from './ObservationalCircumstances';
import {
    getTimeLocationCircumstancesC1,
    getTimeLocationCircumstancesC2,
    getTimeLocationCircumstancesC3,
    getTimeLocationCircumstancesC4,
    getTimeLocationCircumstancesMaxEclipse,
} from './calculations/eventCircumstancesCalc';
import createObservationalCircumstances from './createObservationalCircumstances';

export default class LocalCircumstances {
    public constructor(private besselianElements: BesselianElements, private location: Location) {
    }

    public getObservationalCircumstancesForC1(): ObservationalCircumstances {
        const circumstances = getTimeLocationCircumstancesC1(this.besselianElements, this.location);

        return createObservationalCircumstances(circumstances);
    }

    public getObservationalCircumstancesForC2(): ObservationalCircumstances {
        const circumstances = getTimeLocationCircumstancesC2(this.besselianElements, this.location);

        return createObservationalCircumstances(circumstances);
    }

    public getObservationalCircumstancesForMaxEclipse(): ObservationalCircumstances {
        const circumstances = getTimeLocationCircumstancesMaxEclipse(this.besselianElements, this.location);

        return createObservationalCircumstances(circumstances);
    }

    public getObservationalCircumstancesForC3(): ObservationalCircumstances {
        const circumstances = getTimeLocationCircumstancesC3(this.besselianElements, this.location);

        return createObservationalCircumstances(circumstances);
    }

    public getObservationalCircumstancesForC4(): ObservationalCircumstances {
        const circumstances = getTimeLocationCircumstancesC4(this.besselianElements, this.location);

        return createObservationalCircumstances(circumstances);
    }
}
