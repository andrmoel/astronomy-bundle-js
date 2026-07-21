/**
 * Scrapes the Besselian elements of the Javascript Lunar Eclipse Explorer (JLEX)
 * by Fred Espenak and Jean Meeus and generates:
 *   - packages/lunarEclipse/resources/catalogue.ts      (Besselian elements, 1900–2100)
 *   - packages/lunarEclipse/resources/catalogueFull.ts  (Besselian elements, full range)
 *
 * Source: https://eclipse.gsfc.nasa.gov/JLEX/ (one JavaScript data file per century)
 *
 * Run with:  npx ts-node ./packages/lunarEclipse/bin/generateLunarEclipseCatalogue.ts
 */
import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = 'https://eclipse.gsfc.nasa.gov/JLEX/';

// Each JLEX data file holds the Besselian elements of one century.
const PERIODS = buildPeriods();

// Values per eclipse in a JLEX element array.
const BLOCK_SIZE = 22;

// JD at midnight of Jan 1, 1900 and Jan 1, 2101 (exclusive upper bound for 2100)
const JD_1900 = 2415020.5;
const JD_2101 = 2488434.5;

async function main() {
    console.log('Fetching lunar eclipse Besselian elements from JLEX...\n');

    const blocks: number[][] = [];
    const BATCH_SIZE = 5;

    for (let i = 0; i < PERIODS.length; i += BATCH_SIZE) {
        const batch = PERIODS.slice(i, i + BATCH_SIZE);
        console.log(`Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(PERIODS.length / BATCH_SIZE)}:`);
        blocks.push(...(await fetchBatch(batch)));

        if (i + BATCH_SIZE < PERIODS.length) {
            await new Promise((r) => setTimeout(r, 1000));
        }
    }

    const entries = dedupeByDate(blocks);
    entries.sort((a, b) => a[0] - b[0]);
    console.log(`\nParsed Besselian elements for ${entries.length} lunar eclipses.`);

    const resourcesDir = path.join(__dirname, '../resources');
    fs.mkdirSync(resourcesDir, {recursive: true});

    const catalogueEntries = entries.filter((e) => e[0] >= JD_1900 && e[0] < JD_2101);
    fs.writeFileSync(
        path.join(resourcesDir, 'catalogue.ts'),
        generateCatalogueFile(catalogueEntries, 'BESSELIAN_ELEMENTS_CATALOGUE'),
    );
    console.log(`Generated catalogue.ts with ${catalogueEntries.length} entries (1900–2100)`);

    fs.writeFileSync(
        path.join(resourcesDir, 'catalogueFull.ts'),
        generateCatalogueFile(entries, 'BESSELIAN_ELEMENTS_CATALOGUE_FULL'),
    );
    console.log(`Generated catalogueFull.ts with ${entries.length} entries (full range)`);
}

function buildPeriods(): string[] {
    const periods: string[] = [];
    for (let year = 1999; year >= 99; year -= 100) {
        periods.push(`LEm${String(year).padStart(4, '0')}`);
    }
    for (let year = 1; year <= 2901; year += 100) {
        periods.push(`LE${String(year).padStart(4, '0')}`);
    }
    return periods;
}

async function fetchBatch(periods: string[]): Promise<number[][]> {
    const results = await Promise.all(
        periods.map(async (period) => {
            process.stdout.write(`  Fetching ${period}... `);
            const js = await fetchPage(BASE_URL + period + '.js');
            const blocks = parseElements(js);
            process.stdout.write(`${blocks.length} eclipses\n`);
            return blocks;
        }),
    );
    return results.flat();
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

/**
 * Parse the flat JLEX element array from a data file into one array of 22 values
 * per eclipse: [t0Jde, t0Hours, deltaT, penMag, umbMag, type, siderealTime,
 * parallax, semidiameter, p1, u1, u2, greatest, u3, u4, p4, ra0..ra2, dec0..dec2].
 */
function parseElements(js: string): number[][] {
    const start = js.indexOf('new Array(');
    if (start < 0) {
        return [];
    }

    let body = js.slice(start + 'new Array('.length);
    body = body.slice(0, body.lastIndexOf('))'));
    body = body.replace(/\/\/[^\n]*/g, '');
    body = body.replace(/"[^"]*to[^"]*"/, ''); // drop the "YYYY to YYYY" header

    const numbers = (body.match(/[-+]?\d+\.\d+(?:[eE][-+]?\d+)?|[-+]?\d+(?:[eE][-+]?\d+)?/g) ?? []).map(Number);
    if (numbers.length % BLOCK_SIZE !== 0) {
        throw new Error(`Unexpected element count ${numbers.length}, not a multiple of ${BLOCK_SIZE}`);
    }

    const blocks: number[][] = [];
    for (let i = 0; i < numbers.length; i += BLOCK_SIZE) {
        blocks.push(numbers.slice(i, i + BLOCK_SIZE));
    }
    return blocks;
}

function dedupeByDate(blocks: number[][]): number[][] {
    const byKey = new Map<number, number[]>();
    for (const block of blocks) {
        byKey.set(midnightJd(block[0]), block);
    }
    return [...byKey.values()];
}

function midnightJd(t0Jde: number): number {
    return Math.floor(t0Jde - 0.5) + 0.5;
}

function generateCatalogueFile(entries: number[][], exportName: string): string {
    const chunks = entries.map(encodeEntry);
    const encoded = Buffer.concat(chunks).toString('base64');
    return [
        `import {decodeCatalogue} from '../utils/catalogue';`,
        ``,
        `const ENCODED_DATA =`,
        `    '${encoded}';`,
        ``,
        `export const ${exportName} = decodeCatalogue(ENCODED_DATA);`,
        ``,
    ].join('\n');
}

// ── Binary catalogue encoding ─────────────────────────────────────────────────
// Each entry is packed into 68 bytes (see utils/catalogue.ts for the full layout).
// Narrow-range fields are quantized to uint16/int16; wide-range coefficients stay
// as float32.

const PARALLAX_OFF = 0.8,
    PARALLAX_SC = 65535 / 0.3; // moonParallax  ∈ [0.8, 1.1] deg
const SD_OFF = 0.2,
    SD_SC = 65535 / 0.15; // moonSemidiameter ∈ [0.2, 0.35] deg
const CONTACT_SC = 32767 / 8; // contact times ∈ [-8, 8] hours from t0

const ENTRY_BYTES = 64;

function encodeEntry(block: number[]): Buffer {
    const t0Jde = block[0];
    const midnight = midnightJd(t0Jde);

    const buf = Buffer.allocUnsafe(ENTRY_BYTES);
    buf.writeUInt32LE(midnight - 0.5, 0);
    buf.writeFloatLE(t0Jde - midnight, 4);
    buf.writeUInt8(encodeHour(block[1]), 8);
    buf.writeUInt8(block[5], 9); // eclipseType
    buf.writeFloatLE(block[3], 10); // penumbralMagnitude
    buf.writeFloatLE(block[4], 14); // umbralMagnitude
    buf.writeFloatLE(block[6], 18); // apparentSiderealTime
    buf.writeUInt16LE(encodeU16(block[7], PARALLAX_OFF, PARALLAX_SC, 'moonParallax'), 22);
    buf.writeUInt16LE(encodeU16(block[8], SD_OFF, SD_SC, 'moonSemidiameter'), 24);
    buf.writeInt16LE(encodeI16(block[9], CONTACT_SC, 'p1'), 26);
    buf.writeInt16LE(encodeI16(block[10], CONTACT_SC, 'u1'), 28);
    buf.writeInt16LE(encodeI16(block[11], CONTACT_SC, 'u2'), 30);
    buf.writeInt16LE(encodeI16(block[12], CONTACT_SC, 'greatest'), 32);
    buf.writeInt16LE(encodeI16(block[13], CONTACT_SC, 'u3'), 34);
    buf.writeInt16LE(encodeI16(block[14], CONTACT_SC, 'u4'), 36);
    buf.writeInt16LE(encodeI16(block[15], CONTACT_SC, 'p4'), 38);
    buf.writeFloatLE(block[16], 40); // ra0
    buf.writeFloatLE(block[17], 44); // ra1
    buf.writeFloatLE(block[18], 48); // ra2
    buf.writeFloatLE(block[19], 52); // dec0
    buf.writeFloatLE(block[20], 56); // dec1
    buf.writeFloatLE(block[21], 60); // dec2

    return buf;
}

function encodeHour(val: number): number {
    const h = Math.round(val);
    if (h !== val || h < 0 || h > 23) {
        throw new Error(`t0Hours out of range: ${val}`);
    }
    return h;
}

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

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
