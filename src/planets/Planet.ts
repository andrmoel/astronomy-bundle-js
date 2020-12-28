import {
    rectangular2spherical,
    rectangularHeliocentric2rectangularGeocentric,
    spherical2rectangular
} from '../utils/coordinateCalc';
import AstronomicalObject from '../astronomicalObject/AstronomicalObject';
import IRectangularCoordinates from '../coordinates/interfaces/IRectangularCoordinates';
import IEclipticSphericalCoordinates from '../coordinates/interfaces/IEclipticSphericalCoordinates';
import IPlanet from './interfaces/IPlanet';
import {observationCalc} from '../utils';
import {createSun} from '../sun';
import TimeOfInterest from '../time/TimeOfInterest';
import {createEarth} from '../earth';
import Earth from '../earth/Earth';
import Sun from '../sun/Sun';
import {
    correctEffectOfAberration,
    correctEffectOfNutation,
    getLightTimeCorrectedJulianDay
} from '../utils/apparentCoordinateCalc';
import {createTimeOfInterest} from '../time';
import {getRise, getSet, getTransit} from '../utils/riseSetTransitCalc';
import ILocation from '../earth/interfaces/ILocation';
import {STANDARD_ALTITUDE_PLANET_REFRACTION} from '../constants/standardAltitude';
import Mercury from './Mercury';
import Venus from './Venus';
import Mars from './Mars';
import Jupiter from './Jupiter';
import Saturn from './Saturn';
import Uranus from './Uranus';
import Neptune from './Neptune';

export default abstract class Planet extends AstronomicalObject implements IPlanet {
    private sun: Sun;
    private earth: Earth;

    constructor(toi?: TimeOfInterest, protected useVsop87Short: boolean = false) {
        super(toi);

        this.sun = createSun(toi);
        this.earth = createEarth(toi);
    }

    public async getHeliocentricEclipticRectangularJ2000Coordinates(): Promise<IRectangularCoordinates> {
        const {lon, lat, radiusVector} = await this.getHeliocentricEclipticSphericalJ2000Coordinates();

        return spherical2rectangular(lon, lat, radiusVector);
    }

    public async getHeliocentricEclipticRectangularDateCoordinates(): Promise<IRectangularCoordinates> {
        const {lon, lat, radiusVector} = await this.getHeliocentricEclipticSphericalDateCoordinates();

        return spherical2rectangular(lon, lat, radiusVector);
    }

    public abstract getHeliocentricEclipticSphericalJ2000Coordinates(): Promise<IEclipticSphericalCoordinates>;

    public abstract getHeliocentricEclipticSphericalDateCoordinates(): Promise<IEclipticSphericalCoordinates>;

    public async getGeocentricEclipticRectangularJ2000Coordinates(): Promise<IRectangularCoordinates> {
        const coordsPlanet = await this.getHeliocentricEclipticRectangularJ2000Coordinates();
        const coordsEarth = await this.earth.getHeliocentricEclipticRectangularJ2000Coordinates();

        return rectangularHeliocentric2rectangularGeocentric(coordsPlanet, coordsEarth);
    }

    public async getGeocentricEclipticRectangularDateCoordinates(): Promise<IRectangularCoordinates> {
        const coordsPlanet = await this.getHeliocentricEclipticRectangularDateCoordinates();
        const coordsEarth = await this.earth.getHeliocentricEclipticRectangularDateCoordinates();

        return rectangularHeliocentric2rectangularGeocentric(coordsPlanet, coordsEarth);
    }

    public async getGeocentricEclipticSphericalJ2000Coordinates(): Promise<IEclipticSphericalCoordinates> {
        const {x, y, z} = await this.getGeocentricEclipticRectangularJ2000Coordinates();

        return rectangular2spherical(x, y, z);
    }

    public async getGeocentricEclipticSphericalDateCoordinates(): Promise<IEclipticSphericalCoordinates> {
        const {x, y, z} = await this.getGeocentricEclipticRectangularDateCoordinates();

        return rectangular2spherical(x, y, z);
    }

    public async getApparentGeocentricEclipticSphericalCoordinates(): Promise<IEclipticSphericalCoordinates> {
        let coords = await this.getLightTimeCorrectedEclipticSphericalCoordinates();

        coords = correctEffectOfAberration(coords, this.T);
        coords = correctEffectOfNutation(coords, this.T);

        return coords;
    }

    public async getTransit(location: ILocation): Promise<TimeOfInterest> {
        const jd = await getTransit(this.constructor, location, this.jd0);

        return createTimeOfInterest.fromJulianDay(jd);
    }

    public async getRise(location: ILocation): Promise<TimeOfInterest> {
        const jd = await getRise(this.constructor, location, this.jd0, STANDARD_ALTITUDE_PLANET_REFRACTION);

        return createTimeOfInterest.fromJulianDay(jd);
    }

    public async getSet(location: ILocation): Promise<TimeOfInterest> {
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

    private async getLightTimeCorrectedEclipticSphericalCoordinates(): Promise<IEclipticSphericalCoordinates> {
        const {radiusVector} = await this.getGeocentricEclipticSphericalDateCoordinates();

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

        const {x, y, z} = rectangularHeliocentric2rectangularGeocentric(helRecPlanetCoords, helRecEarthCoords);

        return rectangular2spherical(x, y, z);
    }
}
