import type {Location} from '@app/types/LocationTypes';
import TimeOfInterest from '@package/time/models/TimeOfInterest';
import {parseBesselianElements} from './besselianElements';
import {getLocalSnapshot, getMagnitude, getObscuration, getSunAltitudeDeg, getTauFromToi} from './localCircumstances';

// 2021-12-04 total solar eclipse — Union Glacier, Antarctica
const raw: Array<number> = require('../resources/besselianElements/2459552.5.json');
const elements = parseBesselianElements(raw);

const location: Location = {lat: -79.738991, lon: -82.736597, elevation: 718};

// tau of maximum eclipse at Union Glacier (from contacts.test.ts expected value)
const tauMax = -0.225928;
// tau of C1 (first external contact)
const tauC1 = -1.084899;

describe('getTauFromToi', () => {
    // TimeOfInterest stores time in integer seconds, so the JD round-trip
    // has ~0.5 s precision (≈ 0.00014 h). Tests use precision 3 (±0.0005 h).

    it('returns approximately 0 at the Besselian reference epoch', () => {
        const toi = TimeOfInterest.fromJulianDay(elements.t0Jde);
        expect(getTauFromToi(elements, toi)).toBeCloseTo(0, 3);
    });

    it('returns approximately 1 hour after advancing 1 hour from reference epoch', () => {
        const toi = TimeOfInterest.fromJulianDay(elements.t0Jde + 1 / 24);
        expect(getTauFromToi(elements, toi)).toBeCloseTo(1, 3);
    });

    it('returns the correct tau for a known eclipse time within 1 second', () => {
        const toi = TimeOfInterest.fromJulianDay(elements.t0Jde + tauC1 / 24);
        expect(getTauFromToi(elements, toi)).toBeCloseTo(tauC1, 3);
    });
});

describe('getLocalSnapshot', () => {
    it('returns a distance less than l1 at the maximum (observer is in eclipse)', () => {
        const snap = getLocalSnapshot(elements, location, tauMax);
        expect(snap.distance).toBeLessThan(snap.l1);
    });

    it('returns a distance less than |l2| at maximum (observer is in totality)', () => {
        const snap = getLocalSnapshot(elements, location, tauMax);
        expect(snap.distance).toBeLessThan(Math.abs(snap.l2));
    });

    it('returns l2 < 0 at maximum (total eclipse convention)', () => {
        const snap = getLocalSnapshot(elements, location, tauMax);
        expect(snap.l2).toBeLessThan(0);
    });

    it('returns a distance approximately equal to l1 at C1 (penumbra edge)', () => {
        const snap = getLocalSnapshot(elements, location, tauC1);
        expect(Math.abs(snap.distance - snap.l1)).toBeLessThan(0.002);
    });
});

describe('getMagnitude', () => {
    it('returns 0 when distance equals l1 (penumbra edge)', () => {
        expect(getMagnitude(0.54, -0.004, 0.54)).toBeCloseTo(0, 6);
    });

    it('returns > 1 at the axis for a total eclipse (l2 < 0)', () => {
        // mag = l1 / (l1 + l2) = 0.54 / (0.54 - 0.004) > 1
        expect(getMagnitude(0.54, -0.004, 0)).toBeGreaterThan(1);
    });

    it('returns 1 exactly at the umbra edge for a total eclipse', () => {
        // At distance = |l2|: mag = (l1 - |l2|) / (l1 + l2) = 1
        expect(getMagnitude(0.54, -0.004, 0.004)).toBeCloseTo(1, 6);
    });

    it('returns < 1 for an annular eclipse at the axis', () => {
        expect(getMagnitude(0.54, 0.004, 0)).toBeLessThan(1);
    });

    it('returns 0 when distance equals or exceeds l1', () => {
        expect(getMagnitude(0.54, -0.004, 0.54)).toBe(0);
        expect(getMagnitude(0.54, -0.004, 0.6)).toBe(0);
    });
});

describe('getObscuration', () => {
    it('returns 1 in totality (l2 < 0, distance < |l2|)', () => {
        expect(getObscuration(0.54, -0.004, 0)).toBe(1);
        expect(getObscuration(0.54, -0.004, 0.003)).toBe(1);
    });

    it('returns the moon-to-sun area ratio in deep annular phase', () => {
        const l1 = 0.544,
            l2 = 0.004;
        const rs = (l1 + l2) / 2;
        const rm = (l1 - l2) / 2;
        expect(getObscuration(l1, l2, 0)).toBeCloseTo((rm * rm) / (rs * rs), 6);
    });

    it('returns 0 when the observer is outside the penumbra', () => {
        expect(getObscuration(0.54, -0.004, 0.54)).toBe(0);
        expect(getObscuration(0.54, -0.004, 0.6)).toBe(0);
    });

    it('returns a value between 0 and 1 in the partial phase', () => {
        const obs = getObscuration(0.54, -0.004, 0.27);
        expect(obs).toBeGreaterThan(0);
        expect(obs).toBeLessThan(1);
    });

    it('increases as the distance decreases from l1 toward |l2|', () => {
        const o1 = getObscuration(0.54, -0.004, 0.4);
        const o2 = getObscuration(0.54, -0.004, 0.2);
        const o3 = getObscuration(0.54, -0.004, 0.05);
        expect(o2).toBeGreaterThan(o1);
        expect(o3).toBeGreaterThan(o2);
    });
});

describe('getSunAltitudeDeg', () => {
    it('returns a positive altitude at Union Glacier during the eclipse', () => {
        const alt = getSunAltitudeDeg(elements, location, tauMax);
        expect(alt).toBeGreaterThan(0);
    });

    it('returns an altitude between -90 and 90 degrees', () => {
        const alt = getSunAltitudeDeg(elements, location, tauMax);
        expect(alt).toBeGreaterThan(-90);
        expect(alt).toBeLessThan(90);
    });
});
