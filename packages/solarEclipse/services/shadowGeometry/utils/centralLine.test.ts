import {calculateCentralLine, getCentralLine} from './centralLine';
import {REFRACTED_HORIZON_SIN_ALTITUDE} from './constants';
import {ELEMENTS_2019_07_02, ELEMENTS_2021_12_04 as elements} from './testSupport';

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
        const geometric2019 = calculateCentralLine(ELEMENTS_2019_07_02, 0);
        const refracted = calculateCentralLine(ELEMENTS_2019_07_02, REFRACTED_HORIZON_SIN_ALTITUDE);

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
