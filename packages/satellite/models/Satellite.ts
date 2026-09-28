import {LIGHT_SPEED_KM_PER_SEC} from '@app/constants/units';
import type {
    EquatorialSphericalCoordinates,
    LocalHorizontalCoordinates,
    RectangularCoordinates,
} from '@app/types/CoordinateTypes';
import type {Location as LocationType} from '@app/types/LocationTypes';
import type Location from '@package/location/models/Location';
import type TimeOfInterest from '@package/time/models/TimeOfInterest';
import {julianDay2julianCenturiesJ2000} from '@package/time/utils/dateTime';
import {
    DARK_SKY_SUN_ALTITUDE,
    DEFAULT_FOOTPRINT_POINTS,
    DEFAULT_GROUND_TRACK_STEP_MINUTES,
} from '../constants/satellite';
import {MINUTES_PER_DAY} from '../constants/sgp4';
import type {TwoLineElement} from '../types/SatelliteTypes';
import type {Sgp4Record, Sgp4State} from '../types/Sgp4Types';
import {
    getRangeRate,
    teme2equatorialSpherical,
    teme2geographicLocation,
    teme2topocentricHorizontal,
} from '../utils/coordinates';
import {getFootprint, getFootprintRadius, getTimeSteps, splitAtAntimeridian} from '../utils/groundTrack';
import {getSunAltitude, isSunlit} from '../utils/illumination';
import {getApogeeHeight, getOrbitalPeriod, getPerigeeHeight, getSemiMajorAxis} from '../utils/orbit';
import {initializeSgp4, propagateSgp4} from '../utils/sgp4';
import {parseTwoLineElement} from '../utils/twoLineElement';

export default class Satellite {
    private readonly sgp4: Sgp4Record;

    private constructor(public readonly tle: TwoLineElement) {
        this.sgp4 = initializeSgp4(tle);
    }

    public static fromTLE(tle: string): Satellite {
        return new Satellite(parseTwoLineElement(tle));
    }

    public getName(): string | null {
        return this.tle.name;
    }

    public getEpochAge(toi: TimeOfInterest): number {
        return toi.jd - this.tle.epoch.jd;
    }

    public getOrbitalPeriod(): number {
        return getOrbitalPeriod(this.sgp4.no);
    }

    public getSemiMajorAxis(): number {
        return getSemiMajorAxis(this.sgp4.no);
    }

    public getApogeeHeight(): number {
        return getApogeeHeight(this.sgp4.no, this.tle.eccentricity);
    }

    public getPerigeeHeight(): number {
        return getPerigeeHeight(this.sgp4.no, this.tle.eccentricity);
    }

    public getGeocentricEquatorialRectangularCoordinates(toi: TimeOfInterest): RectangularCoordinates {
        return this.getTemeState(toi.jd).position;
    }

    public getGeocentricEquatorialRectangularVelocity(toi: TimeOfInterest): RectangularCoordinates {
        return this.getTemeState(toi.jd).velocity;
    }

    public getSpeed(toi: TimeOfInterest): number {
        const {x, y, z} = this.getTemeState(toi.jd).velocity;

        return Math.sqrt(x * x + y * y + z * z);
    }

    public getGeocentricEquatorialSphericalCoordinates(toi: TimeOfInterest): EquatorialSphericalCoordinates {
        return teme2equatorialSpherical(this.getTemeState(toi.jd).position, toi.T);
    }

    public getGeographicLocation(toi: TimeOfInterest): Location {
        return teme2geographicLocation(this.getTemeState(toi.jd).position, toi.T);
    }

    public getGroundTrack(
        startToi: TimeOfInterest,
        endToi: TimeOfInterest,
        stepMinutes = DEFAULT_GROUND_TRACK_STEP_MINUTES,
    ): Array<Array<Location>> {
        const locations = getTimeSteps(startToi.jd, endToi.jd, stepMinutes).map((jd) =>
            teme2geographicLocation(this.getTemeState(jd).position, julianDay2julianCenturiesJ2000(jd)),
        );

        return splitAtAntimeridian(locations);
    }

    public getFootprint(
        toi: TimeOfInterest,
        minAltitude = 0,
        numberOfPoints = DEFAULT_FOOTPRINT_POINTS,
    ): Array<Location> {
        return getFootprint(this.getGeographicLocation(toi), minAltitude, numberOfPoints);
    }

    public getFootprintRadius(toi: TimeOfInterest, minAltitude = 0): number {
        return getFootprintRadius(this.getGeographicLocation(toi).elevation / 1000, minAltitude);
    }

    public getTopocentricHorizontalCoordinates(
        toi: TimeOfInterest,
        location: LocationType,
    ): LocalHorizontalCoordinates {
        return teme2topocentricHorizontal(this.getTemeState(toi.jd).position, location, toi.T);
    }

    public getRangeRate(toi: TimeOfInterest, location: LocationType): number {
        return getRangeRate(this.getTemeState(toi.jd), location, toi.T);
    }

    public getDopplerShift(toi: TimeOfInterest, location: LocationType, frequency: number): number {
        return (-frequency * this.getRangeRate(toi, location)) / LIGHT_SPEED_KM_PER_SEC;
    }

    public isSunlit(toi: TimeOfInterest): boolean {
        return isSunlit(this.getTemeState(toi.jd).position, toi.T);
    }

    public isVisible(toi: TimeOfInterest, location: LocationType): boolean {
        return (
            this.getTopocentricHorizontalCoordinates(toi, location).altitude > 0
            && getSunAltitude(location, toi.T) < DARK_SKY_SUN_ALTITUDE
            && this.isSunlit(toi)
        );
    }

    private getTemeState(jd: number): Sgp4State {
        const minutesSinceEpoch = (jd - this.tle.epoch.jd) * MINUTES_PER_DAY;

        return propagateSgp4(this.sgp4, minutesSinceEpoch);
    }
}
