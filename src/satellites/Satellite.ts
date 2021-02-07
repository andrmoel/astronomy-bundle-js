import TimeOfInterest from '../time/TimeOfInterest';
import {TwoLineElement} from './satelliteTypes';

export default class Satellite {
    constructor(private tle: TwoLineElement, private toi?: TimeOfInterest) {
    }
}
