import {decimal2degreeMinutes, decimal2degreeMinutesSeconds} from '../utils/angleCalc';
import {getDistanceInKm} from '../utils/distanceCalc';
import {Location as LocationType} from './types/LocationTypes';

export default class Location {
    private readonly location: LocationType;

    private prefixesNorthSouth = {positivePrefix: 'N ', negativePrefix: 'S '};

    private prefixesEastWest = {positivePrefix: 'E ', negativePrefix: 'W '};

    public constructor(
        public readonly lat: number,
        public readonly lon: number,
        public readonly elevation: number = 0,
    ) {
        this.location = {lat, lon, elevation};
    }

    public getLatitude(): number {
        return this.location.lat;
    }

    public getLongitude(): number {
        return this.location.lon;
    }

    public getLatitudeInDegreeMinutes(): string {
        return decimal2degreeMinutes(this.location.lat, false, this.prefixesNorthSouth);
    }

    public getLongitudeInDegreeMinutes(): string {
        return decimal2degreeMinutes(this.location.lon, false, this.prefixesEastWest);
    }

    public getLatitudeInDegreeMinutesSeconds(): string {
        return decimal2degreeMinutesSeconds(this.location.lat, false, this.prefixesNorthSouth);
    }

    public getLongitudeInDegreeMinutesSeconds(): string {
        return decimal2degreeMinutesSeconds(this.location.lon, false, this.prefixesEastWest);
    }

    public getElevation(): number {
        return this.location.elevation;
    }

    public getDistanceToInKm(location: Location): number {
        return getDistanceInKm(this.location, location);
    }
}
