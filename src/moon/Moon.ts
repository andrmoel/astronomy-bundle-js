import {moonCalc, moonPhaseCalc, observationCalc} from '../utils';
import AstronomicalObject from '../astronomicalObject/AstronomicalObject';
import IEclipticSphericalCoordinates from '../coordinates/interfaces/IEclipticSphericalCoordinates';
import IEquatorialSphericalCoordinates from '../coordinates/interfaces/IEquatorialSphericalCoordinates';
import IRectangularCoordinates from '../coordinates/interfaces/IRectangularCoordinates';
import TimeOfInterest from '../time/TimeOfInterest';
import {
    MOON_PHASE_FIRST_QUARTER,
    MOON_PHASE_FULL_MOON,
    MOON_PHASE_LAST_QUARTER,
    MOON_PHASE_NEW_MOON
} from '../constants/moonPhase';
import {DIAMETER_MOON} from '../constants/diameters';
import {getPhaseAngle} from '../utils/observationCalc';
import {createSun} from '../sun';
import Sun from '../sun/Sun';
import {
    ecliptic2apparentEcliptic,
    eclipticSpherical2equatorialSpherical,
    spherical2rectangular
} from '../utils/coordinateCalc';

export default class Moon extends AstronomicalObject {
    private sun: Sun;

    constructor(toi?: TimeOfInterest) {
        super(toi);

        this.sun = createSun(toi);
    }

    public async getGeocentricRectangularDateCoordinates(): Promise<IRectangularCoordinates> {
        const {lon, lat, radiusVector} = await this.getGeocentricEclipticSphericalDateCoordinates();

        return spherical2rectangular(lon, lat, radiusVector);
    }

    public async getGeocentricEclipticSphericalDateCoordinates(): Promise<IEclipticSphericalCoordinates> {
        const lon = moonCalc.getLongitude(this.T);
        const lat = moonCalc.getLatitude(this.T);
        const radiusVector = moonCalc.getRadiusVector(this.T);

        return new Promise((resolve) => {
            resolve({lon, lat, radiusVector});
        });
    }

    public async getApparentGeocentricEclipticSphericalDateCoordinates(): Promise<IEclipticSphericalCoordinates> {
        const {lon, lat, radiusVector} = await this.getGeocentricEclipticSphericalDateCoordinates();

        return ecliptic2apparentEcliptic(lon, lat, radiusVector, this.T);
    }

    public async getGeocentricEquatorialSphericalCoordinates(): Promise<IEquatorialSphericalCoordinates> {
        const {lon, lat, radiusVector} = await this.getGeocentricEclipticSphericalDateCoordinates();

        return eclipticSpherical2equatorialSpherical(lon, lat, radiusVector, this.T);
    }

    public async getApparentGeocentricEquatorialSphericalCoordinates(): Promise<IEquatorialSphericalCoordinates> {
        const {lon, lat, radiusVector} = await this.getApparentGeocentricEclipticSphericalDateCoordinates();

        return eclipticSpherical2equatorialSpherical(lon, lat, radiusVector, this.T);
    }

    public async getDistanceToEarth(): Promise<number> {
        const d = moonCalc.getDistanceToEarth(this.T);

        return new Promise((resolve) => {
            resolve(d);
        });
    }

    public async getAngularDiameter(): Promise<number> {
        const distance = await this.getDistanceToEarth();

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
