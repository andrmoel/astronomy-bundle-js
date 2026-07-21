import {decodeCatalogue} from './catalogue';

const PARALLAX_OFF = 0.8,
    PARALLAX_SC = 65535 / 0.3;
const SD_OFF = 0.2,
    SD_SC = 65535 / 0.15;
const CONTACT_SC = 32767 / 8;

// Besselian elements of the total lunar eclipse of 2001 Jan 9 (from JLEX LE2001).
const ELEMENTS_2001_JAN_09 = [
    2451919.348374, 20, 64.1, 2.162, 1.189, 1, 3.29475, 1.02253, 0.27861, -2.23117, -1.27481, -0.14757, 0.36098,
    0.86973, 1.99702, 2.95278, 111.0355098, 0.68656, -0.000073, 22.3913306, -0.03239, -0.001453,
];

function encodeEntry(block: number[]): Buffer {
    const midnight = Math.floor(block[0] - 0.5) + 0.5;
    const buf = Buffer.allocUnsafe(64);

    buf.writeUInt32LE(midnight - 0.5, 0);
    buf.writeFloatLE(block[0] - midnight, 4);
    buf.writeUInt8(block[1], 8);
    buf.writeUInt8(block[5], 9);
    buf.writeFloatLE(block[3], 10);
    buf.writeFloatLE(block[4], 14);
    buf.writeFloatLE(block[6], 18);
    buf.writeUInt16LE(Math.round((block[7] - PARALLAX_OFF) * PARALLAX_SC), 22);
    buf.writeUInt16LE(Math.round((block[8] - SD_OFF) * SD_SC), 24);
    [9, 10, 11, 12, 13, 14, 15].forEach((idx, i) => {
        buf.writeInt16LE(Math.round(block[idx] * CONTACT_SC), 26 + i * 2);
    });
    [16, 17, 18, 19, 20, 21].forEach((idx, i) => {
        buf.writeFloatLE(block[idx], 40 + i * 4);
    });

    return buf;
}

describe('decodeCatalogue', () => {
    it('round-trips a lunar eclipse Besselian element entry', () => {
        const base64 = encodeEntry(ELEMENTS_2001_JAN_09).toString('base64');

        const catalogue = decodeCatalogue(base64);
        const raw = catalogue[2451918.5];

        expect(Object.keys(catalogue)).toEqual(['2451918.5']);
        expect(raw).toHaveLength(22);
        ELEMENTS_2001_JAN_09.forEach((expected, index) => {
            if (index === 2) {
                return; // index 2 is a reserved slot (deltaT removed)
            }
            expect(raw[index]).toBeCloseTo(expected, 3);
        });
    });

    it('decodes multiple entries keyed by midnight julian day', () => {
        const second = [...ELEMENTS_2001_JAN_09];
        second[0] = 2452096.122488; // 2001 Jul 5

        const base64 = Buffer.concat([encodeEntry(ELEMENTS_2001_JAN_09), encodeEntry(second)]).toString('base64');

        const catalogue = decodeCatalogue(base64);

        expect(Object.keys(catalogue).sort()).toEqual(['2451918.5', '2452095.5']);
        expect(catalogue[2452095.5][0]).toBeCloseTo(2452096.122488, 3);
    });
});
