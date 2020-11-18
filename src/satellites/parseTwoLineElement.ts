import {shortYear2longYear} from '../utils/timeCalc';

export default function parseTwoLineElement(tleString: string): object {
    let result = {};

    const rows = tleString.split('\n');

    rows.forEach((row) => {
        result = {
            ...result,
            ..._parseRow(row),
        }
    });

    return result;
}

function _parseRow(row: string): object {
    row = row.trim();
    const matches = row.match(/^([1|2]) /);

    if (matches) {
        switch (matches[1]) {
            case '1':
                return _parseRow1(row);
            case '2':
                return _parseRow2(row);
        }
    }

    return {};
}

function _parseRow1(row: string): object {
    return {
        noradNr: parseInt(row.substr(2, 5)),
        classification: row.substr(7, 1).trim(),
        internationalDesignator: row.substr(9, 8).trim(),
        epoch: shortYear2longYear(row.substr(18, 2)),
        epochDayOfYear: parseFloat(row.substr(20, 12)),
        firstDerivativeMeanMotion: parseFloat(row.substr(33, 10)),
        secondDerivativeMeanMotion: _parseExpString(row.substr(44, 8)),
        dragTerm: _parseExpString(row.substr(53, 8)),
        ephemerisType: parseInt(row.substr(62, 1)),
        setNumber: parseInt(row.substr(64, 4)),
    }
}

function _parseRow2(row: string): object {
    return {
        catalogNumber: parseInt(row.substr(2, 5)),
        inclination: parseFloat(row.substr(8, 8)),
        rightAscension: parseFloat(row.substr(17, 8)),
        eccentricity: parseFloat('0.' + row.substr(26, 7)),
        argumentOfPerigee: parseFloat(row.substr(34, 8)),
        meanAnomaly: parseFloat(row.substr(52, 11)),
        revolution: parseInt(row.substr(63, 5)),
    }
}

function _parseExpString(expString: string): number {
    const matches = expString.match(/^([ -]?)([0-9]+)(-[0-9])$/);

    if (matches) {
        const fixedString = matches[1] + '.' + matches[2] + 'e' + matches[3];

        return parseFloat(fixedString);
    }

    return parseFloat(expString);
}
