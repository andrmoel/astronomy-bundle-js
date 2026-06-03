import AstronomicalObject from '../astronomicalObject/AstronomicalObject';
import {EPOCH_J2000} from '../constants/epoch';
import {correctEffectOfAberration, correctEffectOfNutation} from '../coordinates/calculations/apparentCoordinateCalc';
import {
    eclipticSpherical2equatorialSpherical,
    equatorialSpherical2eclipticSpherical,
    spherical2rectangular,
} from '../coordinates/calculations/coordinateCalc';
import {correctPrecessionForEquatorialCoordinates} from '../coordinates/calculations/precessionCalc';
import {
    EclipticSphericalCoordinates,
    EquatorialSphericalCoordinates,
    RectangularCoordinates,
} from '../coordinates/types/CoordinateTypes';
import TimeOfInterest from '../time/TimeOfInterest';
import {correctProperMotion} from './calculations/starCalc';
import {ProperMotion} from './types/ProperMotionTypes';

export default class Star extends AstronomicalObject {
    public constructor(
        private readonly equatorialCoords: EquatorialSphericalCoordinates,
        toi?: TimeOfInterest,
        private readonly properMotion: ProperMotion = {rightAscension: 0, declination: 0},
        private readonly referenceEpoch: number = EPOCH_J2000,
    ) {
        super(toi, 'star');
    }

    public async getHeliocentricEclipticSphericalJ2000Coordinates(): Promise<EclipticSphericalCoordinates> {
        return await this.getGeocentricEclipticSphericalJ2000Coordinates();
    }

    public async getHeliocentricEclipticSphericalDateCoordinates(): Promise<EclipticSphericalCoordinates> {
        return await this.getGeocentricEclipticSphericalDateCoordinates();
    }

    public async getHeliocentricEclipticRectangularJ2000Coordinates(): Promise<RectangularCoordinates> {
        return await this.getGeocentricEclipticRectangularJ2000Coordinates();
    }

    public async getHeliocentricEclipticRectangularDateCoordinates(): Promise<RectangularCoordinates> {
        return await this.getGeocentricEclipticRectangularDateCoordinates();
    }

    public async getGeocentricEclipticRectangularJ2000Coordinates(): Promise<RectangularCoordinates> {
        const coords = await this.getGeocentricEclipticSphericalJ2000Coordinates();

        return spherical2rectangular(coords);
    }

    public async getGeocentricEclipticRectangularDateCoordinates(): Promise<RectangularCoordinates> {
        const coords = await this.getGeocentricEclipticSphericalDateCoordinates();

        return spherical2rectangular(coords);
    }

    public async getGeocentricEclipticSphericalJ2000Coordinates(): Promise<EclipticSphericalCoordinates> {
        const coords = await this.getGeocentricEquatorialSphericalJ2000Coordinates();

        return equatorialSpherical2eclipticSpherical(coords, this.T);
    }

    public async getGeocentricEclipticSphericalDateCoordinates(): Promise<EclipticSphericalCoordinates> {
        const coords = await this.getGeocentricEquatorialSphericalDateCoordinates();

        return equatorialSpherical2eclipticSpherical(coords, this.T);
    }

    public async getGeocentricEquatorialSphericalJ2000Coordinates(): Promise<EquatorialSphericalCoordinates> {
        return Promise.resolve(this.equatorialCoords);
    }

    public async getGeocentricEquatorialSphericalDateCoordinates(): Promise<EquatorialSphericalCoordinates> {
        const coords = correctProperMotion(
            this.equatorialCoords,
            this.properMotion,
            this.jd,
            this.referenceEpoch,
        );

        return Promise.resolve(
            correctPrecessionForEquatorialCoordinates(coords, this.jd, this.referenceEpoch),
        );
    }

    public async getApparentGeocentricEclipticSphericalCoordinates(): Promise<EclipticSphericalCoordinates> {
        let coords = await this.getGeocentricEclipticSphericalDateCoordinates();
        coords = correctEffectOfAberration(coords, this.T);

        return correctEffectOfNutation(coords, this.T);
    }

    public async getApparentGeocentricEquatorialSphericalCoordinates(): Promise<EquatorialSphericalCoordinates> {
        const coords = await this.getApparentGeocentricEclipticSphericalCoordinates();

        return eclipticSpherical2equatorialSpherical(coords, this.T);
    }
}
