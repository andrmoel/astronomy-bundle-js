import TimeOfInterest from '../time/TimeOfInterest';
import ITwoLineElement from './interfaces/ITwoLineElement';
import Satellite from './Satellite';

export default function createSatellite(tle: ITwoLineElement, toi?: TimeOfInterest): Satellite {
    return new Satellite(tle, toi);
}
