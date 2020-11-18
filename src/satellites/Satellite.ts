import TimeOfInterest from '../time/TimeOfInterest';
import ITwoLineElement from './interfaces/ITwoLineElement';

export default class Satellite {
    constructor(private tle: ITwoLineElement, private toi?: TimeOfInterest) {
    }
}
