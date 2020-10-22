import TimeOfInterest from '../time/TimeOfInterest';
import Sun from './Sun';

export default function createSun(toi?: TimeOfInterest): Sun {
    return new Sun(toi);
}
