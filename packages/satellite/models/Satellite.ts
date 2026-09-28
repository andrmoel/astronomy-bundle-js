import type {
    EquatorialSphericalCoordinates,
    LocalHorizontalCoordinates,
    RectangularCoordinates,
} from '@app/types/CoordinateTypes';
import type {Location as LocationType} from '@app/types/LocationTypes';
import type Location from '@package/location/models/Location';
import type TimeOfInterest from '@package/time/models/TimeOfInterest';
import {MINUTES_PER_DAY} from '../constants/sgp4';
import type {TwoLineElement} from '../types/SatelliteTypes';
import type {Sgp4Record} from '../types/Sgp4Types';
import {teme2equatorialSpherical, teme2geographicLocation, teme2topocentricHorizontal} from '../utils/coordinates';
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

    public getGeocentricEquatorialRectangularCoordinates(toi: TimeOfInterest): RectangularCoordinates {
        return this.getTemePosition(toi);
    }

    public getGeocentricEquatorialSphericalCoordinates(toi: TimeOfInterest): EquatorialSphericalCoordinates {
        return teme2equatorialSpherical(this.getTemePosition(toi), toi.T);
    }

    public getGeographicLocation(toi: TimeOfInterest): Location {
        return teme2geographicLocation(this.getTemePosition(toi), toi.T);
    }

    public getTopocentricHorizontalCoordinates(
        toi: TimeOfInterest,
        location: LocationType,
    ): LocalHorizontalCoordinates {
        return teme2topocentricHorizontal(this.getTemePosition(toi), location, toi.T);
    }

    private getTemePosition(toi: TimeOfInterest): RectangularCoordinates {
        const minutesSinceEpoch = (toi.jd - this.tle.epoch.jd) * MINUTES_PER_DAY;

        return propagateSgp4(this.sgp4, minutesSinceEpoch).position;
    }
}
