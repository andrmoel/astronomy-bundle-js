import Location from '../earth/Location';
import {BesselianElements} from './types/besselianElementsTypes';
import {getCentralDuration, getDuration} from './calculations/eclipseCalc';

export default class LocalCircumstances {
    constructor(private besselianElements: BesselianElements, private location: Location) {
    }

    public getDurationOfPartialEclipse(): number {
        return getDuration(this.besselianElements, this.location);
    }

    public getDurationOfCentralEclipse(): number {
        return getCentralDuration(this.besselianElements, this.location)
    }
}
