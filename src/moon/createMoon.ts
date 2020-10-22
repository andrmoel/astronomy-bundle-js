import TimeOfInterest from '../time/TimeOfInterest';
import Moon from './Moon';

export function createMoon(toi: TimeOfInterest): Moon {
    return new Moon(toi);
}
