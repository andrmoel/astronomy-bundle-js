import {observationCalc} from '../utils';
import AstronomicalObject from '../astronomicalObject/AstronomicalObject';
import IRectangularCoordinates from '../coordinates/interfaces/IRectangularCoordinates';
import IEclipticSphericalCoordinates from '../coordinates/interfaces/IEclipticSphericalCoordinates';
import {au2km} from '../utils/distanceCalc';
import {DIAMETER_SUN} from '../constants/diameters';
import {earthEclipticSpherical2sunEclipticSpherical, spherical2rectangular} from '../utils/coordinateCalc';
import TimeOfInterest from '../time/TimeOfInterest';
import Earth from '../earth/Earth';
import {createEarth} from '../earth';
import {correctEffectOfAberration, correctEffectOfNutation} from '../utils/apparentCoordinateCalc';

export default class Sun extends AstronomicalObject {
    private earth: Earth;

    constructor(toi?: TimeOfInterest) {
        super(toi);

        this.earth = createEarth(toi);
    }

    public async getHeliocentricEclipticRectangularJ2000Coordinates(): Promise<IRectangularCoordinates> {
        return Promise.resolve({x: 0, y: 0, z: 0});
    }

    public async getHeliocentricEclipticRectangularDateCoordinates(): Promise<IRectangularCoordinates> {
        return Promise.resolve({x: 0, y: 0, z: 0});
    }

    public async getHeliocentricEclipticSphericalJ2000Coordinates(): Promise<IEclipticSphericalCoordinates> {
        return Promise.resolve({lon: 0, lat: 0, radiusVector: 0});
    }

    public async getHeliocentricEclipticSphericalDateCoordinates(): Promise<IEclipticSphericalCoordinates> {
        return Promise.resolve({lon: 0, lat: 0, radiusVector: 0});
    }

    public async getGeocentricEclipticRectangularJ2000Coordinates(): Promise<IRectangularCoordinates> {
        const coords = await this.getGeocentricEclipticSphericalJ2000Coordinates();

        return spherical2rectangular(coords.lon, coords.lat, coords.radiusVector);
    }

    public async getGeocentricEclipticRectangularDateCoordinates(): Promise<IRectangularCoordinates> {
        const coords = await this.getGeocentricEclipticSphericalDateCoordinates();

        return spherical2rectangular(coords.lon, coords.lat, coords.radiusVector);
    }

    public async getGeocentricEclipticSphericalJ2000Coordinates(): Promise<IEclipticSphericalCoordinates> {
        const coords = await this.earth.getHeliocentricEclipticSphericalJ2000Coordinates();

        return earthEclipticSpherical2sunEclipticSpherical(coords);
    }

    public async getGeocentricEclipticSphericalDateCoordinates(): Promise<IEclipticSphericalCoordinates> {
        const coords = await this.earth.getHeliocentricEclipticSphericalDateCoordinates();

        return earthEclipticSpherical2sunEclipticSpherical(coords);
    }

    public async getApparentGeocentricEclipticSphericalCoordinates(): Promise<IEclipticSphericalCoordinates> {
        let coords = await this.getGeocentricEclipticSphericalDateCoordinates();

        coords = correctEffectOfAberration(coords, this.T);
        coords = correctEffectOfNutation(coords, this.T);

        return coords;
    }

    public async getDistanceToEarth(): Promise<number> {
        const coords = await this.getGeocentricEclipticSphericalDateCoordinates();

        return au2km(coords.radiusVector);
    }

    public async getAngularDiameter(): Promise<number> {
        const distance = await this.getDistanceToEarth();

        return observationCalc.getAngularDiameter(distance, DIAMETER_SUN);
    }

    public getApparentMagnitude(): number {
        return -26.74;
    }
}
