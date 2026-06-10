import {parseBesselianElements} from '@package/solarEclipse';
import {dateStringToJulianDay, julianDay2time} from '@package/time/utils/dateTime';
import type {BesselianElements, Catalogue} from '../types/BesselianElementTypes';

export interface CatalogueRange {
    dateFrom: number;
    dateTo: number;
    outOfRangeHint?: string;
}

const STANDARD_CATALOGUE_RANGE: CatalogueRange = {
    dateFrom: 1900,
    dateTo: 2100,
    outOfRangeHint: ' Use catalogue-full for dates outside this range.',
};

// Binary format per entry (63 bytes):
//  [0]  uint32  keyInt        — JD key integer part (key = keyInt + 0.5)
//  [4]  float32 t0Offset      — t0Jde - key, range [0, 1)
//  [8]  uint8   t0Hours       — hours 0–23
//  [9]  float32 deltaT        — deltaT in seconds
//  [13] float32 x0
//  [17] uint16  x1            — quantized: (val - 0.43) * 409594
//  [19] int16   x2            — quantized: val * 3.2767e8
//  [21] int16   x3            — quantized: val * 2.97882e9
//  [23] float32 y0
//  [27] int16   y1            — quantized: val * 109223
//  [29] int16   y2            — quantized: val * 1.09223e8
//  [31] int16   y3            — quantized: val * 5.95764e9
//  [33] float32 d0
//  [37] int16   d1            — quantized: val * 1.92747e6
//  [39] int16   d2            — quantized: val * 4.36893e9
//  [41] float32 mu0
//  [45] uint16  mu1           — quantized: (val - 14.99) * 3.855e6
//  [47] uint16  l1_0          — quantized: (val - 0.528) * 1337455
//  [49] int16   l1_1          — quantized: val * 2.18447e8
//  [51] int16   l1_2          — quantized: val * 2.3405e9
//  [53] int16   l2_0          — quantized: val * 1057000
//  [55] int16   l2_1          — quantized: val * 2.18447e8
//  [57] int16   l2_2          — quantized: val * 2.3405e9
//  [59] uint16  tanF1         — quantized: (val - 0.00455) * 2.6214e8
//  [61] uint16  tanF2         — quantized: (val - 0.00452) * 2.6214e8
//  mu2 omitted — always 0 in all catalogue entries

const ENTRY_BYTES = 63;

// Decode scales (reciprocals stored to avoid repeated division)
const X1_OFF = 0.43,
    X1_SC = 1 / 409594;
const X2_SC = 1 / 327670000;
const X3_SC = 1 / 2978820000;
const Y1_SC = 1 / 109223;
const Y2_SC = 1 / 109223000;
const Y3_SC = 1 / 5957640000;
const D1_SC = 1 / 1927470;
const D2_SC = 1 / 4368930000;
const MU1_OFF = 14.99,
    MU1_SC = 1 / 3855000;
const L10_OFF = 0.528,
    L10_SC = 1 / 1337455;
const L11_SC = 1 / 218447000;
const L12_SC = 1 / 2340500000;
const L20_SC = 1 / 1057000;
const L21_SC = 1 / 218447000;
const L22_SC = 1 / 2340500000;
const TF1_OFF = 0.00455,
    TF1_SC = 1 / 262140000;
const TF2_OFF = 0.00452,
    TF2_SC = 1 / 262140000;

function decodeBase64(base64: string): Uint8Array {
    if (typeof Buffer !== 'undefined') {
        return Buffer.from(base64, 'base64');
    }
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}

export function decodeCatalogue(base64: string): Catalogue {
    const bytes = decodeBase64(base64);
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const count = bytes.byteLength / ENTRY_BYTES;
    const catalogue: Catalogue = {};

    for (let i = 0; i < count; i++) {
        const o = i * ENTRY_BYTES;
        const keyInt = view.getUint32(o, true);
        const t0Off = view.getFloat32(o + 4, true);
        const t0Hours = view.getUint8(o + 8);
        const deltaT = view.getFloat32(o + 9, true);

        const jd = keyInt + 0.5;

        catalogue[jd] = [
            jd + t0Off, // 0  t0Jde
            t0Hours, // 1  t0Hours
            -4, // 2  tMin  (constant)
            4, // 3  tMax  (constant)
            deltaT, // 4  deltaT
            0, // 5  unused (constant)
            view.getFloat32(o + 13, true), // 6  x0
            view.getUint16(o + 17, true) * X1_SC + X1_OFF, // 7  x1
            view.getInt16(o + 19, true) * X2_SC, // 8  x2
            view.getInt16(o + 21, true) * X3_SC, // 9  x3
            view.getFloat32(o + 23, true), // 10 y0
            view.getInt16(o + 27, true) * Y1_SC, // 11 y1
            view.getInt16(o + 29, true) * Y2_SC, // 12 y2
            view.getInt16(o + 31, true) * Y3_SC, // 13 y3
            view.getFloat32(o + 33, true), // 14 d0
            view.getInt16(o + 37, true) * D1_SC, // 15 d1
            view.getInt16(o + 39, true) * D2_SC, // 16 d2
            view.getFloat32(o + 41, true), // 17 mu0
            view.getUint16(o + 45, true) * MU1_SC + MU1_OFF, // 18 mu1
            0, // 19 mu2  (constant)
            view.getUint16(o + 47, true) * L10_SC + L10_OFF, // 20 l1_0
            view.getInt16(o + 49, true) * L11_SC, // 21 l1_1
            view.getInt16(o + 51, true) * L12_SC, // 22 l1_2
            view.getInt16(o + 53, true) * L20_SC, // 23 l2_0
            view.getInt16(o + 55, true) * L21_SC, // 24 l2_1
            view.getInt16(o + 57, true) * L22_SC, // 25 l2_2
            view.getUint16(o + 59, true) * TF1_SC + TF1_OFF, // 26 tanF1
            view.getUint16(o + 61, true) * TF2_SC + TF2_OFF, // 27 tanF2
        ];
    }

    return catalogue;
}

export function getAvailableEclipseDates(catalogue: Catalogue, dateFrom?: string, dateTo?: string): Array<string> {
    const jdFrom = dateFrom !== undefined ? dateStringToJulianDay(dateFrom) : -Infinity;
    const jdTo = dateTo !== undefined ? dateStringToJulianDay(dateTo) : Infinity;

    return Object.keys(catalogue)
        .map(Number)
        .filter((jd) => jd >= jdFrom && jd <= jdTo)
        .sort((a, b) => a - b)
        .map((jd) => {
            const {year, month, day} = julianDay2time(jd);
            return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        });
}

export function getBesselianElements(
    catalogue: Catalogue,
    dateStr: string,
    range: CatalogueRange = STANDARD_CATALOGUE_RANGE,
): BesselianElements {
    const year = getDateStringYear(dateStr);
    if (year < range.dateFrom || year > range.dateTo) {
        throw new Error(
            `Date ${dateStr} is outside the catalogue range (${range.dateFrom}–${range.dateTo}).${range.outOfRangeHint ?? ''}`,
        );
    }

    const jd = dateStringToJulianDay(dateStr);
    const raw = catalogue[jd];

    if (!raw) {
        throw new Error(`No Besselian elements found for eclipse on ${dateStr}`);
    }

    return parseBesselianElements(raw);
}

function getDateStringYear(dateStr: string): number {
    const match = /^([+-]?\d+)-/.exec(dateStr);

    if (!match) {
        return Number.NaN;
    }

    return Number(match[1]);
}
