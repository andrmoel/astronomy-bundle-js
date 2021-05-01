import Location from '../earth/Location';
import createLocation from '../earth/createLocation';
import {BesselianElements} from './types/besselianElementsTypes';

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
}
