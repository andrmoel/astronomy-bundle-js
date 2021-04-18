import Jupiter from './Jupiter';
import Mars from './Mars';
import Mercury from './Mercury';
import Neptune from './Neptune';
import Saturn from './Saturn';
import Uranus from './Uranus';
import Venus from './Venus';
import TimeOfInterest from '../time/TimeOfInterest';

export function createMercury(toi?: TimeOfInterest): Mercury {
    return new Mercury(toi);
}

export function createVenus(toi?: TimeOfInterest): Venus {
    return new Venus(toi);
}

export function createMars(toi?: TimeOfInterest): Mars {
    return new Mars(toi);
}

export function createJupiter(toi?: TimeOfInterest): Jupiter {
    return new Jupiter(toi);
}

export function createSaturn(toi?: TimeOfInterest): Saturn {
    return new Saturn(toi);
}

export function createUranus(toi?: TimeOfInterest): Uranus {
    return new Uranus(toi);
}

export function createNeptune(toi?: TimeOfInterest): Neptune {
    return new Neptune(toi);
}
