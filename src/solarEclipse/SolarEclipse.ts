import Location from '../earth/Location';
import createLocation from '../earth/createLocation';
import {BesselianElements} from './types/besselianElementsTypes';
import createLocalCircumstances from './createLocalCircumstances';
import LocalCircumstances from './LocalCircumstances';

export default class SolarEclipse {
    public constructor(private besselianElements: BesselianElements) {
    }

    public getBesselianElements(): BesselianElements {
        return this.besselianElements;
    }

    public getLocationOfGreatestEclipse(): Location {
        const {latGreatestEclipse, lonGreatestEclipse} = this.besselianElements;

        return createLocation(latGreatestEclipse, lonGreatestEclipse);
    }

    public getLocalCircumstances(location: Location): LocalCircumstances {
        return createLocalCircumstances(this.besselianElements, location);
    }
}
