import type {Location} from '@app/types/LocationTypes';
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import {getCentralDuration, getDuration} from './duration';

// ASE 2013-05-10
const elements: BesselianElements = {
    t0Jde: 2456422.51829,
    t0Hours: 0,
    tMin: -3,
    tMax: 3,
    deltaT: 67.1,
    x: [-0.17518, 0.50528872, 0.0000144, -0.00000591],
    y: [-0.30430099, 0.0888899, -0.0000959, -9.7e-7],
    d: [17.60548019, 0.010701, -0.000004],
    mu: [180.9034729, 15.00166035, 0],
    l1: [0.56367201, 0.0000788, -0.00001],
    l2: [0.017447, 0.0000784, -0.00001],
    tanF1: 0.0046313,
    tanF2: 0.0046082,
};

// Coen, Australia - central line, full annular eclipse with the Sun well up.
const centralLineLocation: Location = {lat: -13.94528, lon: 143.19881, elevation: 219};

// Sydney, Australia - partial eclipse, Sun above the horizon throughout.
const partialObserverLocation: Location = {lat: -33.8688, lon: 151.2093, elevation: 58};

// Perth, Australia - eclipse in progress at sunrise, only the phase after sunrise is observable.
const partialSunriseLocation: Location = {lat: -31.9523, lon: 115.8613, elevation: 15};

// South Pacific Ocean - Sun sets mid-eclipse, only the phase before sunset is observable.
const partialSunsetLocation: Location = {lat: -35, lon: -130, elevation: 0};

// Cape Town, South Africa - inside the penumbra, but the Sun stays below the horizon throughout.
const belowHorizonLocation: Location = {lat: -33.9249, lon: 18.4241, elevation: 25};

// London - well outside the eclipse entirely.
const outsideEclipseLocation: Location = {lat: 51.5, lon: -0.12, elevation: 0};

describe('getDuration', () => {
    it('returns the partial-phase duration in seconds for a central-line observer', () => {
        const result = getDuration(elements, centralLineLocation);

        expect(result).toBeCloseTo(10564.91, 2);
    });

    it('returns the partial-phase duration in seconds for a partial-only observer', () => {
        const result = getDuration(elements, partialObserverLocation);

        expect(result).toBeCloseTo(8685.76, 2);
    });

    it('counts only the time after sunrise for an observer whose eclipse begins at sunrise', () => {
        const result = getDuration(elements, partialSunriseLocation);

        expect(result).toBeCloseTo(3058.0, 2);
    });

    it('counts only the time before sunset for an observer whose eclipse ends at sunset', () => {
        const result = getDuration(elements, partialSunsetLocation);

        expect(result).toBeCloseTo(2544.96, 2);
    });

    it('returns 0 when the eclipse stays below the horizon at the observer location', () => {
        const result = getDuration(elements, belowHorizonLocation);

        expect(result).toBe(0);
    });

    it('returns 0 when the eclipse is not visible from the observer location', () => {
        const result = getDuration(elements, outsideEclipseLocation);

        expect(result).toBe(0);
    });
});

describe('getCentralDuration', () => {
    it('returns the annularity duration in seconds for a central-line observer', () => {
        const result = getCentralDuration(elements, centralLineLocation);

        expect(result).toBeCloseTo(160.81, 2);
    });

    it('returns 0 for a partial-only observer (no c2/c3)', () => {
        const result = getCentralDuration(elements, partialObserverLocation);

        expect(result).toBe(0);
    });

    it('returns 0 for an observer whose eclipse begins at sunrise (no c2/c3)', () => {
        const result = getCentralDuration(elements, partialSunriseLocation);

        expect(result).toBe(0);
    });

    it('returns 0 when the eclipse stays below the horizon at the observer location', () => {
        const result = getCentralDuration(elements, belowHorizonLocation);

        expect(result).toBe(0);
    });

    it('returns 0 when the eclipse is not visible from the observer location', () => {
        const result = getCentralDuration(elements, outsideEclipseLocation);

        expect(result).toBe(0);
    });
});
