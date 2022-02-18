import {observationCalc} from '../utils';
import AstronomicalObject from '../astronomicalObject/AstronomicalObject';
import {EclipticSphericalCoordinates, RectangularCoordinates} from '../coordinates/types/CoordinateTypes';
import TimeOfInterest from '../time/TimeOfInterest';
import {
    rectangular2spherical,
    rectangularGeocentric2rectangularHeliocentric,
    spherical2rectangular,
} from '../coordinates/calculations/coordinateCalc';
import {correctEffectOfNutation} from '../coordinates/calculations/apparentCoordinateCalc';
import Sun from '../sun/Sun';
import Earth from '../earth/Earth';
import createSun from '../sun/createSun';
import createEarth from '../earth/createEarth';
import {Location} from '../earth/types/LocationTypes';
import {getRise, getSet, getTransit} from '../utils/riseSetTransitCalc';
import {createTimeOfInterest} from '../time';
import {STANDARD_ALTITUDE_MOON_CENTER_REFRACTION} from '../constants/standardAltitude';
import {getApparentMagnitudeMoon} from './calculations/magnitudeCalc';
import {moonCalc, moonPhaseCalc} from './calculations';
import {
    MOON_PHASE_FIRST_QUARTER,
    MOON_PHASE_FULL_MOON,
    MOON_PHASE_LAST_QUARTER,
    MOON_PHASE_NEW_MOON,
} from './constants/moonPhases';
import {DIAMETER_MOON} from './constants/diameters';

export default class Moon extends AstronomicalObject {
    private readonly sun: Sun;

    private readonly earth: Earth;

    public constructor(toi?: TimeOfInterest) {
        super(toi, 'moon');

        this.sun = createSun(toi);
        this.earth = createEarth(toi);
    }

    public async getHeliocentricEclipticRectangularJ2000Coordinates(): Promise<RectangularCoordinates> {
        return await this.getHeliocentricEclipticRectangularDateCoordinates();
    }

    public async getHeliocentricEclipticRectangularDateCoordinates(): Promise<RectangularCoordinates> {
        const geocentricCoords = await this.getGeocentricEclipticRectangularDateCoordinates();
        const heliocentricCoordsEarth = await this.earth.getHeliocentricEclipticRectangularDateCoordinates();

        return rectangularGeocentric2rectangularHeliocentric(geocentricCoords, heliocentricCoordsEarth);
    }

    public async getHeliocentricEclipticSphericalJ2000Coordinates(): Promise<EclipticSphericalCoordinates> {
        return await this.getHeliocentricEclipticSphericalDateCoordinates();
    }

    public async getHeliocentricEclipticSphericalDateCoordinates(): Promise<EclipticSphericalCoordinates> {
        const coords = await this.getHeliocentricEclipticRectangularDateCoordinates();

        return rectangular2spherical(coords);
    }

    public async getGeocentricEclipticRectangularJ2000Coordinates(): Promise<RectangularCoordinates> {
        return await this.getGeocentricEclipticRectangularDateCoordinates();
    }

    public async getGeocentricEclipticRectangularDateCoordinates(): Promise<RectangularCoordinates> {
        const coords = await this.getGeocentricEclipticSphericalDateCoordinates();

        return spherical2rectangular(coords);
    }

    public async getGeocentricEclipticSphericalJ2000Coordinates(): Promise<EclipticSphericalCoordinates> {
        return await this.getGeocentricEclipticSphericalDateCoordinates();
    }

    public async getGeocentricEclipticSphericalDateCoordinates(): Promise<EclipticSphericalCoordinates> {
        const lon = moonCalc.getLongitude(this.T);
        const lat = moonCalc.getLatitude(this.T);
        const radiusVector = moonCalc.getRadiusVector(this.T);

        return Promise.resolve({lon, lat, radiusVector});
    }

    public async getApparentGeocentricEclipticSphericalCoordinates(): Promise<EclipticSphericalCoordinates> {
        const coords = await this.getGeocentricEclipticSphericalDateCoordinates();

        return correctEffectOfNutation(coords, this.T);
    }

    public async getTransit(location: Location): Promise<TimeOfInterest> {
        const jd = await getTransit(Moon, location, this.jd0);

        return createTimeOfInterest.fromJulianDay(jd);
    }

    public async getRise(
        location: Location,
        standardAltitude: number = STANDARD_ALTITUDE_MOON_CENTER_REFRACTION,
    ): Promise<TimeOfInterest> {
        const jd = await getRise(Moon, location, this.jd0, standardAltitude);

        return createTimeOfInterest.fromJulianDay(jd);
    }

    public async getSet(
        location: Location,
        standardAltitude: number = STANDARD_ALTITUDE_MOON_CENTER_REFRACTION,
    ): Promise<TimeOfInterest> {
        const jd = await getSet(Moon, location, this.jd0, standardAltitude);

        return createTimeOfInterest.fromJulianDay(jd);
    }

    public async getAngularDiameter(): Promise<number> {
        const distance = await this.getApparentDistanceToEarth();

        return observationCalc.getAngularDiameter(distance, DIAMETER_MOON);
    }

    public async getTopocentricAngularDiameter(location: Location): Promise<number> {
        const distance = await this.getTopocentricDistanceToEarth(location);

        return observationCalc.getAngularDiameter(distance, DIAMETER_MOON);
    }

    public async getElongation(): Promise<number> {
        const coordsMoon = await this.getApparentGeocentricEquatorialSphericalCoordinates();
        const coordsSun = await this.sun.getApparentGeocentricEquatorialSphericalCoordinates();

        return observationCalc.getElongation(coordsMoon, coordsSun);
    }

    public async getTopocentricElongation(location: Location): Promise<number> {
        const coordsMoon = await this.getTopocentricEquatorialSphericalCoordinates(location);
        const coordsSun = await this.sun.getApparentGeocentricEquatorialSphericalCoordinates();

        return observationCalc.getElongation(coordsMoon, coordsSun);
    }

    public async getPhaseAngle(): Promise<number> {
        const coordsMoon = await this.getApparentGeocentricEquatorialSphericalCoordinates();
        const coordsSun = await this.sun.getApparentGeocentricEquatorialSphericalCoordinates();

        return observationCalc.getPhaseAngle(coordsMoon, coordsSun);
    }

    public async getTopocentricPhaseAngle(location: Location): Promise<number> {
        const coordsMoon = await this.getTopocentricEquatorialSphericalCoordinates(location);
        const coordsSun = await this.sun.getApparentGeocentricEquatorialSphericalCoordinates();

        return observationCalc.getPhaseAngle(coordsMoon, coordsSun);
    }

    public async getIlluminatedFraction(): Promise<number> {
        const i = await this.getPhaseAngle();

        return observationCalc.getIlluminatedFraction(i);
    }

    public async getTopocentricIlluminatedFraction(location: Location): Promise<number> {
        const i = await this.getTopocentricPhaseAngle(location);

        return observationCalc.getIlluminatedFraction(i);
    }

    public async getPositionAngleOfBrightLimb(): Promise<number> {
        const coordsMoon = await this.getApparentGeocentricEquatorialSphericalCoordinates();
        const coordsSun = await this.sun.getApparentGeocentricEquatorialSphericalCoordinates();

        return observationCalc.getPositionAngleOfBrightLimb(coordsMoon, coordsSun);
    }

    public async getTopocentricPositionAngleOfBrightLimb(location: Location): Promise<number> {
        const coordsMoon = await this.getTopocentricEquatorialSphericalCoordinates(location);
        const coordsSun = await this.sun.getApparentGeocentricEquatorialSphericalCoordinates();

        return observationCalc.getPositionAngleOfBrightLimb(coordsMoon, coordsSun);
    }

    public async isWaxing(): Promise<boolean> {
        const chi = await this.getPositionAngleOfBrightLimb();

        return observationCalc.isWaxing(chi);
    }

    public async isTopocentricWaxing(location: Location): Promise<boolean> {
        const chi = await this.getTopocentricPositionAngleOfBrightLimb(location);

        return observationCalc.isWaxing(chi);
    }

    public async getApparentMagnitude(): Promise<number> {
        const coordsHelio = await this.getHeliocentricEclipticSphericalDateCoordinates();
        const coordsGeo = await this.getGeocentricEclipticSphericalDateCoordinates();
        const i = await this.getPhaseAngle();
        const isWaxing = await this.isWaxing();

        return getApparentMagnitudeMoon(coordsHelio.radiusVector, coordsGeo.radiusVector, i, isWaxing);
    }

    public async getTopocentricApparentMagnitude(location: Location): Promise<number> {
        const coordsHelio = await this.getHeliocentricEclipticSphericalDateCoordinates();
        const coordsGeo = await this.getTopocentricEquatorialSphericalCoordinates(location);
        const i = await this.getTopocentricPhaseAngle(location);
        const isWaxing = await this.isTopocentricWaxing(location);

        return getApparentMagnitudeMoon(coordsHelio.radiusVector, coordsGeo.radiusVector, i, isWaxing);
    }

    public getUpcomingNewMoon(): TimeOfInterest {
        const decimalYear = this.toi.getDecimalYear();

        return moonPhaseCalc.getTimeOfInterestOfUpcomingPhase(decimalYear, MOON_PHASE_NEW_MOON);
    }

    public getUpcomingFirstQuarter(): TimeOfInterest {
        const decimalYear = this.toi.getDecimalYear();

        return moonPhaseCalc.getTimeOfInterestOfUpcomingPhase(decimalYear, MOON_PHASE_FIRST_QUARTER);
    }

    public getUpcomingFullMoon(): TimeOfInterest {
        const decimalYear = this.toi.getDecimalYear();

        return moonPhaseCalc.getTimeOfInterestOfUpcomingPhase(decimalYear, MOON_PHASE_FULL_MOON);
    }

    public getUpcomingLastQuarter(): TimeOfInterest {
        const decimalYear = this.toi.getDecimalYear();

        return moonPhaseCalc.getTimeOfInterestOfUpcomingPhase(decimalYear, MOON_PHASE_LAST_QUARTER);
    }
}
