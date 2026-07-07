import {parseBesselianElements} from '@package/lunarEclipse';
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

// Binary format per entry (68 bytes):
//  [0]  uint32  keyInt        — midnight JD key integer part (key = keyInt + 0.5)
//  [4]  float32 t0Offset      — t0Jde - key, range [0, 1)
//  [8]  uint8   t0Hours       — reference hour of t0 (0–23)
//  [9]  uint8   eclipseType   — 1 = total, 2 = partial, 3 = penumbral
//  [10] float32 deltaT        — deltaT in seconds
//  [14] float32 penumbralMagnitude
//  [18] float32 umbralMagnitude
//  [22] float32 apparentSiderealTime — hours
//  [26] uint16  moonParallax  — quantized: (val - 0.8) * (65535 / 0.3)
//  [28] uint16  moonSemidiameter — quantized: (val - 0.2) * (65535 / 0.15)
//  [30] int16   p1            — quantized contact: val * (32767 / 8), hours from t0
//  [32] int16   u1
//  [34] int16   u2
//  [36] int16   greatest
//  [38] int16   u3
//  [40] int16   u4
//  [42] int16   p4
//  [44] float32 ra0           — right ascension polynomial coefficients (degrees)
//  [48] float32 ra1
//  [52] float32 ra2
//  [56] float32 dec0          — declination polynomial coefficients (degrees)
//  [60] float32 dec1
//  [64] float32 dec2

const ENTRY_BYTES = 68;

const PARALLAX_OFF = 0.8,
    PARALLAX_SC = 0.3 / 65535;
const SD_OFF = 0.2,
    SD_SC = 0.15 / 65535;
const CONTACT_SC = 8 / 32767;

export function decodeCatalogue(base64: string): Catalogue {
    const bytes = decodeBase64(base64);
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const count = bytes.byteLength / ENTRY_BYTES;
    const catalogue: Catalogue = {};

    for (let i = 0; i < count; i++) {
        const o = i * ENTRY_BYTES;
        const keyInt = view.getUint32(o, true);
        const jd = keyInt + 0.5;

        catalogue[jd] = [
            jd + view.getFloat32(o + 4, true), // 0  t0Jde
            view.getUint8(o + 8), // 1  t0Hours
            view.getFloat32(o + 10, true), // 2  deltaT
            view.getFloat32(o + 14, true), // 3  penumbralMagnitude
            view.getFloat32(o + 18, true), // 4  umbralMagnitude
            view.getUint8(o + 9), // 5  eclipseType
            view.getFloat32(o + 22, true), // 6  apparentSiderealTime
            view.getUint16(o + 26, true) * PARALLAX_SC + PARALLAX_OFF, // 7  moonParallax
            view.getUint16(o + 28, true) * SD_SC + SD_OFF, // 8  moonSemidiameter
            view.getInt16(o + 30, true) * CONTACT_SC, // 9  p1
            view.getInt16(o + 32, true) * CONTACT_SC, // 10 u1
            view.getInt16(o + 34, true) * CONTACT_SC, // 11 u2
            view.getInt16(o + 36, true) * CONTACT_SC, // 12 greatest
            view.getInt16(o + 38, true) * CONTACT_SC, // 13 u3
            view.getInt16(o + 40, true) * CONTACT_SC, // 14 u4
            view.getInt16(o + 42, true) * CONTACT_SC, // 15 p4
            view.getFloat32(o + 44, true), // 16 ra0
            view.getFloat32(o + 48, true), // 17 ra1
            view.getFloat32(o + 52, true), // 18 ra2
            view.getFloat32(o + 56, true), // 19 dec0
            view.getFloat32(o + 60, true), // 20 dec1
            view.getFloat32(o + 64, true), // 21 dec2
        ];
    }

    return catalogue;
}

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
