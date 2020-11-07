import {
    ecliptic2apparentEcliptic,
    eclipticSpherical2equatorialSpherical,
    rectangular2spherical,
    rectangularHeliocentric2rectangularGeocentric
} from '../utils/coordinateCalc';
import AstronomicalObject from '../astronomicalObject/AstronomicalObject';
import IRectangularCoordinates from '../coordinates/interfaces/IRectangularCoordinates';
import IEclipticSphericalCoordinates from '../coordinates/interfaces/IEclipticSphericalCoordinates';
import IEquatorialSphericalCoordinates from '../coordinates/interfaces/IEquatorialSphericalCoordinates';
import IPlanet from './interfaces/IPlanet';
import {observationCalc} from '../utils';
import {createSun} from '../sun';
import TimeOfInterest from '../time/TimeOfInterest';
import {au2km} from '../utils/distanceCalc';
import {createEarth} from '../earth';
import Earth from '../earth/Earth';

export default abstract class Planet extends AstronomicalObject implements IPlanet {
    private earth: Earth;

    constructor(toi?: TimeOfInterest) {
        super(toi);

        this.earth = createEarth(toi);
    }

    public abstract async getHeliocentricRectangularJ2000Coordinates(): Promise<IRectangularCoordinates>;

    abstract async getHeliocentricRectangularDateCoordinates(): Promise<IRectangularCoordinates>;

    public async getGeocentricRectangularJ2000Coordinates(): Promise<IRectangularCoordinates> {
        const coordsPlanet = await this.getHeliocentricRectangularJ2000Coordinates();
        const coordsEarth = await this.earth.getHeliocentricRectangularJ2000Coordinates();

        return rectangularHeliocentric2rectangularGeocentric(coordsPlanet, coordsEarth);
    }

    public async getGeocentricRectangularDateCoordinates(): Promise<IRectangularCoordinates> {
        const coordsPlanet = await this.getHeliocentricRectangularDateCoordinates();
        const coordsEarth = await this.earth.getHeliocentricRectangularDateCoordinates();

        return rectangularHeliocentric2rectangularGeocentric(coordsPlanet, coordsEarth);
    }

    public async getHeliocentricEclipticSphericalJ2000Coordinates(): Promise<IEclipticSphericalCoordinates> {
        const coords = await this.getHeliocentricRectangularJ2000Coordinates();

        return rectangular2spherical(coords.x, coords.y, coords.z);
    }

    public async getHeliocentricEclipticSphericalDateCoordinates(): Promise<IEclipticSphericalCoordinates> {
        const coords = await this.getHeliocentricRectangularDateCoordinates();

        return rectangular2spherical(coords.x, coords.y, coords.z);
    }

    public async getGeocentricEclipticSphericalJ2000Coordinates(): Promise<IEclipticSphericalCoordinates> {
        const coords = await this.getGeocentricRectangularJ2000Coordinates();

        return rectangular2spherical(coords.x, coords.y, coords.z);
    }

    public async getGeocentricEclipticSphericalDateCoordinates(): Promise<IEclipticSphericalCoordinates> {
        const coords = await this.getGeocentricRectangularDateCoordinates();

        return rectangular2spherical(coords.x, coords.y, coords.z);
    }

    public async getApparentGeocentricEclipticSphericalDateCoordinates(): Promise<IEclipticSphericalCoordinates> {
        const {lon, lat, radiusVector} = await this.getGeocentricEclipticSphericalDateCoordinates();

        return ecliptic2apparentEcliptic(lon, lat, radiusVector, this.T);
    }

    public async getApparentGeocentricEquatorialSphericalCoordinates(): Promise<IEquatorialSphericalCoordinates> {
        const {lon, lat, radiusVector} = await this.getApparentGeocentricEclipticSphericalDateCoordinates();

        return eclipticSpherical2equatorialSpherical(lon, lat, radiusVector, this.T);
    }

    public async getDistanceToEarth(): Promise<number> {
        const coords = await this.getGeocentricEclipticSphericalDateCoordinates();

        return au2km(coords.radiusVector);
    }

    public async getPhaseAngle(): Promise<number> {
        const sun = createSun(this.toi);
        const coords = await this.getApparentGeocentricEquatorialSphericalCoordinates();
        const coordsSun = sun.getApparentGeocentricEquatorialSphericalCoordinates();

        return observationCalc.getPhaseAngle(coords, coordsSun);
    }

    public async getIlluminatedFraction(): Promise<number> {
        const i = await this.getPhaseAngle();

        return observationCalc.getIlluminatedFraction(i);
    }
}
