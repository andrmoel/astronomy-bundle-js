import TimeOfInterest from '../time/TimeOfInterest';
import Earth from './Earth';

export default function createEarth(toi?: TimeOfInterest): Earth {
    return new Earth(toi);
}
