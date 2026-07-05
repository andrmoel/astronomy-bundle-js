import type {LdemGeometry} from '../types/LdemTypes';

export function parseLdemLabel(label: string): LdemGeometry {
    const sampleBits = numberField(label, 'SAMPLE_BITS');
    const sampleType = textField(label, 'SAMPLE_TYPE');
    if (sampleBits !== 16 || !/LSB/.test(sampleType)) {
        throw new Error(`LDEM label: expected 16-bit LSB samples, got ${sampleBits}-bit ${sampleType}`);
    }

    const mapResolution = numberField(label, 'MAP_RESOLUTION');
    const degPerPixel = 1 / mapResolution;

    // In the PDS simple-cylindrical projection the projection offsets give the pixel of the map centre,
    // so row/col 0 sit CENTER +/- offset * degPerPixel away from it.
    const latFirst = numberField(label, 'CENTER_LATITUDE') + numberField(label, 'LINE_PROJECTION_OFFSET') * degPerPixel;
    const lonFirst =
        numberField(label, 'CENTER_LONGITUDE') - numberField(label, 'SAMPLE_PROJECTION_OFFSET') * degPerPixel;

    return {
        rows: numberField(label, 'LINES'),
        cols: numberField(label, 'LINE_SAMPLES'),
        degPerPixel,
        latFirst,
        lonFirst,
        scalingFactorM: numberField(label, 'SCALING_FACTOR'),
        referenceRadiusM: numberField(label, 'OFFSET'),
    };
}

function numberField(label: string, key: string): number {
    const raw = field(label, key);
    const value = Number.parseFloat(raw);
    if (Number.isNaN(value)) {
        throw new Error(`LDEM label: ${key} is not a number (${raw})`);
    }

    return value;
}

function textField(label: string, key: string): string {
    return field(label, key).replace(/^"|"$/g, '');
}

function field(label: string, key: string): string {
    const match = label.match(new RegExp(`^\\s*${key}\\s*=\\s*(\\S+)`, 'm'));
    if (!match) {
        throw new Error(`LDEM label: missing ${key}`);
    }

    return match[1];
}
