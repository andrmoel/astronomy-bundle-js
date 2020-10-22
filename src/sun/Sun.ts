import {sunCalc} from '../utils';
import AstronomicalObject from '../astronomicalObject/AstronomicalObject';

export default class Sun extends AstronomicalObject {
    public getDistanceToEarth(): number {
        return sunCalc.getDistanceToEarth(this.T);
    }
}
