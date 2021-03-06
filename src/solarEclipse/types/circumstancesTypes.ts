export type TimeDependentCircumstances = {
    x: number,
    dX: number,
    y: number,
    dY: number,
    d: number,
    dD: number,
    mu: number,
    dMu: number,
    l1: number,
    dL1: number,
    l2: number,
    dL2: number,
};

export type TimeLocalDependentCircumstances = {
    tMax: number,
    t0: number,
    dT: number,

    t: number,
    u: number,
    v: number,
    a: number,
    b: number,
    n2: number,
};
