import {
    MOON_DIAMETER_KM,
    MOON_PHASE_FIRST_QUARTER,
    MOON_PHASE_FULL_MOON,
    MOON_PHASE_LAST_QUARTER,
    MOON_PHASE_NEW_MOON,
} from '@app/constants/moon';
import type {EclipticSphericalCoordinates, RectangularCoordinates} from '@app/types/CoordinateTypes';
import type {Location} from '@app/types/LocationTypes';
import {correctEffectOfNutation} from '@app/utils/apparentPositionCorrections';
import {
    equatorialSpherical2eclipticSpherical,
    rectangular2spherical,
    rectangularGeocentric2rectangularHeliocentric,
    spherical2rectangular,
} from '@app/utils/coordinateTransformation';
import * as moon from '@app/utils/moon';
import {
    getAngularDiameter,
    getElongation,
    getIlluminatedFraction,
    getPhaseAngle,
    getPositionAngleOfBrightLimb,
    isWaxing,
} from '@app/utils/observation';
import AstronomicalObject from '@package/core/models/models/AstronomicalObject';
import Earth from '@package/earth/models/Earth';
import type {SelenographicLocation} from '@package/moon/types/LibrationTypes';
import {getOpticalSelenographicLocation, getSelenographicLocation} from '@package/moon/utils/libration';
import {getApparentMagnitudeMoon} from '@package/moon/utils/magnitude';
import {getTimeOfInterestOfUpcomingPhase} from '@package/moon/utils/phases';
import Sun from '@package/sun/models/Sun';
import type TimeOfInterest from '@package/time/models/TimeOfInterest';

export default class Moon extends AstronomicalObject {
    public constructor(
        toi?: TimeOfInterest,
        private readonly sun: Sun = new Sun(toi),
        private readonly earth: Earth = new Earth(toi),
    ) {
        super(toi, 'moon');
    }

    public static create(toi?: TimeOfInterest): Moon {
        return new Moon(toi);
    }

    public getHeliocentricEclipticRectangularJ2000Coordinates(): RectangularCoordinates {
        return this.getHeliocentricEclipticRectangularDateCoordinates();
    }

    public getHeliocentricEclipticRectangularDateCoordinates(): RectangularCoordinates {
        const geocentricCoords = this.getGeocentricEclipticRectangularDateCoordinates();
        const heliocentricCoordsEarth = this.earth.getHeliocentricEclipticRectangularDateCoordinates();

        return rectangularGeocentric2rectangularHeliocentric(geocentricCoords, heliocentricCoordsEarth);
    }

    public getHeliocentricEclipticSphericalJ2000Coordinates(): EclipticSphericalCoordinates {
        return this.getHeliocentricEclipticSphericalDateCoordinates();
    }

    public getHeliocentricEclipticSphericalDateCoordinates(): EclipticSphericalCoordinates {
        const coords = this.getHeliocentricEclipticRectangularDateCoordinates();

        return rectangular2spherical(coords);
    }

    public getGeocentricEclipticRectangularJ2000Coordinates(): RectangularCoordinates {
        return this.getGeocentricEclipticRectangularDateCoordinates();
    }

    public getGeocentricEclipticRectangularDateCoordinates(): RectangularCoordinates {
        const coords = this.getGeocentricEclipticSphericalDateCoordinates();

        return spherical2rectangular(coords);
    }

    public getGeocentricEclipticSphericalJ2000Coordinates(): EclipticSphericalCoordinates {
        return this.getGeocentricEclipticSphericalDateCoordinates();
    }

    public getGeocentricEclipticSphericalDateCoordinates(): EclipticSphericalCoordinates {
        const lon = moon.getLongitude(this.T);
        const lat = moon.getLatitude(this.T);
        const radiusVector = moon.getRadiusVector(this.T);

        return {lon, lat, radiusVector};
    }

    public getApparentGeocentricEclipticSphericalCoordinates(): EclipticSphericalCoordinates {
        const coords = this.getGeocentricEclipticSphericalDateCoordinates();

        return correctEffectOfNutation(coords, this.T);
    }

    public getAngularDiameter(): number {
        const distance = this.getApparentDistanceToEarth();

        return getAngularDiameter(distance, MOON_DIAMETER_KM);
    }

    public getTopocentricAngularDiameter(location: Location): number {
        const distance = this.getTopocentricDistanceToEarth(location);

        return getAngularDiameter(distance, MOON_DIAMETER_KM);
    }

    public getElongation(): number {
        const coordsMoon = this.getApparentGeocentricEquatorialSphericalCoordinates();
        const coordsSun = this.sun.getApparentGeocentricEquatorialSphericalCoordinates();

        return getElongation(coordsMoon, coordsSun);
    }

    public getTopocentricElongation(location: Location): number {
        const coordsMoon = this.getApparentTopocentricEquatorialSphericalCoordinates(location);
        const coordsSun = this.sun.getApparentGeocentricEquatorialSphericalCoordinates();

        return getElongation(coordsMoon, coordsSun);
    }

    public getPhaseAngle(): number {
        const coordsMoon = this.getApparentGeocentricEquatorialSphericalCoordinates();
        const coordsSun = this.sun.getApparentGeocentricEquatorialSphericalCoordinates();

        return getPhaseAngle(coordsMoon, coordsSun);
    }

    public getTopocentricPhaseAngle(location: Location): number {
        const coordsMoon = this.getApparentTopocentricEquatorialSphericalCoordinates(location);
        const coordsSun = this.sun.getApparentGeocentricEquatorialSphericalCoordinates();

        return getPhaseAngle(coordsMoon, coordsSun);
    }

    public getIlluminatedFraction(): number {
        const i = this.getPhaseAngle();

        return getIlluminatedFraction(i);
    }

    public getTopocentricIlluminatedFraction(location: Location): number {
        const i = this.getTopocentricPhaseAngle(location);

        return getIlluminatedFraction(i);
    }

    public getPositionAngleOfBrightLimb(): number {
        const coordsMoon = this.getApparentGeocentricEquatorialSphericalCoordinates();
        const coordsSun = this.sun.getApparentGeocentricEquatorialSphericalCoordinates();

        return getPositionAngleOfBrightLimb(coordsMoon, coordsSun);
    }

    public getTopocentricPositionAngleOfBrightLimb(location: Location): number {
        const coordsMoon = this.getApparentTopocentricEquatorialSphericalCoordinates(location);
        const coordsSun = this.sun.getApparentGeocentricEquatorialSphericalCoordinates();

        return getPositionAngleOfBrightLimb(coordsMoon, coordsSun);
    }

    public isWaxing(): boolean {
        const chi = this.getPositionAngleOfBrightLimb();

        return isWaxing(chi);
    }

    public isTopocentricWaxing(location: Location): boolean {
        const chi = this.getTopocentricPositionAngleOfBrightLimb(location);

        return isWaxing(chi);
    }

    public getApparentMagnitude(): number {
        const coordsHelio = this.getHeliocentricEclipticSphericalDateCoordinates();
        const coordsGeo = this.getGeocentricEclipticSphericalDateCoordinates();
        const i = this.getPhaseAngle();
        const waxing = this.isWaxing();

        return getApparentMagnitudeMoon(coordsHelio.radiusVector, coordsGeo.radiusVector, i, waxing);
    }

    public getTopocentricApparentMagnitude(location: Location): number {
        const coordsHelio = this.getHeliocentricEclipticSphericalDateCoordinates();
        const coordsGeo = this.getApparentTopocentricEquatorialSphericalCoordinates(location);
        const i = this.getTopocentricPhaseAngle(location);
        const waxing = this.isTopocentricWaxing(location);

        return getApparentMagnitudeMoon(coordsHelio.radiusVector, coordsGeo.radiusVector, i, waxing);
    }

    public getUpcomingNewMoon(): TimeOfInterest {
        const decimalYear = this.toi.getDecimalYear();

        return getTimeOfInterestOfUpcomingPhase(decimalYear, MOON_PHASE_NEW_MOON);
    }

    public getUpcomingFirstQuarter(): TimeOfInterest {
        const decimalYear = this.toi.getDecimalYear();

        return getTimeOfInterestOfUpcomingPhase(decimalYear, MOON_PHASE_FIRST_QUARTER);
    }

    public getUpcomingFullMoon(): TimeOfInterest {
        const decimalYear = this.toi.getDecimalYear();

        return getTimeOfInterestOfUpcomingPhase(decimalYear, MOON_PHASE_FULL_MOON);
    }

    public getUpcomingLastQuarter(): TimeOfInterest {
        const decimalYear = this.toi.getDecimalYear();

        return getTimeOfInterestOfUpcomingPhase(decimalYear, MOON_PHASE_LAST_QUARTER);
    }

    public getSubEarthPoint(): SelenographicLocation {
        const coords = this.getGeocentricEclipticSphericalDateCoordinates();

        return getSelenographicLocation(coords, this.T);
    }

    public getSubSolarPoint(): SelenographicLocation {
        const coords = this.getHeliocentricEclipticSphericalDateCoordinates();

        return getSelenographicLocation(coords, this.T);
    }

    public getOpticalLibration(): SelenographicLocation {
        const coords = this.getGeocentricEclipticSphericalDateCoordinates();

        return getOpticalSelenographicLocation(coords, this.T);
    }

    public getTopocentricLibration(location: Location): SelenographicLocation {
        const coords = equatorialSpherical2eclipticSpherical(
            this.getApparentTopocentricEquatorialSphericalCoordinates(location),
            this.T,
        );

        return getSelenographicLocation(coords, this.T);
    }
}
