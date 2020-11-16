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
import {getApparentMagnitudeMoon, getPhaseAngle} from '../utils/observationCalc';
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

    async getApparentGeocentricEclipticSphericalCoordinates(): Promise<IEclipticSphericalCoordinates> {
        const coords = await this.getGeocentricEclipticSphericalDateCoordinates();

        return correctEffectOfNutation(coords, this.T);
    }

    public async getAngularDiameter(): Promise<number> {
        const distance = await this.getApparentDistanceToEarth();

        return observationCalc.getAngularDiameter(distance, DIAMETER_MOON);
    }

    public async getPhaseAngle(): Promise<number> {
        const coordsMoon = await this.getApparentGeocentricEquatorialSphericalCoordinates();
        const coordsSun = await this.sun.getApparentGeocentricEquatorialSphericalCoordinates();

        return getPhaseAngle(coordsMoon, coordsSun);
    }

    public async getIlluminatedFraction(): Promise<number> {
        const i = await this.getPhaseAngle();

        return observationCalc.getIlluminatedFraction(i);
    }

    public async getApparentMagnitudeMoon(): Promise<number> {
        const coordsHelio = await this.getHeliocentricEclipticSphericalDateCoordinates();
        const coordsGeo = await this.getGeocentricEclipticSphericalDateCoordinates();
        const i = await this.getPhaseAngle();

        return getApparentMagnitudeMoon(coordsHelio.radiusVector, coordsGeo.radiusVector, i);
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
