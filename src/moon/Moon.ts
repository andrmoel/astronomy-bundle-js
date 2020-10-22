import {moonCalc} from '../utils';
import AstronomicalObject from '../astronomicalObject/AstronomicalObject';

export default class Moon extends AstronomicalObject {
    public getDistanceToEarth(): number {
        return moonCalc.getDistanceToEarth(this.T);
    }
}
