import Location from '../earth/Location';
import createLocation from '../earth/createLocation';
import {BesselianElements} from './types/besselianElementsTypes';
import {getTimeLocationCircumstances, getTimeLocationCircumstancesMaxEclipse} from './calculations/circumstancesCalc';
import createSolarEclipseCircumstances from './createSolarEclipseCircumstances';
import SolarEclipseCircumstances from './SolarEclipseCircumstances';

export default class SolarEclipse {
    constructor(private besselianElements: BesselianElements) {
    }

    public getBesselianElements(): BesselianElements {
        return this.besselianElements;
    }

    public getLocationOfGreatestEclipse(): Location {
        const {latGreatestEclipse, lonGreatestEclipse} = this.besselianElements;

        return createLocation(latGreatestEclipse, lonGreatestEclipse);
    }

    public getCircumstances(location: Location, t: number): SolarEclipseCircumstances {
        // TODO implement
        const circumstances = getTimeLocationCircumstances(this.besselianElements, location, t);

        return createSolarEclipseCircumstances(circumstances);
    }

    public getCircumstancesContact1(location: Location): SolarEclipseCircumstances {
        // TODO implement
        const circumstances = getTimeLocationCircumstancesMaxEclipse(this.besselianElements, location);

        return createSolarEclipseCircumstances(circumstances);
    }

    public getCircumstancesContact2(location: Location): SolarEclipseCircumstances {
        // TODO implement
        const circumstances = getTimeLocationCircumstancesMaxEclipse(this.besselianElements, location);

        return createSolarEclipseCircumstances(circumstances);
    }

    public getCircumstancesMaximumEclipse(location: Location): SolarEclipseCircumstances {
        const circumstances = getTimeLocationCircumstancesMaxEclipse(this.besselianElements, location);

        return createSolarEclipseCircumstances(circumstances);
    }

    public getCircumstancesContact3(location: Location): SolarEclipseCircumstances {
        // TODO implement
        const circumstances = getTimeLocationCircumstancesMaxEclipse(this.besselianElements, location);

        return createSolarEclipseCircumstances(circumstances);
    }

    public getCircumstancesContact4(location: Location): SolarEclipseCircumstances {
        // TODO implement
        const circumstances = getTimeLocationCircumstancesMaxEclipse(this.besselianElements, location);

        return createSolarEclipseCircumstances(circumstances);
    }
}
