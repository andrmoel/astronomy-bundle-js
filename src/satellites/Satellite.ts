import TimeOfInterest from '../time/TimeOfInterest';
import {TwoLineElement} from './types/TwoLineElement';

export default class Satellite {
    constructor(private tle: TwoLineElement, private toi?: TimeOfInterest) {
    }
}
