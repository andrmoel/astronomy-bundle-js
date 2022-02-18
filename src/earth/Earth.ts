import AstronomicalObject from '../astronomicalObject/AstronomicalObject';
import {EclipticSphericalCoordinates, RectangularCoordinates} from '../coordinates/types/CoordinateTypes';
import {getAsyncCachedCalculation} from '../cache/calculationCache';
import {calculateVSOP87, calculateVSOP87Angle} from '../planets/calculations/vsop87Calc';
import {normalizeAngle} from '../utils/angleCalc';
import {spherical2rectangular} from '../coordinates/calculations/coordinateCalc';
import TimeOfInterest from '../time/TimeOfInterest';
import {earthCalc} from './calculations';

export default class Earth extends AstronomicalObject {
    public constructor(toi?: TimeOfInterest) {
        super(toi, 'earth');
    }

    public async getHeliocentricEclipticRectangularJ2000Coordinates(): Promise<RectangularCoordinates> {
        const coords = await this.getHeliocentricEclipticSphericalJ2000Coordinates();

        return spherical2rectangular(coords);
    }

    public async getHeliocentricEclipticRectangularDateCoordinates(): Promise<RectangularCoordinates> {
        const coords = await this.getHeliocentricEclipticSphericalDateCoordinates();

        return spherical2rectangular(coords);
    }

    public async getHeliocentricEclipticSphericalJ2000Coordinates(): Promise<EclipticSphericalCoordinates> {
        return await getAsyncCachedCalculation('earth_heliocentric_spherical_j2000', this.t, async () => {
            const vsop87 = await import('./vsop87/vsop87EarthSphericalJ2000');

            return {
                lon: normalizeAngle(calculateVSOP87Angle(vsop87.VSOP87_X, this.t)),
                lat: calculateVSOP87Angle(vsop87.VSOP87_Y, this.t),
                radiusVector: calculateVSOP87(vsop87.VSOP87_Z, this.t),
            };
        });
    }

    public async getHeliocentricEclipticSphericalDateCoordinates(): Promise<EclipticSphericalCoordinates> {
        return await getAsyncCachedCalculation('earth_heliocentric_spherical_date', this.t, async () => {
            const vsop87 = await import('./vsop87/vsop87EarthSphericalDate');

            return {
                lon: normalizeAngle(calculateVSOP87Angle(vsop87.VSOP87_X, this.t)),
                lat: calculateVSOP87Angle(vsop87.VSOP87_Y, this.t),
                radiusVector: calculateVSOP87(vsop87.VSOP87_Z, this.t),
            };
        });
    }

    public getGeocentricEclipticRectangularJ2000Coordinates(): Promise<RectangularCoordinates> {
        return Promise.resolve({x: 0, y: 0, z: 0});
    }

    public getGeocentricEclipticRectangularDateCoordinates(): Promise<RectangularCoordinates> {
        return Promise.resolve({x: 0, y: 0, z: 0});
    }

    public getGeocentricEclipticSphericalJ2000Coordinates(): Promise<EclipticSphericalCoordinates> {
        return Promise.resolve({lon: 0, lat: 0, radiusVector: 0});
    }

    public getGeocentricEclipticSphericalDateCoordinates(): Promise<EclipticSphericalCoordinates> {
        return Promise.resolve({lon: 0, lat: 0, radiusVector: 0});
    }

    public async getApparentGeocentricEclipticSphericalCoordinates(): Promise<EclipticSphericalCoordinates> {
        return Promise.resolve({lon: 0, lat: 0, radiusVector: 0});
    }

    public getNutationInLongitude(): number {
        return earthCalc.getNutationInLongitude(this.T);
    }

    public getNutationInObliquity(): number {
        return earthCalc.getNutationInObliquity(this.T);
    }

    public getMeanObliquityOfEcliptic(): number {
        return earthCalc.getMeanObliquityOfEcliptic(this.T);
    }

    public getTrueObliquityOfEcliptic(): number {
        return earthCalc.getTrueObliquityOfEcliptic(this.T);
    }
}
