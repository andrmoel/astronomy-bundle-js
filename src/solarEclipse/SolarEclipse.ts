import createLocation from '../earth/createLocation';
import Location from '../earth/Location';
import createLocalCircumstances from './createLocalCircumstances';
import LocalCircumstances from './LocalCircumstances';
import {BesselianElements} from './types/besselianElementsTypes';

export default class SolarEclipse {
    public constructor(private besselianElements: BesselianElements) {}

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
