import {moonCalc, moonPhaseCalc, observationCalc} from '../utils';
import AstronomicalObject from '../astronomicalObject/AstronomicalObject';
import IEclipticSphericalCoordinates from '../coordinates/interfaces/IEclipticSphericalCoordinates';
import IRectangularCoordinates from '../coordinates/interfaces/IRectangularCoordinates';
import TimeOfInterest from '../time/TimeOfInterest';
import {
    MOON_PHASE_FIRST_QUARTER,
    MOON_PHASE_FULL_MOON,
    MOON_PHASE_LAST_QUARTER,
    MOON_PHASE_NEW_MOON
} from '../constants/moonPhase';
import {DIAMETER_MOON} from '../constants/diameters';
import {getApparentMagnitudeMoon} from '../utils/magnitudeCalc';
import {
    rectangular2spherical,
    rectangularGeocentric2rectangularHeliocentric,
    spherical2rectangular
} from '../utils/coordinateCalc';
import {correctEffectOfNutation} from '../utils/apparentCoordinateCalc';
import Sun from '../sun/Sun';
import Earth from '../earth/Earth';
import createSun from '../sun/createSun';
import createEarth from '../earth/createEarth';
import ILocation from '../earth/interfaces/ILocation';
import {getRise, getSet, getTransit} from '../utils/riseSetTransitCalc';
import {createTimeOfInterest} from '../time';
import {STANDARD_ALTITUDE_MOON_CENTER_REFRACTION} from '../constants/standardAltitude';

export default class Moon extends AstronomicalObject {
    private sun: Sun;
    private earth: Earth;

    constructor(toi?: TimeOfInterest) {
        super(toi);

        this.sun = createSun(toi);
        this.earth = createEarth(toi);
    }

    public async getHeliocentricEclipticRectangularJ2000Coordinates(): Promise<IRectangularCoordinates> {
        return await this.getHeliocentricEclipticRectangularDateCoordinates();
    }

    public async getHeliocentricEclipticRectangularDateCoordinates(): Promise<IRectangularCoordinates> {
        const geocentricCoords = await this.getGeocentricEclipticRectangularDateCoordinates();
        const heliocentricCoordsEarth = await this.earth.getHeliocentricEclipticRectangularDateCoordinates();

        return rectangularGeocentric2rectangularHeliocentric(geocentricCoords, heliocentricCoordsEarth);
    }

    public async getHeliocentricEclipticSphericalJ2000Coordinates(): Promise<IEclipticSphericalCoordinates> {
        return await this.getHeliocentricEclipticSphericalDateCoordinates();
    }

    public async getHeliocentricEclipticSphericalDateCoordinates(): Promise<IEclipticSphericalCoordinates> {
        const {x, y, z} = await this.getHeliocentricEclipticRectangularDateCoordinates();

        return rectangular2spherical(x, y, z);
    }

    public async getGeocentricEclipticRectangularJ2000Coordinates(): Promise<IRectangularCoordinates> {
        return await this.getGeocentricEclipticRectangularDateCoordinates();
    }

    public async getGeocentricEclipticRectangularDateCoordinates(): Promise<IRectangularCoordinates> {
        const {lon, lat, radiusVector} = await this.getGeocentricEclipticSphericalDateCoordinates();

        return spherical2rectangular(lon, lat, radiusVector);
    }

    public async getGeocentricEclipticSphericalJ2000Coordinates(): Promise<IEclipticSphericalCoordinates> {
        return await this.getGeocentricEclipticSphericalDateCoordinates();
    }

    public async getGeocentricEclipticSphericalDateCoordinates(): Promise<IEclipticSphericalCoordinates> {
        const lon = moonCalc.getLongitude(this.T);
        const lat = moonCalc.getLatitude(this.T);
        const radiusVector = moonCalc.getRadiusVector(this.T);

        return Promise.resolve({lon, lat, radiusVector});
    }

    public async getApparentGeocentricEclipticSphericalCoordinates(): Promise<IEclipticSphericalCoordinates> {
        const coords = await this.getGeocentricEclipticSphericalDateCoordinates();

        return correctEffectOfNutation(coords, this.T);
    }

    public async getTransit(location: ILocation): Promise<TimeOfInterest> {
        const jd = await getTransit(this.constructor, location, this.jd0);

        return createTimeOfInterest.fromJulianDay(jd);
    }

    public async getRise(location: ILocation): Promise<TimeOfInterest> {
        const jd = await getRise(this.constructor, location, this.jd0, STANDARD_ALTITUDE_MOON_CENTER_REFRACTION);

        return createTimeOfInterest.fromJulianDay(jd);
    }

    public async getSet(location: ILocation): Promise<TimeOfInterest> {
        const jd = await getSet(this.constructor, location, this.jd0, STANDARD_ALTITUDE_MOON_CENTER_REFRACTION);

        return createTimeOfInterest.fromJulianDay(jd);
    }

    public async getAngularDiameter(): Promise<number> {
        const distance = await this.getApparentDistanceToEarth();

        return observationCalc.getAngularDiameter(distance, DIAMETER_MOON);
    }

    public async getTopocentricAngularDiameter(location: ILocation): Promise<number> {
        const distance = await this.getTopocentricDistanceToEarth(location);

        return observationCalc.getAngularDiameter(distance, DIAMETER_MOON);
    }

    public async getPhaseAngle(): Promise<number> {
        const coordsMoon = await this.getApparentGeocentricEquatorialSphericalCoordinates();
        const coordsSun = await this.sun.getApparentGeocentricEquatorialSphericalCoordinates();

        return observationCalc.getPhaseAngle(coordsMoon, coordsSun);
    }

    public async getTopocentricPhaseAngle(location: ILocation): Promise<number> {
        const coordsMoon = await this.getTopocentricEquatorialSphericalCoordinates(location);
        const coordsSun = await this.sun.getApparentGeocentricEquatorialSphericalCoordinates();

        return observationCalc.getPhaseAngle(coordsMoon, coordsSun);
    }

    public async getIlluminatedFraction(): Promise<number> {
        const i = await this.getPhaseAngle();

        return observationCalc.getIlluminatedFraction(i);
    }

    public async getTopocentricIlluminatedFraction(location: ILocation): Promise<number> {
        const i = await this.getTopocentricPhaseAngle(location);

        return observationCalc.getIlluminatedFraction(i);
    }

    public async getPositionAngleOfBrightLimb(): Promise<number> {
        const coordsMoon = await this.getApparentGeocentricEquatorialSphericalCoordinates();
        const coordsSun = await this.sun.getApparentGeocentricEquatorialSphericalCoordinates();

        return observationCalc.getPositionAngleOfBrightLimb(coordsMoon, coordsSun);
    }

    public async getTopocentricPositionAngleOfBrightLimb(location: ILocation): Promise<number> {
        const coordsMoon = await this.getTopocentricEquatorialSphericalCoordinates(location);
        const coordsSun = await this.sun.getApparentGeocentricEquatorialSphericalCoordinates();

        return observationCalc.getPositionAngleOfBrightLimb(coordsMoon, coordsSun);
    }

    public async isWaxing(): Promise<boolean> {
        const chi = await this.getPositionAngleOfBrightLimb();

        return observationCalc.isWaxing(chi);
    }

    public async isTopocentricWaxing(location: ILocation): Promise<boolean> {
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

    public async getTopocentricApparentMagnitude(location: ILocation): Promise<number> {
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
