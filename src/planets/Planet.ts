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
import {
    correctEffectOfAberration,
    correctEffectOfNutation,
    getLightTimeCorrectedJulianDay
} from '../utils/apparentCoordinateCalc';
import {createTimeOfInterest} from '../time';
import Mercury from './Mercury';
import Venus from './Venus';
import Mars from './Mars';
import Jupiter from './Jupiter';
import Saturn from './Saturn';
import Uranus from './Uranus';
import Neptune from './Neptune';

export default abstract class Planet extends AstronomicalObject implements IPlanet {
    private earth: Earth;

    constructor(toi?: TimeOfInterest) {
        super(toi);

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

    public abstract async getHeliocentricEclipticSphericalJ2000Coordinates(): Promise<IEclipticSphericalCoordinates>;

    public abstract async getHeliocentricEclipticSphericalDateCoordinates(): Promise<IEclipticSphericalCoordinates>;

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

    public async getPhaseAngle(): Promise<number> {
        const sun = createSun(this.toi);
        const coords = await this.getApparentGeocentricEquatorialSphericalCoordinates();
        const coordsSun = await sun.getApparentGeocentricEquatorialSphericalCoordinates();

        return observationCalc.getPhaseAngle(coords, coordsSun);
    }

    public async getIlluminatedFraction(): Promise<number> {
        const i = await this.getPhaseAngle();

        return observationCalc.getIlluminatedFraction(i);
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
