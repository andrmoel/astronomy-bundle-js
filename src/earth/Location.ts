import { Location as LocationType } from './LocationTypes';

export default class Location {

    private readonly location: LocationType;

    constructor(public readonly lat: number, public readonly lon: number, public readonly elevation: number = 0) {
        this.location = { lat, lon, elevation };
    }
}
