// 2021-12-04 total solar eclipse
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import {getCentralLine} from '@package/solarEclipse/utils/eclipsePaths';

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

describe('getCenterLine', () => {
    it('returns the central line with default 10 sec steps', () => {
        const result = getCentralLine(elements);

        expect(result).toHaveLength(365);
        expect(result[0]).toEqual({lat: -54.04560676491059, lon: -49.35712967288015});
    });

    it('returns the central line with custom 1 sec steps', () => {
        const result = getCentralLine(elements, 1);

        expect(result).toHaveLength(3654);
        expect(result[0]).toEqual({lat: -53.42722771691792, lon: -50.51744486801903});
    });
});
