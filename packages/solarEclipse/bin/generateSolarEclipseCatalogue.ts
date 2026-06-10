/**
 * Scrapes the NASA Five Millennium Catalog of Solar Eclipses and generates:
 *   - packages/solarEclipse/resources/solarEclipses.ts  (eclipse metadata)
 *   - packages/solarEclipse/resources/catalogue.ts      (Besselian elements, 1900–2100)
 *   - packages/solarEclipse/resources/catalogueFull.ts  (Besselian elements, full range)
 *
 * Source: https://eclipse.gsfc.nasa.gov/solar.html
 *
 * Run with:  npx ts-node ./packages/solarEclipse/bin/generateSolarEclipseCatalogue.ts
 */
import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = 'https://eclipse.gsfc.nasa.gov/SEcat5/';
const DETAIL_URL = 'https://eclipse.gsfc.nasa.gov/SEsearch/SEdata.php?Ecl=';

const CENTURY_PAGES = [
    'SE-1999--1900.html',
    'SE-1899--1800.html',
    'SE-1799--1700.html',
    'SE-1699--1600.html',
    'SE-1599--1500.html',
    'SE-1499--1400.html',
    'SE-1399--1300.html',
    'SE-1299--1200.html',
    'SE-1199--1100.html',
    'SE-1099--1000.html',
    'SE-0999--0900.html',
    'SE-0899--0800.html',
    'SE-0799--0700.html',
    'SE-0699--0600.html',
    'SE-0599--0500.html',
    'SE-0499--0400.html',
    'SE-0399--0300.html',
    'SE-0299--0200.html',
    'SE-0199--0100.html',
    'SE-0099-0000.html',
    'SE0001-0100.html',
    'SE0101-0200.html',
    'SE0201-0300.html',
    'SE0301-0400.html',
    'SE0401-0500.html',
    'SE0501-0600.html',
    'SE0601-0700.html',
    'SE0701-0800.html',
    'SE0801-0900.html',
    'SE0901-1000.html',
    'SE1001-1100.html',
    'SE1101-1200.html',
    'SE1201-1300.html',
    'SE1301-1400.html',
    'SE1401-1500.html',
    'SE1501-1600.html',
    'SE1601-1700.html',
    'SE1701-1800.html',
    'SE1801-1900.html',
    'SE1901-2000.html',
    'SE2001-2100.html',
    'SE2101-2200.html',
    'SE2201-2300.html',
    'SE2301-2400.html',
    'SE2401-2500.html',
    'SE2501-2600.html',
    'SE2601-2700.html',
    'SE2701-2800.html',
    'SE2801-2900.html',
    'SE2901-3000.html',
];

// JD at midnight of Jan 1, 1900 and Jan 1, 2101 (exclusive upper bound for 2100)
const JD_1900 = 2415020.5;
const JD_2101 = 2488434.5;

type EclipseData = {
    julianDay: number;
    eclCode: string;
};

/**
 * Parse Ecl date code (YYYYMMDD or -YYYYMMDD) into year/month/day.
 * NASA uses astronomical year numbering: 0 = 1 BCE, -1 = 2 BCE, etc.
 */
function parseEclCode(eclCode: string): {year: number; month: number; day: number} {
    if (eclCode.startsWith('-')) {
        return {
            year: parseInt(eclCode.substring(0, 5), 10),
            month: parseInt(eclCode.substring(5, 7), 10),
            day: parseInt(eclCode.substring(7, 9), 10),
        };
    }
    return {
        year: parseInt(eclCode.substring(0, 4), 10),
        month: parseInt(eclCode.substring(4, 6), 10),
        day: parseInt(eclCode.substring(6, 8), 10),
    };
}

/**
 * Convert a calendar date to Julian Day at 0h UT (midnight).
 * Uses the Julian calendar for dates before Oct 15, 1582 and Gregorian after.
 */
function dateToJulianDay(year: number, month: number, day: number): number {
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;

    const isGregorian = year > 1582 || (year === 1582 && month > 10) || (year === 1582 && month === 10 && day >= 15);

    let jdn: number;
    if (isGregorian) {
        jdn =
            day
            + Math.floor((153 * m + 2) / 5)
            + 365 * y
            + Math.floor(y / 4)
            - Math.floor(y / 100)
            + Math.floor(y / 400)
            - 32045;
    } else {
        jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
    }

    // Return JD at midnight (Julian Day starts at noon, so midnight = JDN - 0.5)
    return jdn - 0.5;
}

function parsePage(html: string): EclipseData[] {
    const eclipses: EclipseData[] = [];

    for (const line of html.split('\n')) {
        const eclMatch = line.match(/SEdata\.php\?Ecl=(-?\d+)/);
        if (!eclMatch) {
            continue;
        }
        const eclCode = eclMatch[1];
        const {year, month, day} = parseEclCode(eclCode);
        eclipses.push({julianDay: dateToJulianDay(year, month, day), eclCode});
    }

    return eclipses;
}

/**
 * Parse the Besselian elements table (4 rows × 6 columns) from plain text.
 * Returns a 4×6 array: rows[n] = [x_n, y_n, d_n, l1_n, l2_n, mu_n]
 *
 * Row n=3 is often truncated by a PHP error on the NASA page; x3/y3 are extracted
 * when present and d3..mu3 default to 0 (they are always 0 in this catalog).
 */
function parseCoeffTable(plain: string): number[][] | null {
    const rows: number[][] = new Array(4);

    // Match complete rows: n (0-3) followed by exactly 6 decimal numbers
    const fullRowPattern =
        /(?:^|\s)([0-3])\s+([-+]?\d+\.\d+)\s+([-+]?\d+\.\d+)\s+([-+]?\d+\.\d+)\s+([-+]?\d+\.\d+)\s+([-+]?\d+\.\d+)\s+([-+]?\d+\.\d+)/gm;
    let match = fullRowPattern.exec(plain);

    while (match !== null) {
        const n = parseInt(match[1], 10);
        if (!rows[n]) {
            rows[n] = [
                parseFloat(match[2]),
                parseFloat(match[3]),
                parseFloat(match[4]),
                parseFloat(match[5]),
                parseFloat(match[6]),
                parseFloat(match[7]),
            ];
        }
        match = fullRowPattern.exec(plain);
    }

    // Row n=3 is truncated by a PHP error – try to salvage x3 and y3
    if (!rows[3]) {
        const partialRow3Pattern = /(?:^|\s)3\s+([-+]?\d+\.\d+)\s+([-+]?\d+\.\d+)/m;
        const partial = plain.match(partialRow3Pattern);
        rows[3] = partial ? [parseFloat(partial[1]), parseFloat(partial[2]), 0, 0, 0, 0] : [0, 0, 0, 0, 0, 0];
    }

    return rows.filter(Boolean).length === 4 ? rows : null;
}

/**
 * Parse the raw 28-element Besselian array from a NASA eclipse detail page.
 * Layout: [t0Jde, t0Hours, tMin, tMax, deltaT, 0, x0..x3, y0..y3, d0..d2, mu0..mu2, l10..l12, l20..l22, tanF1, tanF2]
 */
function parseBesselianElementsFromHtml(html: string): number[] | null {
    const plain = html.replace(/<[^>]+>/g, ' ').replace(/&[a-zA-Z0-9#]+;/g, ' ');

    // Julian Date of greatest eclipse
    const jdMatch = plain.match(/JD\s*=\s*([\d.]+)/);
    if (!jdMatch) {
        return null;
    }
    const t0Jde = parseFloat(jdMatch[1]);

    // Polynomial reference time in hours TDT (appears as "t0 = X.XXX TDT")
    const t0Match = plain.match(/t\s*0\s*=\s*([\d.]+)\s*TDT/i);
    if (!t0Match) {
        return null;
    }
    const t0Hours = parseFloat(t0Match[1]);

    // Delta T in seconds (appears as "ΔT = X.X s" or "delta T = X.X s")
    const dtMatch = plain.match(/[Δδ ]\s*T\s*=\s*([-\d.]+)\s*s\b/i) || plain.match(/delta\s*T\s*=\s*([-\d.]+)\s*s\b/i);
    if (!dtMatch) {
        return null;
    }
    const deltaT = parseFloat(dtMatch[1]);

    // Besselian coefficient table: 4 rows × 6 columns [x, y, d, l1, l2, mu]
    const rows = parseCoeffTable(plain);
    if (!rows) {
        return null;
    }

    // tan f1 and tan f2 (penumbral/umbral cone angles)
    const tanF1Match = plain.match(/tan\s*f\s*1\s*=\s*([\d.]+)/i);
    const tanF2Match = plain.match(/tan\s*f\s*2\s*=\s*([\d.]+)/i);
    if (!tanF1Match || !tanF2Match) {
        return null;
    }
    const tanF1 = parseFloat(tanF1Match[1]);
    const tanF2 = parseFloat(tanF2Match[1]);

    // tMin / tMax: conservative ±4 h window around t₀; getCentralLine filters invalid points
    return [
        t0Jde, // [0]  t0Jde
        t0Hours, // [1]  t0Hours
        -4.0, // [2]  tMin (hours relative to polynomial reference)
        4.0, // [3]  tMax
        deltaT, // [4]  deltaT (seconds)
        0, // [5]  unused
        rows[0][0],
        rows[1][0],
        rows[2][0],
        rows[3][0], // [6-9]   x0..x3
        rows[0][1],
        rows[1][1],
        rows[2][1],
        rows[3][1], // [10-13] y0..y3
        rows[0][2],
        rows[1][2],
        rows[2][2], // [14-16] d0..d2
        rows[0][5],
        rows[1][5],
        rows[2][5], // [17-19] mu0..mu2
        rows[0][3],
        rows[1][3],
        rows[2][3], // [20-22] l1_0..l1_2
        rows[0][4],
        rows[1][4],
        rows[2][4], // [23-25] l2_0..l2_2
        tanF1, // [26] tan f1
        tanF2, // [27] tan f2
    ];
}

async function fetchPage(url: string, retries = 3): Promise<string> {
    let lastError: unknown;
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const res = await fetch(url);
            if (!res.ok) {
                lastError = new Error(`HTTP ${res.status}`);
            } else {
                return await res.text();
            }
        } catch (err) {
            lastError = err;
        }
        if (attempt < retries - 1) {
            await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        }
    }
    throw lastError;
}

async function fetchBatch(pages: string[]): Promise<EclipseData[]> {
    const results = await Promise.all(
        pages.map(async (page) => {
            const url = BASE_URL + page;
            process.stdout.write(`  Fetching ${page}... `);
            const html = await fetchPage(url);
            const eclipses = parsePage(html);
            process.stdout.write(`${eclipses.length} eclipses\n`);
            return eclipses;
        }),
    );
    return results.flat();
}

async function fetchAllBesselian(
    eclipses: EclipseData[],
    concurrency: number,
): Promise<Array<{jd: number; raw: number[]}>> {
    const entries: Array<{jd: number; raw: number[]}> = [];
    let nextIndex = 0;
    let completed = 0;

    async function worker() {
        while (true) {
            const i = nextIndex++;
            if (i >= eclipses.length) {
                return;
            }
            const eclipse = eclipses[i];
            try {
                const html = await fetchPage(DETAIL_URL + eclipse.eclCode);
                const raw = parseBesselianElementsFromHtml(html);
                if (!raw) {
                    process.stderr.write(`  Warning: could not parse Besselian elements for Ecl=${eclipse.eclCode}\n`);
                } else {
                    entries.push({jd: eclipse.julianDay, raw});
                }
            } catch (err) {
                process.stderr.write(`  Warning: failed to fetch Ecl=${eclipse.eclCode}: ${err}\n`);
            }
            completed++;
            process.stdout.write(`  ${completed} / ${eclipses.length}\r`);
        }
    }

    await Promise.all(Array.from({length: concurrency}, worker));
    return entries;
}

// ── Binary catalogue encoding ─────────────────────────────────────────────────
// Each entry is packed into 63 bytes (see catalogueDecoder.ts for full layout).
// Fields with narrow physical ranges are quantized to uint16/int16 to halve
// their storage cost; fields covering wide or unbounded ranges stay as float32.
// mu2 is always 0 across the entire NASA catalogue and is omitted entirely.

const X1_OFF = 0.43,
    X1_SC = 65535 / 0.16; // x1  ∈ [0.43, 0.59]
const MU1_OFF = 14.99,
    MU1_SC = 65535 / 0.017; // mu1 ∈ [14.99, 15.006]
const L10_OFF = 0.528,
    L10_SC = 65535 / 0.049; // l10 ∈ [0.528, 0.577]
const TF1_OFF = 0.00455,
    TF1_SC = 65535 / 0.00025; // tanF1
const TF2_OFF = 0.00452,
    TF2_SC = 65535 / 0.00025; // tanF2

const X2_SC = 32767 / 1.0e-4;
const X3_SC = 32767 / 1.1e-5;
const Y1_SC = 32767 / 0.3;
const Y2_SC = 32767 / 3.0e-4;
const Y3_SC = 32767 / 5.5e-6;
const D1_SC = 32767 / 0.017;
const D2_SC = 32767 / 7.5e-6;
const L11_SC = 32767 / 1.5e-4;
const L12_SC = 32767 / 1.4e-5;
const L20_SC = 32767 / 0.031;
const L21_SC = 32767 / 1.5e-4;
const L22_SC = 32767 / 1.4e-5;

function encodeU16(val: number, off: number, sc: number, field: string): number {
    const e = Math.round((val - off) * sc);
    if (e < 0 || e > 65535) {
        throw new Error(`uint16 overflow in ${field}: value=${val} → encoded=${e}`);
    }
    return e;
}

function encodeI16(val: number, sc: number, field: string): number {
    const e = Math.round(val * sc);
    if (e < -32768 || e > 32767) {
        throw new Error(`int16 overflow in ${field}: value=${val} → encoded=${e}`);
    }
    return e;
}

const ENTRY_BYTES = 63;

function encodeEntry(jd: number, raw: number[]): Buffer {
    const keyInt = Math.round(jd - 0.5);
    const t0Offset = raw[0] - jd;
    const buf = Buffer.allocUnsafe(ENTRY_BYTES);
    let o = 0;

    buf.writeUInt32LE(keyInt, o);
    o += 4;
    buf.writeFloatLE(t0Offset, o);
    o += 4;
    buf.writeUInt8(raw[1], o);
    o += 1;
    buf.writeFloatLE(raw[4], o);
    o += 4;
    buf.writeFloatLE(raw[6], o);
    o += 4; // x0
    buf.writeUInt16LE(encodeU16(raw[7], X1_OFF, X1_SC, 'x1'), o);
    o += 2;
    buf.writeInt16LE(encodeI16(raw[8], X2_SC, 'x2'), o);
    o += 2;
    buf.writeInt16LE(encodeI16(raw[9], X3_SC, 'x3'), o);
    o += 2;
    buf.writeFloatLE(raw[10], o);
    o += 4; // y0
    buf.writeInt16LE(encodeI16(raw[11], Y1_SC, 'y1'), o);
    o += 2;
    buf.writeInt16LE(encodeI16(raw[12], Y2_SC, 'y2'), o);
    o += 2;
    buf.writeInt16LE(encodeI16(raw[13], Y3_SC, 'y3'), o);
    o += 2;
    buf.writeFloatLE(raw[14], o);
    o += 4; // d0
    buf.writeInt16LE(encodeI16(raw[15], D1_SC, 'd1'), o);
    o += 2;
    buf.writeInt16LE(encodeI16(raw[16], D2_SC, 'd2'), o);
    o += 2;
    buf.writeFloatLE(raw[17], o);
    o += 4; // mu0
    buf.writeUInt16LE(encodeU16(raw[18], MU1_OFF, MU1_SC, 'mu1'), o);
    o += 2;
    // raw[19] = mu2, always 0, omitted
    buf.writeUInt16LE(encodeU16(raw[20], L10_OFF, L10_SC, 'l10'), o);
    o += 2;
    buf.writeInt16LE(encodeI16(raw[21], L11_SC, 'l11'), o);
    o += 2;
    buf.writeInt16LE(encodeI16(raw[22], L12_SC, 'l12'), o);
    o += 2;
    buf.writeInt16LE(encodeI16(raw[23], L20_SC, 'l20'), o);
    o += 2;
    buf.writeInt16LE(encodeI16(raw[24], L21_SC, 'l21'), o);
    o += 2;
    buf.writeInt16LE(encodeI16(raw[25], L22_SC, 'l22'), o);
    o += 2;
    buf.writeUInt16LE(encodeU16(raw[26], TF1_OFF, TF1_SC, 'tanF1'), o);
    o += 2;
    buf.writeUInt16LE(encodeU16(raw[27], TF2_OFF, TF2_SC, 'tanF2'), o);
    o += 2;

    return buf;
}

function generateCatalogueFile(entries: Array<{jd: number; raw: number[]}>, exportName: string): string {
    const chunks = entries.map(({jd, raw}) => encodeEntry(jd, raw));
    const encoded = Buffer.concat(chunks).toString('base64');
    return [
        `import {decodeCatalogue} from '../utils/catalogueDecoder';`,
        ``,
        `const ENCODED_DATA =`,
        `    '${encoded}';`,
        ``,
        `export const ${exportName} = decodeCatalogue(ENCODED_DATA);`,
        ``,
    ].join('\n');
}

async function main() {
    console.log('Fetching solar eclipse catalog from NASA...\n');

    const allEclipses: EclipseData[] = [];
    const BATCH_SIZE = 5;

    for (let i = 0; i < CENTURY_PAGES.length; i += BATCH_SIZE) {
        const batch = CENTURY_PAGES.slice(i, i + BATCH_SIZE);
        console.log(`Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(CENTURY_PAGES.length / BATCH_SIZE)}:`);
        const eclipses = await fetchBatch(batch);
        allEclipses.push(...eclipses);

        if (i + BATCH_SIZE < CENTURY_PAGES.length) {
            await new Promise((r) => setTimeout(r, 1000));
        }
    }

    // Fetch Besselian elements for each eclipse from its NASA detail page
    console.log('\nFetching Besselian elements from NASA detail pages...');
    const allEntries = await fetchAllBesselian(allEclipses, 10);
    console.log(`\nFetched Besselian elements for ${allEntries.length} eclipses.`);

    allEntries.sort((a, b) => a.jd - b.jd);

    const resourcesDir = path.join(__dirname, '../resources');

    const catalogueEntries = allEntries.filter((e) => e.jd >= JD_1900 && e.jd < JD_2101);
    fs.writeFileSync(
        path.join(resourcesDir, 'catalogue.ts'),
        generateCatalogueFile(catalogueEntries, 'BESSELIAN_ELEMENTS_CATALOGUE'),
    );
    console.log(`Generated catalogue.ts with ${catalogueEntries.length} entries (1900–2100)`);

    fs.writeFileSync(
        path.join(resourcesDir, 'catalogueFull.ts'),
        generateCatalogueFile(allEntries, 'BESSELIAN_ELEMENTS_CATALOGUE_FULL'),
    );
    console.log(`Generated catalogueFull.ts with ${allEntries.length} entries (full range)`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
