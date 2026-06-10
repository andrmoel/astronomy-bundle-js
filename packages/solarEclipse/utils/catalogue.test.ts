import {decodeCatalogue, getAvailableEclipseDates, getBesselianElements} from './catalogue';

const REAL_2017_TOTAL_ECLIPSE_ENTRY =
    'goElAC/dRD8SmpmMQkOuBL4HsV/awKFyiPg+ksNj2YsuEd89QXCZ3t2pfbJC6dGhSeVpHpRi70xpCJXvSRpR';

const EXPECTED_2017_TOTAL_ECLIPSE_RAW = [
    2457987.269, 18, -4, 4, 70.3, 0, -0.129571, 0.5406426, -0.0000294, -0.0000081, 0.485416, -0.14164, -0.0000905,
    0.000002, 11.8669596, -0.013622, -0.000002, 89.24543, 15.00394, 0, 0.542093, 0.0001241, -0.0000118, -0.004025,
    0.0001234, -0.0000117, 0.0046222, 0.0045992,
];

describe('decodeCatalogue', () => {
    it('decodes a real catalogue entry', () => {
        const catalogue = decodeCatalogue(REAL_2017_TOTAL_ECLIPSE_ENTRY);
        const raw = catalogue[2457986.5];

        expect(Object.keys(catalogue)).toEqual(['2457986.5']);
        expect(raw).toHaveLength(28);

        EXPECTED_2017_TOTAL_ECLIPSE_RAW.forEach((expected, index) => {
            expect(raw[index]).toBeCloseTo(expected, 5);
        });
    });
});

describe('getAvailableEclipseDates', () => {
    it('returns sorted eclipse dates from a catalogue', () => {
        const catalogue = decodeCatalogue(REAL_2017_TOTAL_ECLIPSE_ENTRY);

        expect(getAvailableEclipseDates(catalogue)).toEqual(['2017-08-21']);
        expect(getAvailableEclipseDates(catalogue, '2017-08-21', '2017-08-21')).toEqual(['2017-08-21']);
        expect(getAvailableEclipseDates(catalogue, '2017-08-22')).toEqual([]);
    });
});

describe('getBesselianElements', () => {
    it('returns parsed Besselian elements for a real catalogue entry', () => {
        const catalogue = decodeCatalogue(REAL_2017_TOTAL_ECLIPSE_ENTRY);

        const result = getBesselianElements(catalogue, '2017-08-21');

        expect(result).toEqual({
            t0Jde: 2457987.268999994,
            t0Hours: 18,
            tMin: -4,
            tMax: 4,
            deltaT: 70.30000305175781,
            x: [-0.12957100570201874, 0.5406437106012295, -0.000029398480178228097, -0.000008099851619097495],
            y: [0.4854159951210022, -0.14163683473261127, -0.00009050291605247978, 0.000001999953001524093],
            d: [11.866959571838379, -0.01362200189886224, -0.0000020000320444593986],
            mu: [89.24542999267578, 15.003939559014267, 0],
            l1: [0.5420931844435888, 0.0001240987516422748, -0.000011800042725913265],
            l2: [-0.004024597918637654, 0.00012339835291855691, -0.000011700064088869899],
            tanF1: 0.004622201876859694,
            tanF2: 0.004599201953154802,
        });
    });

    it('throws when a requested date is outside the standard catalogue range', () => {
        const catalogue = decodeCatalogue(REAL_2017_TOTAL_ECLIPSE_ENTRY);

        expect(() => getBesselianElements(catalogue, '1899-12-31')).toThrow(
            'Date 1899-12-31 is outside the catalogue range (1900–2100). Use catalogue-full for dates outside this range.',
        );
    });

    it('throws when no eclipse exists for the requested date', () => {
        const catalogue = decodeCatalogue(REAL_2017_TOTAL_ECLIPSE_ENTRY);

        expect(() => getBesselianElements(catalogue, '2017-08-22')).toThrow(
            'No Besselian elements found for eclipse on 2017-08-22',
        );
    });
});
