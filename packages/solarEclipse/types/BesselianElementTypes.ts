export type Catalogue = Record<number, Array<number>>;

export interface BesselianElements {
    t0Jde: number;
    t0Hours: number;
    tMin: number;
    tMax: number;
    deltaT: number;
    x: Array<number>;
    y: Array<number>;
    d: Array<number>;
    mu: Array<number>;
    l1: Array<number>;
    l2: Array<number>;
    tanF1: number;
    tanF2: number;
}

export interface BesselianElementsAtTime {
    x: number;
    y: number;
    d: number;
    mu: number;
    l1: number;
    l2: number;
    sinD: number;
    cosD: number;
}
