import TimeOfInterest from '../time/TimeOfInterest';
import Mercury from './Mercury';
import Venus from './Venus';
import Earth from './Earth';
import Mars from './Mars';
import Jupiter from './Jupiter';
import Saturn from './Saturn';
import Uranus from './Uranus';
import Neptune from './Neptune';

export function createMercury(toi?: TimeOfInterest): Mercury {
    return new Mercury(toi);
}

export function createVenus(toi?: TimeOfInterest): Venus {
    return new Venus(toi);
}

export function createEarth(toi?: TimeOfInterest): Earth {
    return new Earth(toi);
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
