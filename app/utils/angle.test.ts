import {
    angle2deg,
    decimal2degreeMinutes,
    decimal2degreeMinutesSeconds,
    deg2angle,
    deg2time,
    normalizeAngle,
    sec2deg,
    time2deg,
} from './angle';

it('tests deg2angle', () => {
    expect(deg2angle(0.0)).toBe('0° 00\' 00"');
    expect(deg2angle(45.2625)).toBe('45° 15\' 45"');
    expect(deg2angle(270.5)).toBe('270° 30\' 00"');
    expect(deg2angle(0.2625)).toBe('0° 15\' 45"');
    expect(deg2angle(-0.2625)).toBe('-0° 15\' 45"');
    expect(deg2angle(0.00105222)).toBe('0° 00\' 03.788"');
    expect(deg2angle(-0.00105222)).toBe('-0° 00\' 03.788"');
    expect(deg2angle(0.2625, true)).toBe('15\' 45"');
    expect(deg2angle(-0.2625, true)).toBe('-15\' 45"');
    expect(deg2angle(0.00105222, true)).toBe('03.788"');
    expect(deg2angle(-0.00105222, true)).toBe('-03.788"');
    expect(deg2angle(-24.929312194388)).toBe('-24° 55\' 45.524"');
});

it('tests angle2deg', () => {
    expect(angle2deg('0°0\'0"')).toBeCloseTo(0.0, 6);
    expect(angle2deg('45°15\'45"')).toBeCloseTo(45.2625, 6);
    expect(angle2deg('45° 15\' 45"')).toBeCloseTo(45.2625, 6);
    expect(angle2deg('270°30\'0"')).toBeCloseTo(270.5, 6);
    expect(angle2deg('-0°0\'3.788"')).toBeCloseTo(-0.001052, 6);
});

it('tests deg2time', () => {
    expect(deg2time(0.0)).toBe('0h 00m 00s');
    expect(deg2time(45.4)).toBe('3h 01m 36s');
    expect(deg2time(360)).toBe('24h 00m 00s');
    expect(deg2time(-45.4)).toBe('-3h 01m 36s');
});

it('tests time2deg', () => {
    expect(time2deg('0h0m0s')).toBeCloseTo(0, 6);
    expect(time2deg('3h1m36s')).toBeCloseTo(45.4, 6);
    expect(time2deg('03h01m36s')).toBeCloseTo(45.4, 6);
    expect(time2deg('3h 1m 36s')).toBeCloseTo(45.4, 6);
    expect(time2deg('24h0m0s')).toBeCloseTo(360, 6);
    expect(time2deg('-3h1m36s')).toBeCloseTo(-45.4, 6);
    expect(time2deg('12h45m15.512s')).toBeCloseTo(191.314633, 6);
});

describe('tests for decimal2degreeMinutes', () => {
    it('tests positive values', () => {
        expect(decimal2degreeMinutes(0.0)).toBe("0° 00'");
        expect(decimal2degreeMinutes(45.2625)).toBe("45° 15.75'");
        expect(decimal2degreeMinutes(270.5)).toBe("270° 30'");
        expect(decimal2degreeMinutes(0.2625)).toBe("0° 15.75'");
        expect(decimal2degreeMinutes(0.00105222)).toBe("0° 0.06313'");
    });

    it('tests negative values', () => {
        expect(decimal2degreeMinutes(-0.2625)).toBe("-0° 15.75'");
        expect(decimal2degreeMinutes(-0.00105222)).toBe("-0° 0.06313'");
    });

    it('tests prefix', () => {
        const prefixes = {positivePrefix: 'N ', negativePrefix: 'S '};

        expect(decimal2degreeMinutes(0.0, false, prefixes)).toBe("N 0° 00'");
        expect(decimal2degreeMinutes(45.2625, false, prefixes)).toBe("N 45° 15.75'");
        expect(decimal2degreeMinutes(-0.2625, false, prefixes)).toBe("S 0° 15.75'");
        expect(decimal2degreeMinutes(-0.00105222, false, prefixes)).toBe("S 0° 0.06313'");
        expect(decimal2degreeMinutes(0.2625, true, prefixes)).toBe("N 15.75'");
        expect(decimal2degreeMinutes(-0.00105222, true, prefixes)).toBe("S 0.06313'");
    });
});

describe('tests for decimal2degreeMinutesSeconds', () => {
    it('tests positive values', () => {
        expect(decimal2degreeMinutesSeconds(0.0)).toBe('0° 00\' 00"');
        expect(decimal2degreeMinutesSeconds(45.2625)).toBe('45° 15\' 45"');
        expect(decimal2degreeMinutesSeconds(270.5)).toBe('270° 30\' 00"');
        expect(decimal2degreeMinutesSeconds(0.2625)).toBe('0° 15\' 45"');
        expect(decimal2degreeMinutesSeconds(0.00105222)).toBe('0° 00\' 03.788"');
    });

    it('tests negative values', () => {
        expect(decimal2degreeMinutesSeconds(-0.2625)).toBe('-0° 15\' 45"');
        expect(decimal2degreeMinutesSeconds(-0.00105222)).toBe('-0° 00\' 03.788"');
    });

    it('tests shortened positive values', () => {
        expect(decimal2degreeMinutesSeconds(0.0, true)).toBe('00"');
        expect(decimal2degreeMinutesSeconds(45.2625, true)).toBe('45° 15\' 45"');
        expect(decimal2degreeMinutesSeconds(0.2625, true)).toBe('15\' 45"');
    });

    it('tests shortened negative values', () => {
        expect(decimal2degreeMinutesSeconds(-0.2625, true)).toBe('-15\' 45"');
        expect(decimal2degreeMinutesSeconds(-0.00105222, true)).toBe('-03.788"');
    });

    it('tests prefix', () => {
        const prefixes = {positivePrefix: 'N ', negativePrefix: 'S '};

        expect(decimal2degreeMinutesSeconds(0.0, false, prefixes)).toBe('N 0° 00\' 00"');
        expect(decimal2degreeMinutesSeconds(45.2625, false, prefixes)).toBe('N 45° 15\' 45"');
        expect(decimal2degreeMinutesSeconds(-0.2625, false, prefixes)).toBe('S 0° 15\' 45"');
        expect(decimal2degreeMinutesSeconds(-0.00105222, false, prefixes)).toBe('S 0° 00\' 03.788"');
        expect(decimal2degreeMinutesSeconds(0.2625, true, prefixes)).toBe('N 15\' 45"');
        expect(decimal2degreeMinutesSeconds(-0.00105222, true, prefixes)).toBe('S 03.788"');
    });
});

it('tests normalizeAngle', () => {
    expect(normalizeAngle(0)).toBeCloseTo(0, 1);
    expect(normalizeAngle(12.5)).toBeCloseTo(12.5, 1);
    expect(normalizeAngle(359)).toBeCloseTo(359, 1);
    expect(normalizeAngle(360)).toBeCloseTo(0, 1);
    expect(normalizeAngle(5964.3)).toBeCloseTo(204.3, 1);
    expect(normalizeAngle(-45)).toBeCloseTo(315, 1);
    expect(normalizeAngle(259, 180)).toBeCloseTo(79, 1);
});

it('tests sec2deg', () => {
    expect(sec2deg(3600)).toBeCloseTo(1, 8);
    expect(sec2deg(180)).toBeCloseTo(0.05, 8);
    expect(sec2deg(90)).toBeCloseTo(0.025, 8);
    expect(sec2deg(15.5)).toBeCloseTo(0.00430556, 8);
    expect(sec2deg(0.04)).toBeCloseTo(0.00001111, 8);
    expect(sec2deg(-5.4)).toBeCloseTo(-0.0015, 8);
});
