import TimeOfInterest from '../time/TimeOfInterest';
import {TwoLineElement} from './types/TwoLineElementTypes';

export default class Satellite {
    public constructor(private tle: TwoLineElement, private toi?: TimeOfInterest) {}
}
