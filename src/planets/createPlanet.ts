import TimeOfInterest from '../time/TimeOfInterest';
import Mercury from './Mercury';
import Venus from './Venus';
import Mars from './Mars';
import Jupiter from './Jupiter';
import Saturn from './Saturn';
import Uranus from './Uranus';
import Neptune from './Neptune';

export function createMercury(toi?: TimeOfInterest): Mercury {
    return new Mercury(toi);
}

export function createVenus(toi?: TimeOfInterest): Mercury {
    return new Venus(toi);
}

export function createMars(toi?: TimeOfInterest): Mercury {
    return new Mars(toi);
}

export function createJupiter(toi?: TimeOfInterest): Mercury {
    return new Jupiter(toi);
}

export function createSaturn(toi?: TimeOfInterest): Mercury {
    return new Saturn(toi);
}

export function createUranus(toi?: TimeOfInterest): Mercury {
    return new Uranus(toi);
}

export function createNeptune(toi?: TimeOfInterest): Mercury {
    return new Neptune(toi);
}
