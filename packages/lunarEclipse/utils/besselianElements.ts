import type {BesselianElements} from '../types/BesselianElementTypes';

export function parseBesselianElements(raw: Array<number>): BesselianElements {
    if (raw.length !== 22) {
        throw new Error(`Expected 22 Besselian element values, got ${raw.length}`);
    }

    return {
        t0Jde: raw[0],
        t0Hours: raw[1],
        deltaT: raw[2],
        penumbralMagnitude: raw[3],
        umbralMagnitude: raw[4],
        eclipseType: raw[5],
        apparentSiderealTime: raw[6],
        moonParallax: raw[7],
        moonSemidiameter: raw[8],
        p1: raw[9],
        u1: raw[10],
        u2: raw[11],
        greatest: raw[12],
        u3: raw[13],
        u4: raw[14],
        p4: raw[15],
        ra: [raw[16], raw[17], raw[18]],
        dec: [raw[19], raw[20], raw[21]],
    };
}
