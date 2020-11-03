import TimeOfInterest from '../time/TimeOfInterest';
import Mercury from './Mercury';

export function createMercury(toi?: TimeOfInterest): Mercury {
    return new Mercury(toi);
}
