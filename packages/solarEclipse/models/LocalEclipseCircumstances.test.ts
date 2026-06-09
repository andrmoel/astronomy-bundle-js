import Location from '@package/location/models/Location';
import {LocalEclipseCircumstances} from '@package/solarEclipse';
import {LocalSolarEclipseType} from '@package/solarEclipse/enums/SolarEclipseType';
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import TimeOfInterest from '@package/time/models/TimeOfInterest';

const elements: BesselianElements = {
    t0Jde: 2461619.92211,
    t0Hours: 10,
    tMin: -3,
    tMax: 3,
    deltaT: 69.3,
    x: [-0.019772, 0.54471231, -0.0000446, -0.00000922],
    y: [0.160061, -0.2111582, -0.0001217, 0.00000376],
    d: [17.76247025, -0.010181, -0.000004],
    mu: [328.42254639, 15.00209999, 0],
    l1: [0.53059602, 0.0000138, -0.0000128],
    l2: [-0.015464, 0.0000137, -0.0000128],
    tanF1: 0.0046064,
    tanF2: 0.0045834,
};

// Jeddah
const location = Location.create(21.52854, 39.14387, 6);

const toiNoEclipse = TimeOfInterest.fromTime(2027, 8, 2, 8, 55, 50);
const toiPartial = TimeOfInterest.fromTime(2027, 8, 2, 10, 1, 5);
const toiTotal = TimeOfInterest.fromTime(2027, 8, 2, 10, 23, 13);

const circumstancesNoEclipse = LocalEclipseCircumstances.create(elements, location, toiNoEclipse);
const circumstancesPartial = LocalEclipseCircumstances.create(elements, location, toiPartial);
const circumstancesTotal = LocalEclipseCircumstances.create(elements, location, toiTotal);

describe('getType', () => {
    it('returns the eclipse type if eclipse has not started', () => {
        const result = circumstancesNoEclipse.getEclipseType();

        expect(result).toBe(LocalSolarEclipseType.None);
    });
    it('returns the eclipse type if eclipse is in partial phase', () => {
        const result = circumstancesPartial.getEclipseType();

        expect(result).toBe(LocalSolarEclipseType.Partial);
    });

    it('returns the eclipse type if eclipse is in total phase', () => {
        const result = circumstancesTotal.getEclipseType();

        expect(result).toBe(LocalSolarEclipseType.Total);
    });
});

describe('isInEclipse', () => {
    it('returns false if eclipse has not started', () => {
        const result = circumstancesNoEclipse.isInEclipse();

        expect(result).toBe(false);
    });
    it('returns true if eclipse is in partial phase', () => {
        const result = circumstancesPartial.isInEclipse();

        expect(result).toBe(true);
    });

    it('returns true if eclipse is in total phase', () => {
        const result = circumstancesTotal.isInEclipse();

        expect(result).toBe(true);
    });
});

describe('isInCentralEclipse', () => {
    it('returns false if eclipse has not started', () => {
        const result = circumstancesNoEclipse.isInCentralEclipse();

        expect(result).toBe(false);
    });
    it('returns false if eclipse is in partial phase', () => {
        const result = circumstancesPartial.isInCentralEclipse();

        expect(result).toBe(false);
    });

    it('returns true if eclipse is in total phase', () => {
        const result = circumstancesTotal.isInCentralEclipse();

        expect(result).toBe(true);
    });
});

describe('getMagnitude', () => {
    it('returns magnitude if eclipse has not started', () => {
        const result = circumstancesNoEclipse.getMagnitude();

        expect(result).toBeCloseTo(-0.053991, 6);
    });
    it('returns magnitude if eclipse is in partial phase', () => {
        const result = circumstancesPartial.getMagnitude();

        expect(result).toBeCloseTo(0.737326, 6);
    });

    it('returns magnitude if eclipse is in total phase', () => {
        const result = circumstancesTotal.getMagnitude();

        expect(result).toBeCloseTo(1.011528, 6);
    });
});

describe('getObscuration', () => {
    it('returns obscuration if eclipse has not started', () => {
        const result = circumstancesNoEclipse.getObscuration();

        expect(result).toBe(0);
    });
    it('returns obscuration if eclipse is in partial phase', () => {
        const result = circumstancesPartial.getObscuration();

        expect(result).toBeCloseTo(0.684328, 6);
    });

    it('returns obscuration if eclipse is in total phase', () => {
        const result = circumstancesTotal.getObscuration();

        expect(result).toBe(1);
    });
});
