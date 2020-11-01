import {coordinateCalc, moonCalc} from '../utils';
import AstronomicalObject from '../astronomicalObject/AstronomicalObject';
import IEclipticSphericalCoordinates from '../coordinates/interfaces/IEclipticSphericalCoordinates';
import IEquatorialSphericalCoordinates from '../coordinates/interfaces/IEquatorialSphericalCoordinates';
import IRectangularCoordinates from '../coordinates/interfaces/IRectangularCoordinates';

export default class Moon extends AstronomicalObject {
    public getGeocentricEclipticSphericalCoordinates(): IEclipticSphericalCoordinates {
        const lon = moonCalc.getApparentLongitude(this.T);
        const lat = moonCalc.getLatitude(this.T);
        const radiusVector = moonCalc.getRadiusVector(this.T);

        return {lon, lat, radiusVector};
    }

    public getGeocentricEquatorialSphericalCoordinates(): IEquatorialSphericalCoordinates {
        const {lon, lat, radiusVector} = this.getGeocentricEclipticSphericalCoordinates();

        return coordinateCalc.eclipticSpherical2equatorialSpherical(lon, lat, radiusVector, this.T);
    }

    public getGeocentricEquatorialRectangularCoordinates(): IRectangularCoordinates {
        const {rightAscension, declination, radiusVector} = this.getGeocentricEquatorialSphericalCoordinates();

        return coordinateCalc.spherical2rectangular(rightAscension, declination, radiusVector);
    }

    public getDistanceToEarth(): number {
        return moonCalc.getDistanceToEarth(this.T);
    }

    public getPhaseAngle(): number {
        return moonCalc.getPhaseAngle(this.T);
    }

    public getIllumination(): number {
        return moonCalc.getIllumination(this.T);
    }
}
