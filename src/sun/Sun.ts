import {sunCalc} from '../utils';
import AstronomicalObject from '../astronomicalObject/AstronomicalObject';
import IEquatorialSphericalCoordinates from '../coordinates/interfaces/IEquatorialSphericalCoordinates';

export default class Sun extends AstronomicalObject {
    public getApparentGeocentricEquatorialSphericalCoordinates(): IEquatorialSphericalCoordinates {
        return {
            rightAscension: sunCalc.getApparentRightAscension(this.T),
            declination: sunCalc.getApparentDeclination(this.T),
            radiusVector: sunCalc.getRadiusVector(this.T),
        }
    }

    public getDistanceToEarth(): number {
        return sunCalc.getDistanceToEarth(this.T);
    }
}
