import TimeOfInterest from '../time/TimeOfInterest';
import {TwoLineElement} from './types/TwoLineElementTypes';
import Satellite from './Satellite';

export default function createSatellite(tle: TwoLineElement, toi?: TimeOfInterest): Satellite {
    return new Satellite(tle, toi);
}
