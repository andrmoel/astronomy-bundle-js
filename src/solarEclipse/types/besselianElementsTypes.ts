export type BesselianElements = {
    tMax: number,
    t0: number,

    dT: number,

    x: Array<number>,
    y: Array<number>,
    d: Array<number>,
    l1: Array<number>,
    l2: Array<number>,
    mu: Array<number>,

    tanF1: number,
    tanF2: number,

    latGreatestEclipse: number,
    lonGreatestEclipse: number,
};

export type BesselianElementsArray = [
    number,
    number,
    number,
    Array<number>,
    Array<number>,
    Array<number>,
    Array<number>,
    Array<number>,
    Array<number>,
    number,
    number,
    number,
    number,
];
