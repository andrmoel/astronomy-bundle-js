import {pad, round} from './math';

export type AnglePrefixes = {
    positivePrefix: string;
    negativePrefix: string;
};

export function deg2rad(degrees: number): number {
    return degrees * (Math.PI / 180);
}

export function rad2deg(radians: number): number {
    return radians * (180 / Math.PI);
}

/**
 * @deprecated use decimal2degreeMinutesSeconds instead
 * @param deg
 * @param short
 */
export function deg2angle(deg: number, short = false): string {
    return decimal2degreeMinutesSeconds(deg, short);
}

export function decimal2degreeMinutes(
    decimal: number,
    short = false,
    prefixes?: AnglePrefixes,
): string {
    const sign = getSignPrefix(decimal, prefixes);

    decimal = Math.abs(decimal);

    const degPart = Math.floor(decimal);
    const min = round((decimal - degPart) * 60, 5);

    const degString = degPart + '° ';
    const minString = pad(min, 2) + '\'';

    if (short && degPart === 0.0) {
        return sign + minString;
    }

    return sign + degString + minString;
}

export function decimal2degreeMinutesSeconds(
    decimal: number,
    short = false,
    prefixes?: AnglePrefixes,
): string {
    const sign = getSignPrefix(decimal, prefixes);

    decimal = Math.abs(decimal);

    const degPart = Math.floor(decimal);
    const min = Math.floor((decimal - degPart) * 60);
    const sec = round((decimal - degPart - min / 60) * 3600, 3);
    const secParts = sec.toString().split('.');

    const degString = degPart + '° ';
    const minString = pad(min, 2) + '\' ';
    const secString = (secParts.length === 1 ? pad(sec, 2) : pad(secParts[0], 2) + '.' + secParts[1]) + '"';

    if (short && degPart === 0.0 && min === 0.0) {
        return sign + secString;
    }

    if (short && degPart === 0.0) {
        return sign + minString + secString;
    }

    return sign + degString + minString + secString;
}

export function angle2deg(angle: string): number {
    const matches = angle.match(/(-?)([0-9]+)°.*?([0-9]+)'.*?([0-9.]+)"/);

    if (!matches) {
        throw new Error('false angle format');
    }

    const sign = matches[1].trim() === '-' ? -1 : 1;
    const deg = parseInt(matches[2]);
    const min = parseInt(matches[3]);
    const sec = parseFloat(matches[4]);

    return sign * (deg + min / 60 + sec / 3600);
}

export function deg2time(angle: number): string {
    const sign = angle < 0 ? '-' : '';
    const time = Math.abs(angle / 15);

    const hour = Math.floor(time);
    const min = Math.floor((time - hour) * 60);
    const sec = round((time - hour - min / 60) * 3600, 3);
    const secParts = sec.toString().split('.');

    const hourString = sign + hour;
    const minString = pad(min, 2);
    const secString = secParts.length === 1 ? pad(sec, 2) : pad(secParts[0], 2) + '.' + secParts[1];

    return `${hourString}h ${minString}m ${secString}s`;
}

export function time2deg(timeAngle: string): number {
    const matches = timeAngle.match(/(-?)([0-9]+)h.*?([0-9]+)m.*?([0-9.]+)s/);

    if (!matches) {
        throw new Error('false time angle format');
    }

    const sign = matches[1].trim() === '-' ? -1 : 1;
    const deg = parseInt(matches[2]);
    const min = parseInt(matches[3]);
    const sec = parseFloat(matches[4]);

    const angleDeg = sign * (deg + min / 60 + sec / 3600);

    return angleDeg * 15;
}

export function normalizeAngle(degrees: number, baseAngle = 360.0): number {
    let angle = degrees % baseAngle;

    if (angle < 0) {
        angle = angle + baseAngle;
    }

    return angle;
}

export function sec2deg(seconds: number): number {
    return seconds / 3600;
}

function getSignPrefix(decimal: number, prefixes?: AnglePrefixes): string {
    if (prefixes) {
        return decimal < 0 ? prefixes.negativePrefix : prefixes.positivePrefix;
    }

    return decimal < 0 ? '-' : '';
}
