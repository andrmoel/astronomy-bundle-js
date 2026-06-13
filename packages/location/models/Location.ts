import {decimal2degreeMinutes, decimal2degreeMinutesSeconds} from '@app/utils/angle';
import {getDistanceInKm} from '@app/utils/distance';
import type {Location as LocationType} from '../types/LocationTypes';

export default class Location implements LocationType {
    private prefixesNorthSouth = {positivePrefix: 'N ', negativePrefix: 'S '};

    private prefixesEastWest = {positivePrefix: 'E ', negativePrefix: 'W '};

    public constructor(
        public readonly lat: number,
        public readonly lon: number,
        public readonly elevation: number = 0,
    ) {}

    public static create(lat: number, lon: number, elevation = 0): Location {
        return new Location(lat, lon, elevation);
    }

    public getLatitude(): number {
        return this.lat;
    }

    public getLongitude(): number {
        return this.lon;
    }

    public getElevation(): number {
        return this.elevation;
    }

    public getLatitudeInDegreeMinutes(): string {
        return decimal2degreeMinutes(this.lat, false, this.prefixesNorthSouth);
    }

    public getLongitudeInDegreeMinutes(): string {
        return decimal2degreeMinutes(this.lon, false, this.prefixesEastWest);
    }

    public getLatitudeInDegreeMinutesSeconds(): string {
        return decimal2degreeMinutesSeconds(this.lat, false, this.prefixesNorthSouth);
    }

    public getLongitudeInDegreeMinutesSeconds(): string {
        return decimal2degreeMinutesSeconds(this.lon, false, this.prefixesEastWest);
    }

    public getDistanceToInKm(location: Location): number {
        return getDistanceInKm(this, location);
    }
}
