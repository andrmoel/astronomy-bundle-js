import {Location as LocationType} from './LocationTypes';

export default class Location {
    private location: LocationType;

    constructor(public lat: number, public lon: number, public elevation: number = 0) {
        this.location = {lat, lon, elevation};
    }
}
