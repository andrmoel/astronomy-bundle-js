// 2021-12-04 total solar eclipse
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import {calculateCentralLine, getCentralLine} from './centralLine';
import {REFRACTED_HORIZON_SIN_ALTITUDE} from './constants';

// TSE 2021-12-04
const elements: BesselianElements = {
    t0Jde: 2459552.81572,
    t0Hours: 8,
    tMin: -3,
    tMax: 3,
    deltaT: 69.4,
    x: [0.025209, 0.56830281, 0.0000391, -0.00000965],
    y: [-0.98365301, -0.13151421, 0.0002213, 0.0000024],
    d: [-22.27471924, -0.005178, 0.000006],
    mu: [302.45217896, 14.99728012, 0],
    l1: [0.53780502, -0.000016, -0.0000131],
    l2: [-0.008292, -0.000016, -0.0000131],
    tanF1: 0.0047434,
    tanF2: 0.0047198,
};

describe('calculateCentralLine', () => {
    const geometric = calculateCentralLine(elements, 0);

    it('follows the same track as getCentralLine at its 1 second step, plus one hook stub per end', () => {
        const reference = getCentralLine(elements, 1);

        expect(geometric).toHaveLength(reference.length + 2);
        expect(geometric[1].lat).toBeCloseTo(reference[0].lat, 2);
        expect(geometric[1].lon).toBeCloseTo(reference[0].lon, 2);
    });

    it('extends past the geometric terminator with the refracted horizon', () => {
        // 2019-07-02: its sunset hook crosses the -50' sliver in more than one step
        const elements2019: BesselianElements = {
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
        };

        const geometric2019 = calculateCentralLine(elements2019, 0);
        const refracted = calculateCentralLine(elements2019, REFRACTED_HORIZON_SIN_ALTITUDE);

        expect(refracted.length).toBeGreaterThan(geometric2019.length);
        expect(refracted.slice(-1)[0]).not.toEqual(geometric2019.slice(-1)[0]);
    });
});

describe('getCenterLine', () => {
    it('returns the central line with default 10 sec steps', () => {
        const result = getCentralLine(elements);

        expect(result).toHaveLength(365);
        expect(result[0]).toEqual({lat: -54.04560676491059, lon: -49.35755916158149});
    });

    it('returns the central line with custom 1 sec steps', () => {
        const result = getCentralLine(elements, 1);

        expect(result).toHaveLength(3654);
        expect(result[0]).toEqual({lat: -53.42722771691792, lon: -50.51787435672037});
    });
});
