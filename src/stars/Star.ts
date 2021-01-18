import AstronomicalObject from '../astronomicalObject/AstronomicalObject';
import IEclipticSphericalCoordinates from '../coordinates/interfaces/IEclipticSphericalCoordinates';
import IRectangularCoordinates from '../coordinates/interfaces/IRectangularCoordinates';
import TimeOfInterest from '../time/TimeOfInterest';
import IEquatorialSphericalCoordinates from '../coordinates/interfaces/IEquatorialSphericalCoordinates';
import IProperMotion from './interfaces/IProperMotion';
import {EPOCH_J2000} from '../constants/epoch';
import {
    eclipticSpherical2equatorialSpherical,
    equatorialSpherical2eclipticSpherical,
    spherical2rectangular
} from '../utils/coordinateCalc';
import {correctProperMotion} from '../utils/starCalc';
import {correctPrecessionForEquatorialCoordinates} from '../utils/precessionCalc';
import {correctEffectOfAberration, correctEffectOfNutation} from '../utils/apparentCoordinateCalc';

export default class Star extends AstronomicalObject {
    public constructor(
        private equatorialCoords: IEquatorialSphericalCoordinates,
        public toi?: TimeOfInterest,
        private properMotion: IProperMotion = {rightAscension: 0, declination: 0},
        private referenceEpoch: number = EPOCH_J2000,
    ) {
        super(toi);
    }

    async getHeliocentricEclipticSphericalJ2000Coordinates(): Promise<IEclipticSphericalCoordinates> {
        return await this.getGeocentricEclipticSphericalJ2000Coordinates();
    }

    async getHeliocentricEclipticSphericalDateCoordinates(): Promise<IEclipticSphericalCoordinates> {
        return await this.getGeocentricEclipticSphericalDateCoordinates();
    }

    async getHeliocentricEclipticRectangularJ2000Coordinates(): Promise<IRectangularCoordinates> {
        return await this.getGeocentricEclipticRectangularJ2000Coordinates();
    }

    async getHeliocentricEclipticRectangularDateCoordinates(): Promise<IRectangularCoordinates> {
        return await this.getGeocentricEclipticRectangularDateCoordinates();
    }

    async getGeocentricEclipticRectangularJ2000Coordinates(): Promise<IRectangularCoordinates> {
        const {lon, lat, radiusVector} = await this.getGeocentricEclipticSphericalJ2000Coordinates();

        return spherical2rectangular(lon, lat, radiusVector);
    }

    async getGeocentricEclipticRectangularDateCoordinates(): Promise<IRectangularCoordinates> {
        const {lon, lat, radiusVector} = await this.getGeocentricEclipticSphericalDateCoordinates();

        return spherical2rectangular(lon, lat, radiusVector);
    }

    async getGeocentricEclipticSphericalJ2000Coordinates(): Promise<IEclipticSphericalCoordinates> {
        const {rightAscension, declination, radiusVector}
            = await this.getGeocentricEquatorialSphericalJ2000Coordinates();

        return equatorialSpherical2eclipticSpherical(rightAscension, declination, radiusVector, this.T);
    }

    async getGeocentricEclipticSphericalDateCoordinates(): Promise<IEclipticSphericalCoordinates> {
        const {rightAscension, declination, radiusVector}
            = await this.getGeocentricEquatorialSphericalDateCoordinates();

        return equatorialSpherical2eclipticSpherical(rightAscension, declination, radiusVector, this.T);
    }

    async getGeocentricEquatorialSphericalJ2000Coordinates(): Promise<IEquatorialSphericalCoordinates> {
        return Promise.resolve(this.equatorialCoords);
    }

    async getGeocentricEquatorialSphericalDateCoordinates(): Promise<IEquatorialSphericalCoordinates> {
        const coords = correctProperMotion(
            this.equatorialCoords,
            this.properMotion,
            this.jd,
            this.referenceEpoch
        );

        return Promise.resolve(
            correctPrecessionForEquatorialCoordinates(coords, this.jd, this.referenceEpoch)
        );
    }

    async getApparentGeocentricEclipticSphericalCoordinates(): Promise<IEclipticSphericalCoordinates> {
        let coords = await this.getGeocentricEclipticSphericalDateCoordinates();
        coords = correctEffectOfAberration(coords, this.T);

        return correctEffectOfNutation(coords, this.T);
    }

    async getApparentGeocentricEquatorialSphericalCoordinates(): Promise<IEquatorialSphericalCoordinates> {
        const {lon, lat, radiusVector} = await this.getApparentGeocentricEclipticSphericalCoordinates();

        return eclipticSpherical2equatorialSpherical(lon, lat, radiusVector, this.T);
    }
}
