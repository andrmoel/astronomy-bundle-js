import type {Location} from '@app/types/LocationTypes';
import {LocalSolarEclipseType} from '@package/solarEclipse/enums/SolarEclipseType';
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import {
    getLocalEclipseCircumstances,
    getLocalEclipseType,
    getLocalHorizontalCoordinates,
    getMagnitude,
    getMaximumEclipse,
    getMoonSunRatio,
    getObscuration,
} from './localCircumstances';

// HSE 2023-04-20
const elements: BesselianElements = {
    t0Jde: 2460054.67912,
    t0Hours: 4,
    tMin: -3,
    tMax: 3,
    deltaT: 69.2,
    x: [0.02685, 0.49501821, 0.0000135, -0.00000706],
    y: [-0.42736599, 0.2441992, -0.0000494, -0.00000368],
    d: [11.41178989, 0.013741, -0.000003],
    mu: [240.24293518, 15.00341988, 0],
    l1: [0.54680401, 0.0001216, -0.0000116],
    l2: [0.000663, 0.000121, -0.0000115],
    tanF1: 0.004655,
    tanF2: 0.0046318,
};

// Exmouth, Australia
const locationTotal: Location = {
    lat: -21.9542,
    lon: 114.14018,
    elevation: 1,
};
const locationAnnular: Location = {
    lat: -48.06043,
    lon: 65.43736,
    elevation: 0,
};

const circumstancesNoEclipseExmouth = {
    u: -0.39948361901158014,
    v: -0.38564272651783593,
    l1: 0.5433953509227093,
    l2: -0.002728524444233197,
    distance: 0.5552544231023286,
    hourAngle: 5.673427471091657,
    sinD: 0.19740396390033055,
    cosD: 0.9803222302061894,
};

const circumstancesPartialEclipseExmouth = {
    u: -0.15301704950032158,
    v: -0.15173442441239315,
    l1: 0.5430725593441962,
    l2: -0.003049812550998987,
    distance: 0.21549374234428276,
    hourAngle: 5.902618197841479,
    sinD: 0.19760986972363895,
    cosD: 0.9802807451887476,
};

const circumstancesMaximumEclipseExmouth = {
    u: 0.0006822685435502185,
    v: -0.0006902970430300304,
    l1: 0.542960673183228,
    l2: -0.003161175368268852,
    distance: 0.0009705670369089092,
    hourAngle: 6.05543018850995,
    sinD: 0.19774710806100118,
    cosD: 0.9802530700046345,
};

describe('getLocalEclipseCircumstances', () => {
    it('returns the local eclipse circumstances for a given time', () => {
        const tauMaxEclipse = -0.4761180790383499;

        const result = getLocalEclipseCircumstances(elements, locationTotal, tauMaxEclipse);

        expect(result).toEqual(circumstancesMaximumEclipseExmouth);
    });
});

describe('isEclipseVisible', () => {
    // TODO ...
});

describe('getEclipseType', () => {
    it('returns none if no eclipse is given', () => {
        const tau = -1.93492838; // no eclipse

        const result = getLocalEclipseCircumstances(elements, locationTotal, tau);

        expect(getLocalEclipseType(result)).toBe(LocalSolarEclipseType.None);
    });

    it('returns partial for Exmouth during partial phase', () => {
        const tau = -1.059683839; // Partial eclipse

        const result = getLocalEclipseCircumstances(elements, locationAnnular, tau);

        expect(getLocalEclipseType(result)).toBe(LocalSolarEclipseType.Partial);
    });

    it('returns annular for ocean during eclipse maximum', () => {
        const tau = -1.3610733592236008; // Maximum eclipse

        const result = getLocalEclipseCircumstances(elements, locationAnnular, tau);

        expect(getLocalEclipseType(result)).toBe(LocalSolarEclipseType.Annular);
    });

    it('returns total for Exmouth during eclipse maximum', () => {
        const tau = -0.4761180790383499; // Maximum eclipse

        const result = getLocalEclipseCircumstances(elements, locationTotal, tau);

        expect(getLocalEclipseType(result)).toBe(LocalSolarEclipseType.Total);
    });
});

describe('getMaximumEclipse', () => {
    it('returns maximum eclipse for maximum eclipse in Exmouth', () => {
        const result = getMaximumEclipse(circumstancesMaximumEclipseExmouth);

        expect(result).toBeCloseTo(0.00097, 5);
    });
});

describe('getMagnitude', () => {
    it('returns the magnitude for maximum eclipse in Exmouth', () => {
        const result = getMagnitude(circumstancesMaximumEclipseExmouth);

        expect(result).toBeCloseTo(1.00406, 5);
    });
});

describe('getMoonSunRatio', () => {
    it('gets the moon-sun-ratio for maximum eclipse in Exmouth', () => {
        const result = getMoonSunRatio(circumstancesMaximumEclipseExmouth);

        expect(result).toBeCloseTo(1.01171, 5);
    });
});

describe('getObscuration', () => {
    it('gets the obscuration for no eclipse in Exmouth', () => {
        const result = getObscuration(circumstancesNoEclipseExmouth);

        expect(result).toBeCloseTo(0, 5);
    });

    it('gets the obscuration for partial eclipse in Exmouth', () => {
        const result = getObscuration(circumstancesPartialEclipseExmouth);

        expect(result).toBeCloseTo(0.5141, 5);
    });

    it('gets the obscuration for maximum eclipse in Exmouth', () => {
        const result = getObscuration(circumstancesMaximumEclipseExmouth);

        expect(result).toBeCloseTo(1, 5);
    });
});

describe('getLocalHorizontalCoordinates', () => {
    it('returns the geometric Sun horizontal coordinates in degrees for maximum eclipse in Exmouth', () => {
        const result = getLocalHorizontalCoordinates(circumstancesMaximumEclipseExmouth, locationTotal);

        expect(result.azimuth).toBeCloseTo(22.271663, 6);
        expect(result.altitude).toBeCloseTo(54.268116, 6);
        expect(result.radiusVector).toBe(0);
    });
});
