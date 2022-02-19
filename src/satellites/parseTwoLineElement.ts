import {shortYear2longYear} from '../time/calculations/timeCalc';
import {Name, RowOneValues, RowTwoValues, TwoLineElement} from './types/TwoLineElementTypes';

export default function parseTwoLineElement(tleString: string): TwoLineElement {
    const rows = tleString.trim().split('\n');

    return {
        ..._parseName(rows),
        ..._parseRowOne(rows),
        ..._parseRowTwo(rows),
    };
}

function _parseName(rows: Array<string>): Name {
    const row = rows.find((row) => row.match(/^[A-Za-z]/));

    return {
        name: row ? row.trim() : 'satellite',
    };
}

function _parseRowOne(rows: Array<string>): RowOneValues {
    const row = _findRow(rows, 1);

    return {
        noradNr: parseInt(row.slice(2, 7)),
        classification: row.slice(7, 8).trim(),
        internationalDesignator: row.slice(9, 17).trim(),
        epochYear: shortYear2longYear(row.slice(18, 20)),
        epochDayOfYear: parseFloat(row.slice(20, 32)),
        firstDerivativeMeanMotion: parseFloat(row.slice(33, 43)),
        secondDerivativeMeanMotion: _parseExpString(row.slice(44, 52)),
        dragTerm: _parseExpString(row.slice(53, 61)),
        ephemerisType: parseInt(row.slice(62, 63)),
        setNumber: parseInt(row.slice(64, 68)),
    };
}

function _parseRowTwo(rows: Array<string>): RowTwoValues {
    const row = _findRow(rows, 2);

    return {
        catalogNumber: parseInt(row.slice(2, 7)),
        inclination: parseFloat(row.slice(8, 16)),
        rightAscension: parseFloat(row.slice(17, 25)),
        eccentricity: parseFloat('0.' + row.slice(26, 33)),
        argumentOfPerigee: parseFloat(row.slice(34, 42)),
        meanAnomaly: parseFloat(row.slice(43, 51)),
        meanMotion: parseFloat(row.slice(52, 63)),
        revolution: parseInt(row.slice(63, 68)),
    };
}

function _findRow(rows: Array<string>, rowNo: number): string {
    const regExp = new RegExp(`^${rowNo} `);
    const row = rows.find((row) => row.trim().match(regExp));

    if (!row) {
        throw Error('Missing TLE row ' + rowNo);
    }

    return row.trim();
}

function _parseExpString(expString: string): number {
    const matches = expString.match(/^([ -]?)([0-9]+)(-[0-9])$/);

    if (matches) {
        const fixedString = matches[1] + '.' + matches[2] + 'e' + matches[3];

        return parseFloat(fixedString);
    }

    return parseFloat(expString);
}
