export type Catalogue = Record<number, Array<number>>;

export interface BesselianElements {
    t0Jde: number;
    t0Hours: number;
    deltaT: number;
    penumbralMagnitude: number;
    umbralMagnitude: number;
    eclipseType: number;
    apparentSiderealTime: number;
    moonParallax: number;
    moonSemidiameter: number;
    p1: number;
    u1: number;
    u2: number;
    greatest: number;
    u3: number;
    u4: number;
    p4: number;
    ra: Array<number>;
    dec: Array<number>;
}
