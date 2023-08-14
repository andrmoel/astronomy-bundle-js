import TimeOfInterest from '../time/TimeOfInterest';
import Satellite from './Satellite';
import {TwoLineElement} from './types/TwoLineElementTypes';

export default function createSatellite(tle: TwoLineElement, toi?: TimeOfInterest): Satellite {
    return new Satellite(tle, toi);
}
