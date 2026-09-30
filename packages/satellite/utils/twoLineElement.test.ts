import {getChecksum, parseTwoLineElement} from './twoLineElement';

const LINE_1 = '1 25544U 98067A   26270.17419514  .00009528  00000-0  18291-3 0  9997';
const LINE_2 = '2 25544  51.6315 155.3455 0007168 193.0560 167.0244 15.48664528587561';

describe('parseTwoLineElement', () => {
    it('parses a TLE with name line', () => {
        const tle = parseTwoLineElement(`ISS (ZARYA)\n${LINE_1}\n${LINE_2}`);

        expect(tle.name).toBe('ISS (ZARYA)');
        expect(tle.satelliteNumber).toBe(25544);
        expect(tle.classification).toBe('U');
        expect(tle.internationalDesignator).toBe('98067A');
        expect(tle.epoch.time).toEqual({year: 2026, month: 9, day: 27, hour: 4, min: 10, sec: 50});
        expect(tle.epoch.jd).toBeCloseTo(2461310.67419514, 8);
        expect(tle.meanMotionFirstDerivative).toBe(0.00009528);
        expect(tle.meanMotionSecondDerivative).toBe(0);
        expect(tle.bstarDragTerm).toBeCloseTo(0.00018291, 12);
        expect(tle.ephemerisType).toBe(0);
        expect(tle.elementSetNumber).toBe(999);
        expect(tle.inclination).toBe(51.6315);
        expect(tle.rightAscensionOfAscendingNode).toBe(155.3455);
        expect(tle.eccentricity).toBe(0.0007168);
        expect(tle.argumentOfPerigee).toBe(193.056);
        expect(tle.meanAnomaly).toBe(167.0244);
        expect(tle.meanMotion).toBe(15.48664528);
        expect(tle.revolutionNumber).toBe(58756);
    });

    it('parses a TLE without name line', () => {
        const tle = parseTwoLineElement(`${LINE_1}\n${LINE_2}`);

        expect(tle.name).toBeNull();
        expect(tle.satelliteNumber).toBe(25544);
    });

    it('strips the "0 " prefix of a 3LE name line and handles CRLF and surrounding whitespace', () => {
        const tle = parseTwoLineElement(`\n0 ISS (ZARYA)  \r\n${LINE_1}  \r\n${LINE_2}\r\n`);

        expect(tle.name).toBe('ISS (ZARYA)');
    });

    it('parses negative exponent fields and 20th century epochs', () => {
        const tle = parseTwoLineElement(
            [
                '1 25544U 98067A   08264.51782528 -.00002182  00000-0 -11606-4 0  2927',
                '2 25544  51.6416 247.4627 0006703 130.5360 325.0288 15.72125391563537',
            ].join('\n'),
        );

        expect(tle.meanMotionFirstDerivative).toBe(-0.00002182);
        expect(tle.bstarDragTerm).toBeCloseTo(-0.000011606, 12);
        expect(tle.epoch.time).toMatchObject({year: 2008, month: 9, day: 20, hour: 12, min: 25});

        const oldTle = parseTwoLineElement(
            [
                '1 00005U 58002B   00179.78495062  .00000023  00000-0  28098-4 0  4753',
                '2 00005  34.2682 348.7242 1859667 331.7664  19.3264 10.82419157413667',
            ].join('\n'),
        );

        expect(oldTle.epoch.time).toMatchObject({year: 2000, month: 6, day: 27});
        expect(oldTle.eccentricity).toBe(0.1859667);
    });

    it('interprets two-digit years from 57 as 19xx', () => {
        const line1 = '1 00005U 58002B   98179.78495062  .00000023  00000-0  28098-4 0  4750';

        expect(parseTwoLineElement(`${line1}\n${LINE_2}`).epoch.time.year).toBe(1998);
    });

    it('throws on a wrong number of lines', () => {
        expect(() => parseTwoLineElement(LINE_1)).toThrow('TLE must consist of 2 or 3 lines, got 1');
        expect(() => parseTwoLineElement(`a\nb\n${LINE_1}\n${LINE_2}`)).toThrow(
            'TLE must consist of 2 or 3 lines, got 4',
        );
    });

    it('throws on a wrong line length', () => {
        expect(() => parseTwoLineElement(`${LINE_1.slice(0, -2)}7\n${LINE_2}`)).toThrow(
            'TLE line 1 must have 69 characters, got 68',
        );
    });

    it('throws on a wrong line number', () => {
        expect(() => parseTwoLineElement(`${LINE_2}\n${LINE_1}`)).toThrow('TLE line 1 must start with "1"');
    });

    it('throws on an invalid checksum', () => {
        expect(() => parseTwoLineElement(`${LINE_1}\n${LINE_2.slice(0, -1)}0`)).toThrow(
            'TLE line 2 has invalid checksum 0, expected 1',
        );
    });
});

describe('getChecksum', () => {
    it('sums digits modulo 10 and counts minus signs as 1', () => {
        expect(getChecksum(LINE_1)).toBe(7);
        expect(getChecksum(LINE_2)).toBe(1);
        expect(getChecksum('1 25544U 98067A   08264.51782528 -.00002182  00000-0 -11606-4 0  2927')).toBe(7);
    });
});
