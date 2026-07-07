import type {Location} from '@app/types/LocationTypes';
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import {contactTausToContactJulianDays, getContactTaus} from './contacts';

// 2021-12-04 total solar eclipse
const besselianElements: BesselianElements = {
    t0Jde: 2459552.816,
    t0Hours: 8,
    tMin: -76.8,
    tMax: -46.2,
    deltaT: 72.6,
    x: [0.025209, 0.5683028, 0.0000391, -0.0000097],
    y: [-0.983653, -0.1315142, 0.0002213, 0.0000024],
    d: [-22.2747192, -0.005178, 0.000006],
    mu: [302.452179, 14.99728, 0],
    l1: [0.537805, -0.000016, -0.0000131],
    l2: [-0.008292, -0.000016, -0.0000131],
    tanF1: 0.0047434,
    tanF2: 0.0047198,
    saros: 152,
};

describe('getContactTaus', () => {
    describe('contacts for the 2021-12-04 total solar eclipse', () => {
        it('had an observer on the central line', () => {
            // Union Glacier
            const location: Location = {
                lat: -79.738991,
                lon: -82.736597,
                elevation: 718,
            };

            const result = getContactTaus(besselianElements, location);

            // Antarctic polar day: no horizon crossings.
            expect(result).not.toBeNull();
            expect(result?.c1).toBeCloseTo(-1.084902, 6);
            expect(result?.c2).toBeCloseTo(-0.232012, 6);
            expect(result?.max).toBeCloseTo(-0.22593, 6);
            expect(result?.c3).toBeCloseTo(-0.219841, 6);
            expect(result?.c4).toBeCloseTo(0.640031, 6);
            expect(result?.sunrise).toBeNull();
            expect(result?.sunset).toBeNull();
        });

        it('had an observer outside of the central line', () => {
            // Peter I Island: Sun above the horizon throughout.
            const location: Location = {
                lat: -68.85446,
                lon: 90.5926,
                elevation: 10,
            };

            const result = getContactTaus(besselianElements, location);

            expect(result).not.toBeNull();
            expect(result?.c1).toBeCloseTo(-0.702256, 6);
            expect(result?.c2).toBeNull();
            expect(result?.max).toBeCloseTo(0.226929, 6);
            expect(result?.c3).toBeNull();
            expect(result?.c4).toBeCloseTo(1.135847, 6);
            expect(result?.sunrise).toBeNull();
            expect(result?.sunset).toBeNull();
        });

        it('had an observer who witnessed the end of the eclipse during sunrise', () => {
            // Ushuaia: c1 and max are below the horizon; sunrise marks where the eclipse becomes
            // observable, up to c4.
            const location: Location = {
                lat: -54.83955,
                lon: -68.31199,
                elevation: 20,
            };

            const result = getContactTaus(besselianElements, location);

            expect(result).not.toBeNull();
            expect(result?.c1).toBeCloseTo(-1.485472, 6);
            expect(result?.c2).toBeNull();
            expect(result?.max).toBeCloseTo(-0.725519, 6);
            expect(result?.c3).toBeNull();
            expect(result?.c4).toBeCloseTo(0.053285, 6);
            expect(result?.sunrise).toBeCloseTo(-0.070939, 6);
            expect(result?.sunset).toBeNull();
        });

        it('had an observer for whom the eclipse stayed below the horizon', () => {
            // Punta Arenas: the Sun only rises after last contact, so the eclipse is not observable.
            const location: Location = {
                lat: -53.16261,
                lon: -70.90806,
                elevation: 20,
            };

            const result = getContactTaus(besselianElements, location);

            expect(result).toBeNull();
        });
    });

    describe('contacts for the 2013-05-10 annular solar eclipse', () => {
        // Annular eclipse whose path crossed northern Australia and the central Pacific.
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
            saros: 138,
        };

        it('had an observer whose eclipse begins while the Sun is still below the horizon', () => {
            // Perth, Australia: first contact below the horizon, Sun rises partway through.
            const location: Location = {lat: -31.9523, lon: 115.8613, elevation: 15};

            const result = getContactTaus(elements, location);

            expect(result).not.toBeNull();
            expect(result?.c1).toBeCloseTo(-2.420728, 6);
            expect(result?.c4).toBeCloseTo(-0.230553, 6);
            expect(result?.sunrise).toBeCloseTo(-1.079997, 6);
            expect(result?.sunset).toBeNull();
        });

        it('had an observer whose eclipse ends after the Sun has set', () => {
            // South Pacific Ocean: Sun sets partway through, so last contact is below the horizon.
            const location: Location = {lat: -35, lon: -130, elevation: 0};

            const result = getContactTaus(elements, location);

            expect(result).not.toBeNull();
            expect(result?.c1).toBeCloseTo(1.139556, 6);
            expect(result?.c4).toBeCloseTo(2.585643, 6);
            expect(result?.sunrise).toBeNull();
            expect(result?.sunset).toBeCloseTo(1.846489, 6);
        });

        it('had an observer for whom the eclipse stayed below the horizon', () => {
            // Cape Town: inside the penumbra, but the Sun never rises during the eclipse.
            const location: Location = {lat: -33.9249, lon: 18.4241, elevation: 25};

            const result = getContactTaus(elements, location);

            expect(result).toBeNull();
        });
    });
});

describe('contactTausToContactJulianDays', () => {
    it('returns the correct contact julian days for a central-line observer', () => {
        // Union Glacier, 2021-12-04 total solar eclipse.
        const location: Location = {lat: -79.738991, lon: -82.736597, elevation: 718};
        const contactTaus = getContactTaus(besselianElements, location);

        if (contactTaus === null) {
            throw new Error('expected contact taus for a central-line observer');
        }

        const result = contactTausToContactJulianDays(besselianElements, contactTaus);

        expect(result).not.toBeNull();
        expect(result?.c1).toBeCloseTo(2459552.787327, 6);
        expect(result?.c2).toBeCloseTo(2459552.822864, 6);
        expect(result?.max).toBeCloseTo(2459552.823118, 6);
        expect(result?.c3).toBeCloseTo(2459552.823371, 6);
        expect(result?.c4).toBeCloseTo(2459552.859199, 6);
        expect(result?.sunrise).toBeNull();
        expect(result?.sunset).toBeNull();
    });
});
