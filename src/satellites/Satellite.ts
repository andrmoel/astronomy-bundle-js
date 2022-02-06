import TimeOfInterest from '../time/TimeOfInterest';
import {TwoLineElementTypes} from './types/TwoLineElementTypes';

export default class Satellite {
    public constructor(private tle: TwoLineElementTypes, private toi?: TimeOfInterest) {
    }
}
