import TimeOfInterest from '../time/TimeOfInterest';
import {TwoLineElementTypes} from './types/TwoLineElementTypes';
import Satellite from './Satellite';

export default function createSatellite(tle: TwoLineElementTypes, toi?: TimeOfInterest): Satellite {
    return new Satellite(tle, toi);
}
