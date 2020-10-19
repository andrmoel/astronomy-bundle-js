import {round} from './math';

export function deg2rad(degrees: number): number {
    return degrees * (Math.PI / 180);
}

export function rad2deg(radians: number): number {
    return radians * (180 / Math.PI);
}

export function deg2angle(deg: number): string {
    const sign = deg < 0 ? '-' : '';
    deg = Math.abs(deg);

    const degPart = Math.floor(deg);
    const minPart = Math.floor((deg - degPart) * 60);
    const secPart = round((deg - degPart - minPart / 60) * 3600, 3);

    return sign + degPart + '°' + minPart + '\'' + secPart + '"';
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

    return sign + hour + 'h' + min + 'm' + sec + 's';
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
