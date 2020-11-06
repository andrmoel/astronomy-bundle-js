import {rectangular2spherical, rectangularHeliocentric2rectangularGeocentric} from '../utils/coordinateCalc';
import {getAsyncCachedCalculation} from '../cache/calculationCache';
import AstronomicalObject from '../astronomicalObject/AstronomicalObject';
import IRectangularCoordinates from '../coordinates/interfaces/IRectangularCoordinates';
import IEclipticSphericalCoordinates from '../coordinates/interfaces/IEclipticSphericalCoordinates';
import IEquatorialSphericalCoordinates from '../coordinates/interfaces/IEquatorialSphericalCoordinates';
import IPlanet from './interfaces/IPlanet';
import {calculateVSOP87} from './calculations/vsop87Calc';
import {coordinateCalc, earthCalc, observationCalc} from '../utils';
import {createSun} from '../sun';

export default abstract class Planet extends AstronomicalObject implements IPlanet {
    abstract async getHeliocentricRectangularJ2000Coordinates(): Promise<IRectangularCoordinates>;

    abstract async getHeliocentricRectangularDateCoordinates(): Promise<IRectangularCoordinates>;

    async getGeocentricRectangularJ2000Coordinates(): Promise<IRectangularCoordinates> {
        const coordsPlanet = await this.getHeliocentricRectangularJ2000Coordinates();
        const coordsEarth = await this._getEarthHeliocentricRectangularJ2000Coordinates();

        return rectangularHeliocentric2rectangularGeocentric(coordsPlanet, coordsEarth);
    }

    async getGeocentricRectangularDateCoordinates(): Promise<IRectangularCoordinates> {
        const coordsPlanet = await this.getHeliocentricRectangularDateCoordinates();
        const coordsEarth = await this._getEarthHeliocentricRectangularDateCoordinates();

        return rectangularHeliocentric2rectangularGeocentric(coordsPlanet, coordsEarth);
    }

    async getHeliocentricEclipticSphericalJ2000Coordinates(): Promise<IEclipticSphericalCoordinates> {
        const coords = await this.getHeliocentricRectangularJ2000Coordinates();

        return rectangular2spherical(coords.x, coords.y, coords.z);
    }

    async getHeliocentricEclipticSphericalDateCoordinates(): Promise<IEclipticSphericalCoordinates> {
        const coords = await this.getHeliocentricRectangularDateCoordinates();

        return rectangular2spherical(coords.x, coords.y, coords.z);
    }

    private async _getEarthHeliocentricRectangularJ2000Coordinates(): Promise<IRectangularCoordinates> {
        return await getAsyncCachedCalculation('earth_heliocentric_rectangular_j2000', this.t, async () => {
            const vsop87 = await import('./vspo87/vsop87EarthRectangularJ2000');

            return {
                x: calculateVSOP87(vsop87.VSOP87_X, this.t),
                y: calculateVSOP87(vsop87.VSOP87_Y, this.t),
                z: calculateVSOP87(vsop87.VSOP87_Z, this.t),
            }
        });
    }

    private async _getEarthHeliocentricRectangularDateCoordinates(): Promise<IRectangularCoordinates> {
        return await getAsyncCachedCalculation('earth_heliocentric_rectangular_date', this.t, async () => {
            const vsop87 = await import('./vspo87/vsop87EarthRectangularDate');

            return {
                x: calculateVSOP87(vsop87.VSOP87_X, this.t),
                y: calculateVSOP87(vsop87.VSOP87_Y, this.t),
                z: calculateVSOP87(vsop87.VSOP87_Z, this.t),
            }
        });
    }

    async getGeocentricEclipticSphericalJ2000Coordinates(): Promise<IEclipticSphericalCoordinates> {
        const coords = await this.getGeocentricRectangularJ2000Coordinates();

        return rectangular2spherical(coords.x, coords.y, coords.z);
    }

    async getGeocentricEclipticSphericalDateCoordinates(): Promise<IEclipticSphericalCoordinates> {
        const coords = await this.getGeocentricRectangularDateCoordinates();

        return rectangular2spherical(coords.x, coords.y, coords.z);
    }

    async getApparentGeocentricEquatorialSphericalCoordinates(): Promise<IEquatorialSphericalCoordinates> {
        const {lon, lat, radiusVector} = await this.getGeocentricEclipticSphericalDateCoordinates();
        const phi = earthCalc.getNutationInLongitude(this.T);

        return coordinateCalc.eclipticSpherical2equatorialSpherical(
            lon + phi,
            lat,
            radiusVector,
            this.T
        );
    }

    async getPhaseAngle(): Promise<number> {
        const sun = createSun(this.toi);
        const coords = await this.getApparentGeocentricEquatorialSphericalCoordinates();
        const coordsSun = sun.getApparentGeocentricEquatorialSphericalCoordinates();

        return observationCalc.getPhaseAngle(coords, coordsSun);
    }

    async getIlluminatedFraction(): Promise<number> {
        const i = await this.getPhaseAngle();

        return observationCalc.getIlluminatedFraction(i);
    }
}
