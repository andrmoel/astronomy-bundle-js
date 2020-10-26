import AstronomicalObject from '../astronomicalObject/AstronomicalObject';
import {earthCalc} from '../utils';

export default class Earth extends AstronomicalObject {
    public getNutationInLongitude() {
        return earthCalc.getNutationInLongitude(this.T);
    }

    public getNutationInObliquity() {
        return earthCalc.getNutationInObliquity(this.T);
    }

    public getMeanObliquityOfEcliptic() {
        return earthCalc.getMeanObliquityOfEcliptic(this.T);
    }

    public getTrueObliquityOfEcliptic() {
        return earthCalc.getTrueObliquityOfEcliptic(this.T);
    }
}
