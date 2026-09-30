import TimeOfInterest from '@package/time/models/TimeOfInterest';
import type {TwoLineElement} from '../types/SatelliteTypes';

const LINE_LENGTH = 69;

export function parseTwoLineElement(tle: string): TwoLineElement {
    const lines = tle
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line !== '');

    if (lines.length !== 2 && lines.length !== 3) {
        throw new Error(`TLE must consist of 2 or 3 lines, got ${lines.length}`);
    }

    const [line1, line2] = lines.slice(-2);
    const name = lines.length === 3 ? parseName(lines[0]) : null;

    validateLine(line1, 1);
    validateLine(line2, 2);

    return {
        name,
        satelliteNumber: parseInt(line1.substring(2, 7), 10),
        classification: line1.substring(7, 8),
        internationalDesignator: line1.substring(9, 17).trim(),
        epoch: parseEpoch(line1.substring(18, 20), line1.substring(20, 32)),
        meanMotionFirstDerivative: parseFloat(line1.substring(33, 43)),
        meanMotionSecondDerivative: parseImpliedDecimal(line1.substring(44, 52)),
        bstarDragTerm: parseImpliedDecimal(line1.substring(53, 61)),
        ephemerisType: parseInt(line1.substring(62, 63), 10),
        elementSetNumber: parseInt(line1.substring(64, 68), 10),
        inclination: parseFloat(line2.substring(8, 16)),
        rightAscensionOfAscendingNode: parseFloat(line2.substring(17, 25)),
        eccentricity: parseFloat(`0.${line2.substring(26, 33).trim()}`),
        argumentOfPerigee: parseFloat(line2.substring(34, 42)),
        meanAnomaly: parseFloat(line2.substring(43, 51)),
        meanMotion: parseFloat(line2.substring(52, 63)),
        revolutionNumber: parseInt(line2.substring(63, 68), 10),
    };
}

function parseName(line: string): string {
    return line.replace(/^0 /, '').trim();
}

function validateLine(line: string, lineNumber: number): void {
    if (line.length !== LINE_LENGTH) {
        throw new Error(`TLE line ${lineNumber} must have ${LINE_LENGTH} characters, got ${line.length}`);
    }

    if (line[0] !== String(lineNumber)) {
        throw new Error(`TLE line ${lineNumber} must start with "${lineNumber}"`);
    }

    const expected = parseInt(line[LINE_LENGTH - 1], 10);
    const actual = getChecksum(line);

    if (expected !== actual) {
        throw new Error(`TLE line ${lineNumber} has invalid checksum ${expected}, expected ${actual}`);
    }
}

export function getChecksum(line: string): number {
    let sum = 0;

    for (const char of line.substring(0, LINE_LENGTH - 1)) {
        if (char === '-') {
            sum += 1;
        } else if (char >= '0' && char <= '9') {
            sum += parseInt(char, 10);
        }
    }

    return sum % 10;
}

function parseEpoch(yearField: string, dayOfYearField: string): TimeOfInterest {
    const twoDigitYear = parseInt(yearField, 10);
    const year = twoDigitYear < 57 ? 2000 + twoDigitYear : 1900 + twoDigitYear;
    const dayOfYear = parseFloat(dayOfYearField);
    const jdOfJanuaryZero = TimeOfInterest.fromTime(year, 1, 1).jd - 1;

    return TimeOfInterest.fromJulianDay(jdOfJanuaryZero + dayOfYear);
}

function parseImpliedDecimal(field: string): number {
    const match = /^\s*([+-]?)(\d+)([+-]\d)\s*$/.exec(field);

    if (match === null) {
        throw new Error(`Invalid TLE field "${field}"`);
    }

    const [, sign, mantissa, exponent] = match;

    return parseFloat(`${sign}0.${mantissa}e${exponent}`);
}
