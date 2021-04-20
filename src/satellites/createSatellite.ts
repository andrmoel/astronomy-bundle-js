import TimeOfInterest from '../time/TimeOfInterest';
import {TwoLineElement} from './types/TwoLineElement';
import Satellite from './Satellite';

export default function createSatellite(tle: TwoLineElement, toi?: TimeOfInterest): Satellite {
    return new Satellite(tle, toi);
}
