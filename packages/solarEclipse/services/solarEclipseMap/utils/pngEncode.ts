import {deflateRawSync, constants as zlibConstants} from 'node:zlib';

// Hand-rolled PNG writer: the canvas's RGBA bytes are stored losslessly (Sub filter,
// zlib), so the decoded image is pixel-identical to the canvas — only the compressed byte
// stream differs from skia's encoder. Rows are split into strips that can be filtered and
// deflated independently (on the worker pool): every strip but the last ends its raw
// deflate stream with a sync flush, which closes all blocks on a byte boundary without the
// final-block flag, so the strip streams simply concatenate into one valid zlib stream, pigz
// style. The zlib checksum is an adler32 combined across the strips.

// Speed over ratio: the map compresses within ~10% of skia's default either way.
const PNG_DEFLATE_LEVEL = 3;

const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    CRC_TABLE[n] = c >>> 0;
}

function crc32(...buffers: Array<Uint8Array>): number {
    let c = 0xffffffff;
    for (const buffer of buffers) {
        for (let i = 0; i < buffer.length; i++) {
            c = CRC_TABLE[(c ^ buffer[i]) & 0xff] ^ (c >>> 8);
        }
    }

    return (c ^ 0xffffffff) >>> 0;
}

const ADLER_MOD = 65521;

function adler32(buffer: Uint8Array): number {
    let a = 1;
    let b = 0;
    let i = 0;
    while (i < buffer.length) {
        // Largest run of byte additions that cannot overflow 32 bits before the modulo.
        const end = Math.min(i + 5552, buffer.length);
        for (; i < end; i++) {
            a += buffer[i];
            b += a;
        }
        a %= ADLER_MOD;
        b %= ADLER_MOD;
    }

    return ((b << 16) | a) >>> 0;
}

// adler32 of a concatenation, from the parts' checksums (zlib's adler32_combine).
export function adler32Combine(adler1: number, adler2: number, length2: number): number {
    const rem = length2 % ADLER_MOD;
    const a1 = adler1 & 0xffff;
    const b1 = (adler1 >>> 16) & 0xffff;
    const a2 = adler2 & 0xffff;
    const b2 = (adler2 >>> 16) & 0xffff;
    let a = (a1 + a2 - 1) % ADLER_MOD;
    let b = (b1 + b2 + rem * a1 - rem) % ADLER_MOD;
    if (a < 0) {
        a += ADLER_MOD;
    }
    if (b < 0) {
        b += ADLER_MOD;
    }

    return ((b << 16) | a) >>> 0;
}

export interface PngStrip {
    deflated: Uint8Array;
    adler: number;
    filteredLength: number;
}

// Filter (PNG Sub) and deflate rows [yStart, yEnd) as one independent strip.
export function deflatePngStrip(
    rgba: Uint8Array | Uint8ClampedArray,
    width: number,
    yStart: number,
    yEnd: number,
    isLast: boolean,
): PngStrip {
    const stride = width * 4;
    const filtered = Buffer.allocUnsafe((yEnd - yStart) * (stride + 1));
    let o = 0;
    for (let y = yStart; y < yEnd; y++) {
        filtered[o++] = 1; // Sub filter
        const row = y * stride;
        filtered[o++] = rgba[row];
        filtered[o++] = rgba[row + 1];
        filtered[o++] = rgba[row + 2];
        filtered[o++] = rgba[row + 3];
        for (let x = 4; x < stride; x++) {
            filtered[o++] = rgba[row + x] - rgba[row + x - 4];
        }
    }
    const deflated = deflateRawSync(filtered, {
        level: PNG_DEFLATE_LEVEL,
        finishFlush: isLast ? zlibConstants.Z_FINISH : zlibConstants.Z_SYNC_FLUSH,
    });

    return {deflated, adler: adler32(filtered), filteredLength: filtered.length};
}

function pngChunk(type: string, data: Uint8Array): Buffer {
    const head = Buffer.allocUnsafe(8);
    head.writeUInt32BE(data.length, 0);
    head.write(type, 4, 'latin1');
    const crc = Buffer.allocUnsafe(4);
    crc.writeUInt32BE(crc32(head.subarray(4), data), 0);

    return Buffer.concat([head, data, crc]);
}

// Assemble the strips (in row order) into the finished PNG file.
export function assemblePng(width: number, height: number, strips: Array<PngStrip>): Buffer {
    let adler = 1;
    for (const strip of strips) {
        adler = adler32Combine(adler, strip.adler, strip.filteredLength);
    }

    const ihdr = Buffer.allocUnsafe(13);
    ihdr.writeUInt32BE(width, 0);
    ihdr.writeUInt32BE(height, 4);
    ihdr[8] = 8; // bit depth
    ihdr[9] = 6; // colour type: RGBA
    ihdr[10] = 0; // compression
    ihdr[11] = 0; // filter method
    ihdr[12] = 0; // no interlace
    const adlerBuffer = Buffer.allocUnsafe(4);
    adlerBuffer.writeUInt32BE(adler >>> 0, 0);
    const idat = Buffer.concat([Buffer.from([0x78, 0x9c]), ...strips.map((s) => s.deflated), adlerBuffer]);

    return Buffer.concat([
        Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
        pngChunk('IHDR', ihdr),
        pngChunk('IDAT', idat),
        pngChunk('IEND', Buffer.alloc(0)),
    ]);
}
