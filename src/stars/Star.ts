import AstronomicalObject from '../astronomicalObject/AstronomicalObject';
import {
    EclipticSphericalCoordinates,
    EquatorialSphericalCoordinates,
    RectangularCoordinates
} from '../coordinates/coordinateTypes';
import TimeOfInterest from '../time/TimeOfInterest';
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
        private equatorialCoords: EquatorialSphericalCoordinates,
        toi?: TimeOfInterest,
        private properMotion: IProperMotion = {rightAscension: 0, declination: 0},
        private referenceEpoch: number = EPOCH_J2000,
    ) {
        super(toi);
    }

    async getHeliocentricEclipticSphericalJ2000Coordinates(): Promise<EclipticSphericalCoordinates> {
        return await this.getGeocentricEclipticSphericalJ2000Coordinates();
    }

    async getHeliocentricEclipticSphericalDateCoordinates(): Promise<EclipticSphericalCoordinates> {
        return await this.getGeocentricEclipticSphericalDateCoordinates();
    }

    async getHeliocentricEclipticRectangularJ2000Coordinates(): Promise<RectangularCoordinates> {
        return await this.getGeocentricEclipticRectangularJ2000Coordinates();
    }

    async getHeliocentricEclipticRectangularDateCoordinates(): Promise<RectangularCoordinates> {
        return await this.getGeocentricEclipticRectangularDateCoordinates();
    }

    async getGeocentricEclipticRectangularJ2000Coordinates(): Promise<RectangularCoordinates> {
        const coords = await this.getGeocentricEclipticSphericalJ2000Coordinates();

        return spherical2rectangular(coords);
    }

    async getGeocentricEclipticRectangularDateCoordinates(): Promise<RectangularCoordinates> {
        const coords = await this.getGeocentricEclipticSphericalDateCoordinates();

        return spherical2rectangular(coords);
    }

    async getGeocentricEclipticSphericalJ2000Coordinates(): Promise<EclipticSphericalCoordinates> {
        const coords = await this.getGeocentricEquatorialSphericalJ2000Coordinates();

        return equatorialSpherical2eclipticSpherical(coords, this.T);
    }

    async getGeocentricEclipticSphericalDateCoordinates(): Promise<EclipticSphericalCoordinates> {
        const coords = await this.getGeocentricEquatorialSphericalDateCoordinates();

        return equatorialSpherical2eclipticSpherical(coords, this.T);
    }

    async getGeocentricEquatorialSphericalJ2000Coordinates(): Promise<EquatorialSphericalCoordinates> {
        return Promise.resolve(this.equatorialCoords);
    }

    async getGeocentricEquatorialSphericalDateCoordinates(): Promise<EquatorialSphericalCoordinates> {
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

    async getApparentGeocentricEclipticSphericalCoordinates(): Promise<EclipticSphericalCoordinates> {
        let coords = await this.getGeocentricEclipticSphericalDateCoordinates();
        coords = correctEffectOfAberration(coords, this.T);

        return correctEffectOfNutation(coords, this.T);
    }

    async getApparentGeocentricEquatorialSphericalCoordinates(): Promise<EquatorialSphericalCoordinates> {
        const coords = await this.getApparentGeocentricEclipticSphericalCoordinates();

        return eclipticSpherical2equatorialSpherical(coords, this.T);
    }
}
