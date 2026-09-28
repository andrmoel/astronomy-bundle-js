import type {RectangularCoordinates} from '@app/types/CoordinateTypes';

export type Sgp4State = {
    position: RectangularCoordinates;
    velocity: RectangularCoordinates;
};

export type Sgp4Record = {
    bstar: number;
    ecco: number;
    argpo: number;
    inclo: number;
    mo: number;
    no: number;
    nodeo: number;
    isimp: boolean;
    aycof: number;
    con41: number;
    cc1: number;
    cc4: number;
    cc5: number;
    d2: number;
    d3: number;
    d4: number;
    delmo: number;
    eta: number;
    argpdot: number;
    omgcof: number;
    sinmao: number;
    t2cof: number;
    t3cof: number;
    t4cof: number;
    t5cof: number;
    x1mth2: number;
    x7thm1: number;
    mdot: number;
    nodedot: number;
    xlcof: number;
    xmcof: number;
    nodecf: number;
    gsto: number;
    deepSpace: DeepSpaceRecord | null;
};

export type DeepSpaceRecord = {
    periodics: DeepSpacePeriodics;
    secular: DeepSpaceSecular;
};

export type DeepSpacePeriodics = {
    e3: number;
    ee2: number;
    se2: number;
    se3: number;
    sgh2: number;
    sgh3: number;
    sgh4: number;
    sh2: number;
    sh3: number;
    si2: number;
    si3: number;
    sl2: number;
    sl3: number;
    sl4: number;
    xgh2: number;
    xgh3: number;
    xgh4: number;
    xh2: number;
    xh3: number;
    xi2: number;
    xi3: number;
    xl2: number;
    xl3: number;
    xl4: number;
    zmol: number;
    zmos: number;
};

export type DeepSpaceSecular = {
    irez: 0 | 1 | 2;
    dedt: number;
    didt: number;
    dmdt: number;
    domdt: number;
    dnodt: number;
    d2201: number;
    d2211: number;
    d3210: number;
    d3222: number;
    d4410: number;
    d4422: number;
    d5220: number;
    d5232: number;
    d5421: number;
    d5433: number;
    del1: number;
    del2: number;
    del3: number;
    xfact: number;
    xlamo: number;
};

export type DeepSpaceCommon = {
    sinim: number;
    cosim: number;
    emsq: number;
    s1: number;
    s2: number;
    s3: number;
    s4: number;
    s5: number;
    ss1: number;
    ss2: number;
    ss3: number;
    ss4: number;
    ss5: number;
    sz1: number;
    sz3: number;
    sz11: number;
    sz13: number;
    sz21: number;
    sz23: number;
    sz31: number;
    sz33: number;
    z1: number;
    z3: number;
    z11: number;
    z13: number;
    z21: number;
    z23: number;
    z31: number;
    z33: number;
    periodics: DeepSpacePeriodics;
};

export type MeanElements = {
    em: number;
    inclm: number;
    argpm: number;
    nodem: number;
    mm: number;
    nm: number;
};

export type SecularElements = MeanElements & {
    am: number;
};

export type PeriodicElements = {
    ep: number;
    inclp: number;
    nodep: number;
    argpp: number;
    mp: number;
};

export type LuniSolarOrbit = {
    ep: number;
    np: number;
    sinim: number;
    cosim: number;
    sinomm: number;
    cosomm: number;
    emsq: number;
    betasq: number;
    rtemsq: number;
};

export type LuniSolarTerms = {
    z1: number;
    z2: number;
    z3: number;
    z11: number;
    z12: number;
    z13: number;
    z21: number;
    z22: number;
    z23: number;
    z31: number;
    z32: number;
    z33: number;
    s1: number;
    s2: number;
    s3: number;
    s4: number;
    s5: number;
    s6: number;
    s7: number;
};

export type ResonanceRates = {
    xndt: number;
    xldot: number;
    xnddt: number;
};

export type ResonanceIntegration = ResonanceRates & {
    xni: number;
    xli: number;
    ft: number;
};

export type PeriodicCoefficients = {
    e2: number;
    e3: number;
    i2: number;
    i3: number;
    l2: number;
    l3: number;
    l4: number;
    gh2: number;
    gh3: number;
    gh4: number;
    h2: number;
    h3: number;
};

export type PeriodicTerms = {
    e: number;
    i: number;
    l: number;
    gh: number;
    h: number;
};
