import Location from '../earth/Location';
import createLocation from '../earth/createLocation';
import {BesselianElements} from './types/besselianElementsTypes';
import {iterateCircumstancesMaximumEclipse} from './calculations/circumstancesCalc';
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

    public getCircumstancesMaximumEclipse(location: Location): SolarEclipseCircumstances {
        const circumstances = iterateCircumstancesMaximumEclipse(this.besselianElements, location);

        return createSolarEclipseCircumstances(circumstances);
    }
}
