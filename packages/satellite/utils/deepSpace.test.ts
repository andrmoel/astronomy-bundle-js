import {JULIAN_DAY_1950_JAN_0} from '../constants/sgp4';
import type {MeanElements, Sgp4Record} from '../types/Sgp4Types';
import {
    applyDeepSpacePeriodics,
    applyDeepSpaceSecular,
    initializeDeepSpaceCommon,
    initializeDeepSpaceSecular,
} from './deepSpace';
import {initializeSgp4} from './sgp4';
import {parseTwoLineElement} from './twoLineElement';

const TLES = {
    noResonance: [
        '1 04632U 70093B   04031.91070959 -.00000084  00000-0  10000-3 0  9955',
        '2 04632  11.4628 273.1101 1450506 207.6000 143.9350  1.20231981 44145',
    ],
    halfDayResonance: [
        '1 08195U 75081A   06176.33215444  .00000099  00000-0  11873-3 0   813',
        '2 08195  64.1586 279.0717 6877146 264.7651  20.2257  2.00491383225656',
    ],
    synchronousResonance: [
        '1 09998U 74033F   05148.79417928 -.00000112  00000-0  00000+0 0  4480',
        '2 09998   9.4958 313.1750 0270971 327.5225  30.8097  1.16186785 45878',
    ],
    equatorialGeostationary: [
        '1 28626U 05008A   06176.46683397 -.00000205  00000-0  10000-3 0  2190',
        '2 28626   0.0019 286.9433 0000335  13.7918  55.6504  1.00270176  4891',
    ],
};

type TleName = keyof typeof TLES;

describe('initializeDeepSpaceCommon', () => {
    it('computes the lunar and solar periodic coefficients', () => {
        const tle = parseTwoLineElement(TLES.halfDayResonance.join('\n'));
        const {ecco, argpo, inclo, nodeo, no} = initializeSgp4(tle);

        const common = initializeDeepSpaceCommon(tle.epoch.jd - JULIAN_DAY_1950_JAN_0, ecco, argpo, inclo, nodeo, no);

        expectClose(common.periodics, {
            e3: -0.00044080461331893485,
            ee2: -0.00010934280539375517,
            se2: 0.002501941522642427,
            se3: 0.001007241988530131,
            sgh2: -0.001261915509700673,
            sgh3: 0.0024557462815410934,
            sgh4: -0.00007471990261373487,
            sh2: 0.000945803727082508,
            sh3: -0.003970223690619602,
            si2: -0.0011105699174389213,
            si3: 0.000027357459043652322,
            sl2: 0.004083492666433326,
            sl3: -0.0021191158730878203,
            sl4: 0.00028883025414443435,
            xgh2: 0.00045492024438304195,
            xgh3: -0.00002464815107882107,
            xgh4: -0.00003933566193974774,
            xh2: -0.0006438340814881515,
            xh3: 0.0003079429279348622,
            xi2: 0.00011424082985422923,
            xi3: 0.00012000896281451981,
            xl2: -0.000786264377199448,
            xl3: -0.0004559423560476919,
            xl4: 0.00015205224896677633,
            zmol: 1.703291771990898,
            zmos: 2.972158040325546,
        });
        expect(common.sinim).toBeCloseTo(Math.sin(inclo), 15);
        expect(common.cosim).toBeCloseTo(Math.cos(inclo), 15);
        expect(common.emsq).toBeCloseTo(ecco * ecco, 15);
    });
});

describe('initializeDeepSpaceSecular', () => {
    it('computes secular rates without resonance', () => {
        expectClose(getSecular('noResonance'), {
            irez: 0,
            dedt: -5.739257257133709e-10,
            didt: -2.6694825837858047e-8,
            dmdt: -6.045613838814654e-8,
            domdt: 6.528741483006165e-8,
            dnodt: -6.171410259571943e-8,
            del1: 0,
            xfact: 0,
            xlamo: 0,
        });
    });

    it('computes the 12 hour resonance terms', () => {
        expectClose(getSecular('halfDayResonance'), {
            irez: 2,
            dedt: -2.88854762346107e-8,
            didt: -9.784108269214139e-9,
            dmdt: 9.27078674252696e-8,
            domdt: -1.4155210733836944e-8,
            dnodt: -6.124323489695265e-8,
            d2201: -1.1973595516231104e-11,
            d2211: 6.453213834121484e-11,
            d3210: -3.893722738131047e-12,
            d3222: -7.364857538023281e-12,
            d4410: 2.5769601409463443e-12,
            d4422: 4.361455592714352e-12,
            d5220: -2.5287894659528444e-12,
            d5232: 6.767712568551213e-13,
            d5421: -2.280698046561967e-12,
            d5433: -1.6595708214914194e-12,
            xfact: -0.008753597222053683,
            xlamo: 2.6628995258087294,
        });
    });

    it('computes the synchronous resonance terms', () => {
        expectClose(getSecular('synchronousResonance'), {
            irez: 1,
            dedt: 2.1424146327126998e-10,
            didt: -2.100861346922932e-8,
            dmdt: -1.0072339354525717e-7,
            domdt: -2.079390322813266e-8,
            dnodt: 5.2403008960382e-8,
            del1: -1.0692422306351076e-12,
            del2: 2.2689887988938167e-11,
            del3: 3.478296584409982e-12,
            xfact: -0.004374900909933268,
            xlamo: 2.429222236899548,
        });
    });

    it('drops the node terms for equatorial orbits', () => {
        const secular = getSecular('equatorialGeostationary');

        expect(secular.irez).toBe(1);
        expect(secular.dnodt).toBe(0);
        expectClose(secular, {domdt: 3.403399555000858e-8, xlamo: 4.797386947629335});
    });
});

describe('applyDeepSpaceSecular', () => {
    it.each<[TleName, number, MeanElements]>([
        [
            'noResonance',
            1000,
            {
                em: 0.14505002607427428,
                inclm: 0.20003690667176813,
                argpm: 3.6238615181689133,
                nodem: 4.76635478020328,
                mm: 7.758189034162011,
                nm: 0.005245868658927085,
            },
        ],
        [
            'noResonance',
            -3000,
            {
                em: 0.14505232177717714,
                inclm: 0.20014368597511956,
                argpm: 3.6216295540541705,
                nodem: 4.767617521194021,
                mm: -13.22600846705388,
                nm: 0.005245868658927085,
            },
        ],
        [
            'halfDayResonance',
            1000,
            {
                em: 0.6876857145237654,
                inclm: 1.1197690293617648,
                argpm: 4.620934214068652,
                nodem: 4.869374203687162,
                mm: 2.8179996466486905,
                nm: 0.008748547741924441,
            },
        ],
        [
            'halfDayResonance',
            -3000,
            {
                em: 0.6878012564287038,
                inclm: 1.1198081657948415,
                argpm: 4.621288315282201,
                nodem: 4.874757445489955,
                mm: -19.608347798577597,
                nm: 0.00874854728225784,
            },
        ],
        [
            'synchronousResonance',
            1000,
            {
                em: 0.02709731424146327,
                inclm: 0.1657119664974083,
                argpm: 5.7167688387561535,
                nodem: 5.465760810032857,
                mm: -6.959142425103884,
                nm: 0.005069380692429987,
            },
        ],
        [
            'synchronousResonance',
            -3000,
            {
                em: 0.027096457275610185,
                inclm: 0.16579600095128522,
                argpm: 5.715077481184051,
                nodem: 5.466457109634397,
                mm: -14.670855394625494,
                nm: 0.005069393957293706,
            },
        ],
    ])('applies secular and resonance effects for %s at %d min', (name, t, expected) => {
        const record = getRecord(name);
        const mean: MeanElements = {
            em: record.ecco,
            inclm: record.inclo,
            argpm: record.argpo + record.argpdot * t,
            nodem: record.nodeo + record.nodedot * t,
            mm: record.mo + record.mdot * t,
            nm: record.no,
        };

        const result = applyDeepSpaceSecular(record, getDeepSpace(record).secular, mean, t);

        expectClose(result, expected);
    });
});

describe('applyDeepSpacePeriodics', () => {
    it.each<[string, TleName, Record<string, number>]>([
        [
            'directly for inclinations above 0.2 rad',
            'halfDayResonance',
            {
                ep: 0.29938113040832404,
                inclp: 1.1200871522557396,
                nodep: 1.199354116694998,
                argpp: 2.3007942408123814,
                mp: 0.3988321446262381,
            },
        ],
        [
            'with the Lyddane modification below 0.2 rad',
            'synchronousResonance',
            {
                ep: 0.3000386410161157,
                inclp: 0.1659401630393301,
                nodep: 1.1995912095626757,
                argpp: 2.2969959220009364,
                mp: 0.4034146462652949,
            },
        ],
        [
            'with the Lyddane modification when the perturbation lowers the inclination below 0.2 rad',
            'noResonance',
            {
                ep: 0.3005365961079768,
                inclp: 0.19985656717764008,
                nodep: 1.2014023963924874,
                argpp: 2.298921850740488,
                mp: 0.3999041184428672,
            },
        ],
        [
            'with the Lyddane modification for near-zero inclinations',
            'equatorialGeostationary',
            {
                ep: 0.30000010651906817,
                inclp: 0.00011404701098965446,
                nodep: 2.3815142582496005,
                argpp: 1.1139595117495213,
                mp: 0.40475784239007745,
            },
        ],
    ])('applies periodics %s', (_, name, expected) => {
        const record = getRecord(name);
        const elements = {ep: 0.3, inclp: record.inclo, nodep: 1.2, argpp: 2.3, mp: 0.4};

        const result = applyDeepSpacePeriodics(getDeepSpace(record).periodics, elements, 1000);

        expectClose(result, expected);
    });
});

function getSecular(name: TleName) {
    const tle = parseTwoLineElement(TLES[name].join('\n'));
    const record = initializeSgp4(tle);
    const common = initializeDeepSpaceCommon(
        tle.epoch.jd - JULIAN_DAY_1950_JAN_0,
        record.ecco,
        record.argpo,
        record.inclo,
        record.nodeo,
        record.no,
    );

    return initializeDeepSpaceSecular(record, common, record.ecco * record.ecco, record.argpdot + record.nodedot);
}

function getRecord(name: TleName): Sgp4Record {
    return initializeSgp4(parseTwoLineElement(TLES[name].join('\n')));
}

function getDeepSpace(record: Sgp4Record) {
    if (record.deepSpace === null) {
        throw new Error('Expected a deep-space record');
    }

    return record.deepSpace;
}

function expectClose<T extends object>(actual: T, expected: Partial<Record<keyof T, number>>): void {
    for (const [key, value] of Object.entries(expected) as [keyof T, number][]) {
        const tolerance = Math.max(Math.abs(value) * 1e-10, 1e-15);

        expect(Math.abs((actual[key] as number) - value)).toBeLessThanOrEqual(tolerance);
    }
}
