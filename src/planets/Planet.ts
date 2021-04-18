import IPlanet from './interfaces/IPlanet';
import Jupiter from './Jupiter';
import Mars from './Mars';
import Mercury from './Mercury';
import Neptune from './Neptune';
import Saturn from './Saturn';
import Uranus from './Uranus';
import Venus from './Venus';
import AstronomicalObject from '../astronomicalObject/AstronomicalObject';
import { STANDARD_ALTITUDE_PLANET_REFRACTION } from '../constants/standardAltitude';
import { RectangularCoordinates } from '../coordinates/coordinateTypes';
import { EclipticSphericalCoordinates } from '../coordinates/coordinateTypes';
import { createEarth } from '../earth';
import Earth from '../earth/Earth';
import { Location } from '../earth/LocationTypes';
import { createSun } from '../sun';
import Sun from '../sun/Sun';
import { createTimeOfInterest } from '../time';
import TimeOfInterest from '../time/TimeOfInterest';
import { observationCalc } from '../utils';
import { correctEffectOfAberration, correctEffectOfNutation, getLightTimeCorrectedJulianDay } from '../utils/apparentCoordinateCalc';
import { rectangular2spherical, rectangularHeliocentric2rectangularGeocentric, spherical2rectangular } from '../utils/coordinateCalc';
import { getRise, getSet, getTransit } from '../utils/riseSetTransitCalc';

export default abstract class Planet extends AstronomicalObject implements IPlanet {

    private readonly sun: Sun;

    private readonly earth: Earth;

    constructor(name: string, toi?: TimeOfInterest, protected useVsop87Short: boolean = false) {
        super(name, toi);

        this.sun = createSun(toi);
        this.earth = createEarth(toi);
    }

    public async getHeliocentricEclipticRectangularJ2000Coordinates(): Promise<RectangularCoordinates> {
        const coords = await this.getHeliocentricEclipticSphericalJ2000Coordinates();

        return spherical2rectangular(coords);
    }

    public async getHeliocentricEclipticRectangularDateCoordinates(): Promise<RectangularCoordinates> {
        const coords = await this.getHeliocentricEclipticSphericalDateCoordinates();

        return spherical2rectangular(coords);
    }

    public abstract getHeliocentricEclipticSphericalJ2000Coordinates(): Promise<EclipticSphericalCoordinates>;

    public abstract getHeliocentricEclipticSphericalDateCoordinates(): Promise<EclipticSphericalCoordinates>;

    public async getGeocentricEclipticRectangularJ2000Coordinates(): Promise<RectangularCoordinates> {
        const coordsPlanet = await this.getHeliocentricEclipticRectangularJ2000Coordinates();
        const coordsEarth = await this.earth.getHeliocentricEclipticRectangularJ2000Coordinates();

        return rectangularHeliocentric2rectangularGeocentric(coordsPlanet, coordsEarth);
    }

    public async getGeocentricEclipticRectangularDateCoordinates(): Promise<RectangularCoordinates> {
        const coordsPlanet = await this.getHeliocentricEclipticRectangularDateCoordinates();
        const coordsEarth = await this.earth.getHeliocentricEclipticRectangularDateCoordinates();

        return rectangularHeliocentric2rectangularGeocentric(coordsPlanet, coordsEarth);
    }

    public async getGeocentricEclipticSphericalJ2000Coordinates(): Promise<EclipticSphericalCoordinates> {
        const coords = await this.getGeocentricEclipticRectangularJ2000Coordinates();

        return rectangular2spherical(coords);
    }

    public async getGeocentricEclipticSphericalDateCoordinates(): Promise<EclipticSphericalCoordinates> {
        const coords = await this.getGeocentricEclipticRectangularDateCoordinates();

        return rectangular2spherical(coords);
    }

    public async getApparentGeocentricEclipticSphericalCoordinates(): Promise<EclipticSphericalCoordinates> {
        let coords = await this.getLightTimeCorrectedEclipticSphericalCoordinates();

        coords = correctEffectOfAberration(coords, this.T);
        coords = correctEffectOfNutation(coords, this.T);

        return coords;
    }

    public async getTransit(location: Location): Promise<TimeOfInterest> {
        const jd = await getTransit(this.constructor, location, this.jd0);

        return createTimeOfInterest.fromJulianDay(jd);
    }

    public async getRise(location: Location): Promise<TimeOfInterest> {
        const jd = await getRise(this.constructor, location, this.jd0, STANDARD_ALTITUDE_PLANET_REFRACTION);

        return createTimeOfInterest.fromJulianDay(jd);
    }

    public async getSet(location: Location): Promise<TimeOfInterest> {
        const jd = await getSet(this.constructor, location, this.jd0, STANDARD_ALTITUDE_PLANET_REFRACTION);

        return createTimeOfInterest.fromJulianDay(jd);
    }

    public async getElongation(): Promise<number> {
        const coords = await this.getApparentGeocentricEquatorialSphericalCoordinates();
        const coordsSun = await this.sun.getApparentGeocentricEquatorialSphericalCoordinates();

        return observationCalc.getElongation(coords, coordsSun);
    }

    public async getPhaseAngle(): Promise<number> {
        const coords = await this.getApparentGeocentricEquatorialSphericalCoordinates();
        const coordsSun = await this.sun.getApparentGeocentricEquatorialSphericalCoordinates();

        return observationCalc.getPhaseAngle(coords, coordsSun);
    }

    public async getIlluminatedFraction(): Promise<number> {
        const i = await this.getPhaseAngle();

        return observationCalc.getIlluminatedFraction(i);
    }

    public async getPositionAngleOfBrightLimb(): Promise<number> {
        const coordsPlanet = await this.getApparentGeocentricEquatorialSphericalCoordinates();
        const coordsSun = await this.sun.getApparentGeocentricEquatorialSphericalCoordinates();

        return observationCalc.getPositionAngleOfBrightLimb(coordsPlanet, coordsSun);
    }

    public async isWaxing(): Promise<boolean> {
        const chi = await this.getPositionAngleOfBrightLimb();

        return observationCalc.isWaxing(chi);
    }

    private async getLightTimeCorrectedEclipticSphericalCoordinates(): Promise<EclipticSphericalCoordinates> {
        const { radiusVector } = await this.getGeocentricEclipticSphericalDateCoordinates();

        const jd = getLightTimeCorrectedJulianDay(this.jd, radiusVector);
        const toi = createTimeOfInterest.fromJulianDay(jd);
        const planet = new (<
            typeof Mercury
            | typeof Venus
            | typeof Earth
            | typeof Mars
            | typeof Jupiter
            | typeof Saturn
            | typeof Uranus
            | typeof Neptune
            >this.constructor)(toi);

        const helRecEarthCoords = await this.earth.getHeliocentricEclipticRectangularDateCoordinates();
        const helRecPlanetCoords = await planet.getHeliocentricEclipticRectangularDateCoordinates();

        const coords = rectangularHeliocentric2rectangularGeocentric(helRecPlanetCoords, helRecEarthCoords);

        return rectangular2spherical(coords);
    }
}
