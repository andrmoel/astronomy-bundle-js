import {coordinateCalc, moonCalc, moonPhaseCalc} from '../utils';
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

export default class Moon extends AstronomicalObject {
    public getGeocentricEclipticSphericalCoordinates(): IEclipticSphericalCoordinates {
        const lon = moonCalc.getApparentLongitude(this.T);
        const lat = moonCalc.getLatitude(this.T);
        const radiusVector = moonCalc.getRadiusVector(this.T);

        return {lon, lat, radiusVector};
    }

    public getGeocentricEquatorialSphericalCoordinates(): IEquatorialSphericalCoordinates {
        const {lon, lat, radiusVector} = this.getGeocentricEclipticSphericalCoordinates();

        return coordinateCalc.eclipticSpherical2equatorialSpherical(lon, lat, radiusVector, this.T);
    }

    public getGeocentricEquatorialRectangularCoordinates(): IRectangularCoordinates {
        const {rightAscension, declination, radiusVector} = this.getGeocentricEquatorialSphericalCoordinates();

        return coordinateCalc.spherical2rectangular(rightAscension, declination, radiusVector);
    }

    public getDistanceToEarth(): number {
        return moonCalc.getDistanceToEarth(this.T);
    }

    public getPhaseAngle(): number {
        return moonCalc.getPhaseAngle(this.T);
    }

    public getIllumination(): number {
        return moonCalc.getIllumination(this.T);
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
