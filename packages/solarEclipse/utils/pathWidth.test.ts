import {Catalogue} from '@package/solarEclipse/index.catalogue-full';
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import {getTauOfGreatestEclipse} from '@package/solarEclipse/utils/greatestEclipse';
import {getUmbraPathWidth} from '@package/solarEclipse/utils/pathWidth';

// 2019-07-02 total solar eclipse
const elementsTotal: BesselianElements = {
    t0Jde: 2458667.30842,
    t0Hours: 19,
    tMin: -3,
    tMax: 3,
    deltaT: 69.4,
    x: [-0.215634, 0.56620872, 0.0000274, -0.00000879],
    y: [-0.65070802, 0.0106399, -0.0001272, -2.7e-7],
    d: [23.0129509, -0.003187, -0.000005],
    mu: [103.9797287, 14.99950981, 0],
    l1: [0.53763098, -0.0000898, -0.000012],
    l2: [-0.008464, -0.0000894, -0.000012],
    tanF1: 0.0045984,
    tanF2: 0.0045755,
    saros: 127,
};

// 2016-09-01 annular solar eclipse
const elementsAnnular: BesselianElements = {
    t0Jde: 2457632.88058,
    t0Hours: 9,
    tMin: -3,
    tMax: 3,
    deltaT: 68.4,
    x: [-0.161396, 0.50406349, -0.0000214, -0.00000631],
    y: [-0.29965001, -0.1481521, -0.0000258, 0.00000178],
    d: [8.06330013, -0.014802, -0.000002],
    mu: [315.03155518, 15.00454044, 0],
    l1: [0.55792803, 0.0001115, -0.0000105],
    l2: [0.011731, 0.000111, -0.0000104],
    tanF1: 0.0046339,
    tanF2: 0.0046109,
    saros: 135,
};

// 2022-04-30 partial solar eclipse (the shadow axis misses the Earth)
const elementsPartial: BesselianElements = {
    t0Jde: 2459700.36292,
    t0Hours: 21,
    tMin: -3,
    tMax: 3,
    deltaT: 69.3,
    x: [0.61808002, 0.47531471, -0.0000015, -0.00000568],
    y: [-1.02808905, 0.2096405, -0.0000432, -0.00000268],
    d: [14.97103977, 0.012167, -0.000003],
    mu: [135.70559692, 15.00247002, 0],
    l1: [0.56107301, 0.0000847, -0.0000103],
    l2: [0.014861, 0.0000843, -0.0000102],
    tanF1: 0.004642,
    tanF2: 0.0046189,
    saros: 119,
};

// NASA/Espenak central-line path widths in kilometres.
const nasaReferenceWidthsKm = [
    {date: '2024-10-02', widthKm: 266},
    {date: '2026-08-12', widthKm: 294},
    {date: '2021-06-10', widthKm: 527},
    {date: '2024-04-08', widthKm: 198},
    {date: '2017-08-21', widthKm: 115},
];

describe('getUmbraPathWidth', () => {
    it('returns the umbra path width in metres for a total eclipse', () => {
        const tau = getTauOfGreatestEclipse(elementsTotal);

        expect(getUmbraPathWidth(elementsTotal, tau)).toBeCloseTo(200867.2, 1);
    });

    it('returns the antumbra path width in metres for an annular eclipse', () => {
        const tau = getTauOfGreatestEclipse(elementsAnnular);

        expect(getUmbraPathWidth(elementsAnnular, tau)).toBeCloseTo(99752.1, 1);
    });

    it('returns 0 for a partial eclipse whose axis misses the Earth', () => {
        const tau = getTauOfGreatestEclipse(elementsPartial);

        expect(getUmbraPathWidth(elementsPartial, tau)).toBe(0);
    });

    it.each(nasaReferenceWidthsKm)('is within 0.5% of the NASA path width for $date', ({date, widthKm}) => {
        const elements = Catalogue.getBesselianElements(date);
        const tau = getTauOfGreatestEclipse(elements);

        const widthKmActual = getUmbraPathWidth(elements, tau) / 1000;

        expect(Math.abs(widthKmActual - widthKm) / widthKm).toBeLessThan(0.005);
    });
});
