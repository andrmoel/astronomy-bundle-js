import {RPTIM, TWO_PI, WGS72_XKE, X2O3, ZEL, ZES, ZNL, ZNS} from '../constants/sgp4';
import type {
    DeepSpaceCommon,
    DeepSpacePeriodics,
    DeepSpaceSecular,
    LuniSolarOrbit,
    LuniSolarTerms,
    MeanElements,
    PeriodicCoefficients,
    PeriodicElements,
    PeriodicTerms,
    ResonanceIntegration,
    ResonanceRates,
    Sgp4Record,
} from '../types/Sgp4Types';

const STEP = 720.0;
const STEP2 = 259200.0;
const SMALL_INCLINATION = 5.2359877e-2;

export function initializeDeepSpaceCommon(
    epoch: number,
    ep: number,
    argpp: number,
    inclp: number,
    nodep: number,
    np: number,
): DeepSpaceCommon {
    const c1ss = 2.9864797e-6;
    const c1l = 4.7968065e-7;
    const zsinis = 0.39785416;
    const zcosis = 0.91744867;
    const zcosgs = 0.1945905;
    const zsings = -0.98088458;

    const snodm = Math.sin(nodep);
    const cnodm = Math.cos(nodep);
    const sinomm = Math.sin(argpp);
    const cosomm = Math.cos(argpp);
    const sinim = Math.sin(inclp);
    const cosim = Math.cos(inclp);
    const emsq = ep * ep;
    const betasq = 1.0 - emsq;
    const rtemsq = Math.sqrt(betasq);

    const day = epoch + 18261.5;
    const xnodce = (4.523602 - 9.2422029e-4 * day) % TWO_PI;
    const stem = Math.sin(xnodce);
    const ctem = Math.cos(xnodce);
    const zcosil = 0.91375164 - 0.03568096 * ctem;
    const zsinil = Math.sqrt(1.0 - zcosil * zcosil);
    const zsinhl = (0.089683511 * stem) / zsinil;
    const zcoshl = Math.sqrt(1.0 - zsinhl * zsinhl);
    const gam = 5.8351514 + 0.001944368 * day;
    const zx = gam + Math.atan2((0.39785416 * stem) / zsinil, zcoshl * ctem + 0.91744867 * zsinhl * stem) - xnodce;

    const orbit: LuniSolarOrbit = {ep, np, sinim, cosim, sinomm, cosomm, emsq, betasq, rtemsq};
    const solar = getLuniSolarTerms(orbit, zcosgs, zsings, zcosis, zsinis, cnodm, snodm, c1ss);
    const lunar = getLuniSolarTerms(
        orbit,
        Math.cos(zx),
        Math.sin(zx),
        zcosil,
        zsinil,
        zcoshl * cnodm + zsinhl * snodm,
        snodm * zcoshl - cnodm * zsinhl,
        c1l,
    );

    return {
        sinim,
        cosim,
        emsq,
        s1: lunar.s1,
        s2: lunar.s2,
        s3: lunar.s3,
        s4: lunar.s4,
        s5: lunar.s5,
        ss1: solar.s1,
        ss2: solar.s2,
        ss3: solar.s3,
        ss4: solar.s4,
        ss5: solar.s5,
        sz1: solar.z1,
        sz3: solar.z3,
        sz11: solar.z11,
        sz13: solar.z13,
        sz21: solar.z21,
        sz23: solar.z23,
        sz31: solar.z31,
        sz33: solar.z33,
        z1: lunar.z1,
        z3: lunar.z3,
        z11: lunar.z11,
        z13: lunar.z13,
        z21: lunar.z21,
        z23: lunar.z23,
        z31: lunar.z31,
        z33: lunar.z33,
        periodics: {
            se2: 2.0 * solar.s1 * solar.s6,
            se3: 2.0 * solar.s1 * solar.s7,
            si2: 2.0 * solar.s2 * solar.z12,
            si3: 2.0 * solar.s2 * (solar.z13 - solar.z11),
            sl2: -2.0 * solar.s3 * solar.z2,
            sl3: -2.0 * solar.s3 * (solar.z3 - solar.z1),
            sl4: -2.0 * solar.s3 * (-21.0 - 9.0 * emsq) * ZES,
            sgh2: 2.0 * solar.s4 * solar.z32,
            sgh3: 2.0 * solar.s4 * (solar.z33 - solar.z31),
            sgh4: -18.0 * solar.s4 * ZES,
            sh2: -2.0 * solar.s2 * solar.z22,
            sh3: -2.0 * solar.s2 * (solar.z23 - solar.z21),
            ee2: 2.0 * lunar.s1 * lunar.s6,
            e3: 2.0 * lunar.s1 * lunar.s7,
            xi2: 2.0 * lunar.s2 * lunar.z12,
            xi3: 2.0 * lunar.s2 * (lunar.z13 - lunar.z11),
            xl2: -2.0 * lunar.s3 * lunar.z2,
            xl3: -2.0 * lunar.s3 * (lunar.z3 - lunar.z1),
            xl4: -2.0 * lunar.s3 * (-21.0 - 9.0 * emsq) * ZEL,
            xgh2: 2.0 * lunar.s4 * lunar.z32,
            xgh3: 2.0 * lunar.s4 * (lunar.z33 - lunar.z31),
            xgh4: -18.0 * lunar.s4 * ZEL,
            xh2: -2.0 * lunar.s2 * lunar.z22,
            xh3: -2.0 * lunar.s2 * (lunar.z23 - lunar.z21),
            zmol: (4.7199672 + 0.2299715 * day - gam) % TWO_PI,
            zmos: (6.2565837 + 0.017201977 * day) % TWO_PI,
        },
    };
}

function getLuniSolarTerms(
    orbit: LuniSolarOrbit,
    zcosg: number,
    zsing: number,
    zcosi: number,
    zsini: number,
    zcosh: number,
    zsinh: number,
    cc: number,
): LuniSolarTerms {
    const {ep, np, sinim, cosim, sinomm, cosomm, emsq, betasq, rtemsq} = orbit;
    const a1 = zcosg * zcosh + zsing * zcosi * zsinh;
    const a3 = -zsing * zcosh + zcosg * zcosi * zsinh;
    const a7 = -zcosg * zsinh + zsing * zcosi * zcosh;
    const a8 = zsing * zsini;
    const a9 = zsing * zsinh + zcosg * zcosi * zcosh;
    const a10 = zcosg * zsini;
    const a2 = cosim * a7 + sinim * a8;
    const a4 = cosim * a9 + sinim * a10;
    const a5 = -sinim * a7 + cosim * a8;
    const a6 = -sinim * a9 + cosim * a10;

    const x1 = a1 * cosomm + a2 * sinomm;
    const x2 = a3 * cosomm + a4 * sinomm;
    const x3 = -a1 * sinomm + a2 * cosomm;
    const x4 = -a3 * sinomm + a4 * cosomm;
    const x5 = a5 * sinomm;
    const x6 = a6 * sinomm;
    const x7 = a5 * cosomm;
    const x8 = a6 * cosomm;

    const z31 = 12.0 * x1 * x1 - 3.0 * x3 * x3;
    const z32 = 24.0 * x1 * x2 - 6.0 * x3 * x4;
    const z33 = 12.0 * x2 * x2 - 3.0 * x4 * x4;
    const z1 = 3.0 * (a1 * a1 + a2 * a2) + z31 * emsq;
    const z2 = 6.0 * (a1 * a3 + a2 * a4) + z32 * emsq;
    const z3 = 3.0 * (a3 * a3 + a4 * a4) + z33 * emsq;
    const s3 = cc / np;
    const s4 = s3 * rtemsq;

    return {
        z1: z1 + z1 + betasq * z31,
        z2: z2 + z2 + betasq * z32,
        z3: z3 + z3 + betasq * z33,
        z11: -6.0 * a1 * a5 + emsq * (-24.0 * x1 * x7 - 6.0 * x3 * x5),
        z12: -6.0 * (a1 * a6 + a3 * a5) + emsq * (-24.0 * (x2 * x7 + x1 * x8) - 6.0 * (x3 * x6 + x4 * x5)),
        z13: -6.0 * a3 * a6 + emsq * (-24.0 * x2 * x8 - 6.0 * x4 * x6),
        z21: 6.0 * a2 * a5 + emsq * (24.0 * x1 * x5 - 6.0 * x3 * x7),
        z22: 6.0 * (a4 * a5 + a2 * a6) + emsq * (24.0 * (x2 * x5 + x1 * x6) - 6.0 * (x4 * x7 + x3 * x8)),
        z23: 6.0 * a4 * a6 + emsq * (24.0 * x2 * x6 - 6.0 * x4 * x8),
        z31,
        z32,
        z33,
        s1: -15.0 * ep * s4,
        s2: (-0.5 * s3) / rtemsq,
        s3,
        s4,
        s5: x1 * x3 + x2 * x4,
        s6: x2 * x3 + x1 * x4,
        s7: x2 * x4 - x1 * x3,
    };
}

export function initializeDeepSpaceSecular(
    record: Sgp4Record,
    common: DeepSpaceCommon,
    eccsq: number,
    xpidot: number,
): DeepSpaceSecular {
    const {ecco, inclo, no} = record;
    const {sinim, cosim, emsq} = common;
    const {s1, s2, s3, s4, s5, z1, z3, z11, z13, z21, z23, z31, z33} = common;
    const {ss1, ss2, ss3, ss4, ss5, sz1, sz3, sz11, sz13, sz21, sz23, sz31, sz33} = common;
    const isEquatorial = inclo < SMALL_INCLINATION || inclo > Math.PI - SMALL_INCLINATION;

    const ses = ss1 * ZNS * ss5;
    const sis = ss2 * ZNS * (sz11 + sz13);
    const sls = -ZNS * ss3 * (sz1 + sz3 - 14.0 - 6.0 * emsq);
    const sghs = ss4 * ZNS * (sz31 + sz33 - 6.0);
    let shs = isEquatorial ? 0.0 : -ZNS * ss2 * (sz21 + sz23);

    if (sinim !== 0.0) {
        shs = shs / sinim;
    }

    const sghl = s4 * ZNL * (z31 + z33 - 6.0);
    const shll = isEquatorial ? 0.0 : -ZNL * s2 * (z21 + z23);
    let domdt = sghs - cosim * shs + sghl;
    let dnodt = shs;

    if (sinim !== 0.0) {
        domdt = domdt - (cosim / sinim) * shll;
        dnodt = dnodt + shll / sinim;
    }

    const secular: DeepSpaceSecular = {
        irez: getResonance(no, ecco),
        dedt: ses + s1 * ZNL * s5,
        didt: sis + s2 * ZNL * (z11 + z13),
        dmdt: sls - ZNL * s3 * (z1 + z3 - 14.0 - 6.0 * emsq),
        domdt,
        dnodt,
        d2201: 0,
        d2211: 0,
        d3210: 0,
        d3222: 0,
        d4410: 0,
        d4422: 0,
        d5220: 0,
        d5232: 0,
        d5421: 0,
        d5433: 0,
        del1: 0,
        del2: 0,
        del3: 0,
        xfact: 0,
        xlamo: 0,
    };

    const theta = record.gsto % TWO_PI;
    const aonv = (no / WGS72_XKE) ** X2O3;

    if (secular.irez === 2) {
        return {...secular, ...getHalfDayResonance(record, secular, sinim, cosim, eccsq, aonv, theta)};
    }

    if (secular.irez === 1) {
        return {...secular, ...getSynchronousResonance(record, secular, sinim, cosim, emsq, aonv, theta, xpidot)};
    }

    return secular;
}

function getResonance(nm: number, em: number): 0 | 1 | 2 {
    if (nm < 0.0052359877 && nm > 0.0034906585) {
        return 1;
    }

    if (nm >= 8.26e-3 && nm <= 9.24e-3 && em >= 0.5) {
        return 2;
    }

    return 0;
}

function getHalfDayResonance(
    record: Sgp4Record,
    secular: DeepSpaceSecular,
    sinim: number,
    cosim: number,
    eccsq: number,
    aonv: number,
    theta: number,
): Partial<DeepSpaceSecular> {
    const root22 = 1.7891679e-6;
    const root44 = 7.3636953e-9;
    const root54 = 2.1765803e-9;
    const root32 = 3.7393792e-7;
    const root52 = 1.1428639e-7;

    const {ecco: em, mo, nodeo, mdot, nodedot, no} = record;
    const emsq = eccsq;
    const cosisq = cosim * cosim;
    const eoc = em * emsq;
    const g201 = -0.306 - (em - 0.64) * 0.44;

    let g211: number;
    let g310: number;
    let g322: number;
    let g410: number;
    let g422: number;
    let g520: number;

    if (em <= 0.65) {
        g211 = 3.616 - 13.247 * em + 16.29 * emsq;
        g310 = -19.302 + 117.39 * em - 228.419 * emsq + 156.591 * eoc;
        g322 = -18.9068 + 109.7927 * em - 214.6334 * emsq + 146.5816 * eoc;
        g410 = -41.122 + 242.694 * em - 471.094 * emsq + 313.953 * eoc;
        g422 = -146.407 + 841.88 * em - 1629.014 * emsq + 1083.435 * eoc;
        g520 = -532.114 + 3017.977 * em - 5740.032 * emsq + 3708.276 * eoc;
    } else {
        g211 = -72.099 + 331.819 * em - 508.738 * emsq + 266.724 * eoc;
        g310 = -346.844 + 1582.851 * em - 2415.925 * emsq + 1246.113 * eoc;
        g322 = -342.585 + 1554.908 * em - 2366.899 * emsq + 1215.972 * eoc;
        g410 = -1052.797 + 4758.686 * em - 7193.992 * emsq + 3651.957 * eoc;
        g422 = -3581.69 + 16178.11 * em - 24462.77 * emsq + 12422.52 * eoc;
        g520 =
            em > 0.715
                ? -5149.66 + 29936.92 * em - 54087.36 * emsq + 31324.56 * eoc
                : 1464.74 - 4664.75 * em + 3763.64 * emsq;
    }

    let g533: number;
    let g521: number;
    let g532: number;

    if (em < 0.7) {
        g533 = -919.2277 + 4988.61 * em - 9064.77 * emsq + 5542.21 * eoc;
        g521 = -822.71072 + 4568.6173 * em - 8491.4146 * emsq + 5337.524 * eoc;
        g532 = -853.666 + 4690.25 * em - 8624.77 * emsq + 5341.4 * eoc;
    } else {
        g533 = -37995.78 + 161616.52 * em - 229838.2 * emsq + 109377.94 * eoc;
        g521 = -51752.104 + 218913.95 * em - 309468.16 * emsq + 146349.42 * eoc;
        g532 = -40023.88 + 170470.89 * em - 242699.48 * emsq + 115605.82 * eoc;
    }

    const sini2 = sinim * sinim;
    const f220 = 0.75 * (1.0 + 2.0 * cosim + cosisq);
    const f221 = 1.5 * sini2;
    const f321 = 1.875 * sinim * (1.0 - 2.0 * cosim - 3.0 * cosisq);
    const f322 = -1.875 * sinim * (1.0 + 2.0 * cosim - 3.0 * cosisq);
    const f441 = 35.0 * sini2 * f220;
    const f442 = 39.375 * sini2 * sini2;
    const f522 =
        9.84375
        * sinim
        * (sini2 * (1.0 - 2.0 * cosim - 5.0 * cosisq) + 0.33333333 * (-2.0 + 4.0 * cosim + 6.0 * cosisq));
    const f523 =
        sinim
        * (4.92187512 * sini2 * (-2.0 - 4.0 * cosim + 10.0 * cosisq) + 6.56250012 * (1.0 + 2.0 * cosim - 3.0 * cosisq));
    const f542 = 29.53125 * sinim * (2.0 - 8.0 * cosim + cosisq * (-12.0 + 8.0 * cosim + 10.0 * cosisq));
    const f543 = 29.53125 * sinim * (-2.0 - 8.0 * cosim + cosisq * (12.0 + 8.0 * cosim - 10.0 * cosisq));

    const xno2 = no * no;
    const ainv2 = aonv * aonv;
    let temp1 = 3.0 * xno2 * ainv2;
    let temp = temp1 * root22;
    const d2201 = temp * f220 * g201;
    const d2211 = temp * f221 * g211;
    temp1 = temp1 * aonv;
    temp = temp1 * root32;
    const d3210 = temp * f321 * g310;
    const d3222 = temp * f322 * g322;
    temp1 = temp1 * aonv;
    temp = 2.0 * temp1 * root44;
    const d4410 = temp * f441 * g410;
    const d4422 = temp * f442 * g422;
    temp1 = temp1 * aonv;
    temp = temp1 * root52;
    const d5220 = temp * f522 * g520;
    const d5232 = temp * f523 * g532;
    temp = 2.0 * temp1 * root54;
    const d5421 = temp * f542 * g521;
    const d5433 = temp * f543 * g533;

    return {
        d2201,
        d2211,
        d3210,
        d3222,
        d4410,
        d4422,
        d5220,
        d5232,
        d5421,
        d5433,
        xlamo: (mo + nodeo + nodeo - theta - theta) % TWO_PI,
        xfact: mdot + secular.dmdt + 2.0 * (nodedot + secular.dnodt - RPTIM) - no,
    };
}

function getSynchronousResonance(
    record: Sgp4Record,
    secular: DeepSpaceSecular,
    sinim: number,
    cosim: number,
    emsq: number,
    aonv: number,
    theta: number,
    xpidot: number,
): Partial<DeepSpaceSecular> {
    const q22 = 1.7891679e-6;
    const q31 = 2.1460748e-6;
    const q33 = 2.2123015e-7;

    const {mo, nodeo, argpo, mdot, no} = record;
    const g200 = 1.0 + emsq * (-2.5 + 0.8125 * emsq);
    const g310 = 1.0 + 2.0 * emsq;
    const g300 = 1.0 + emsq * (-6.0 + 6.60937 * emsq);
    const f220 = 0.75 * (1.0 + cosim) * (1.0 + cosim);
    const f311 = 0.9375 * sinim * sinim * (1.0 + 3.0 * cosim) - 0.75 * (1.0 + cosim);
    const f330 = 1.875 * (1.0 + cosim) ** 3;
    const del1 = 3.0 * no * no * aonv * aonv;

    return {
        del1: del1 * f311 * g310 * q31 * aonv,
        del2: 2.0 * del1 * f220 * g200 * q22,
        del3: 3.0 * del1 * f330 * g300 * q33 * aonv,
        xlamo: (mo + nodeo + argpo - theta) % TWO_PI,
        xfact: mdot + xpidot - RPTIM + secular.dmdt + secular.domdt + secular.dnodt - no,
    };
}

export function applyDeepSpaceSecular(
    record: Sgp4Record,
    secular: DeepSpaceSecular,
    mean: MeanElements,
    t: number,
): MeanElements {
    const theta = (record.gsto + t * RPTIM) % TWO_PI;
    const elements: MeanElements = {
        em: mean.em + secular.dedt * t,
        inclm: mean.inclm + secular.didt * t,
        argpm: mean.argpm + secular.domdt * t,
        nodem: mean.nodem + secular.dnodt * t,
        mm: mean.mm + secular.dmdt * t,
        nm: mean.nm,
    };

    if (secular.irez === 0) {
        return elements;
    }

    const {xni, xli, xndt, xnddt, xldot, ft} = integrateResonance(record, secular, t);
    const xl = xli + xldot * ft + xndt * ft * ft * 0.5;

    return {
        ...elements,
        mm: secular.irez === 1 ? xl - elements.nodem - elements.argpm + theta : xl - 2.0 * elements.nodem + 2.0 * theta,
        nm: xni + xndt * ft + xnddt * ft * ft * 0.5,
    };
}

function integrateResonance(record: Sgp4Record, secular: DeepSpaceSecular, t: number): ResonanceIntegration {
    const delt = t > 0.0 ? STEP : -STEP;
    let atime = 0.0;
    let xni = record.no;
    let xli = secular.xlamo;

    for (;;) {
        const {xndt, xldot, xnddt} = getResonanceRates(record, secular, atime, xni, xli);

        if (Math.abs(t - atime) < STEP) {
            return {xni, xli, xndt, xnddt, xldot, ft: t - atime};
        }

        xli = xli + xldot * delt + xndt * STEP2;
        xni = xni + xndt * delt + xnddt * STEP2;
        atime = atime + delt;
    }
}

function getResonanceRates(
    record: Sgp4Record,
    secular: DeepSpaceSecular,
    atime: number,
    xni: number,
    xli: number,
): ResonanceRates {
    const xldot = xni + secular.xfact;

    if (secular.irez !== 2) {
        const fasx2 = 0.13130908;
        const fasx4 = 2.8843198;
        const fasx6 = 0.37448087;
        const {del1, del2, del3} = secular;

        const xndt =
            del1 * Math.sin(xli - fasx2) + del2 * Math.sin(2.0 * (xli - fasx4)) + del3 * Math.sin(3.0 * (xli - fasx6));
        const xnddt =
            del1 * Math.cos(xli - fasx2)
            + 2.0 * del2 * Math.cos(2.0 * (xli - fasx4))
            + 3.0 * del3 * Math.cos(3.0 * (xli - fasx6));

        return {xndt, xldot, xnddt: xnddt * xldot};
    }

    const g22 = 5.7686396;
    const g32 = 0.95240898;
    const g44 = 1.8014998;
    const g52 = 1.050833;
    const g54 = 4.4108898;
    const {d2201, d2211, d3210, d3222, d4410, d4422, d5220, d5232, d5421, d5433} = secular;

    const xomi = record.argpo + record.argpdot * atime;
    const x2omi = xomi + xomi;
    const x2li = xli + xli;
    const xndt =
        d2201 * Math.sin(x2omi + xli - g22)
        + d2211 * Math.sin(xli - g22)
        + d3210 * Math.sin(xomi + xli - g32)
        + d3222 * Math.sin(-xomi + xli - g32)
        + d4410 * Math.sin(x2omi + x2li - g44)
        + d4422 * Math.sin(x2li - g44)
        + d5220 * Math.sin(xomi + xli - g52)
        + d5232 * Math.sin(-xomi + xli - g52)
        + d5421 * Math.sin(xomi + x2li - g54)
        + d5433 * Math.sin(-xomi + x2li - g54);
    const xnddt =
        d2201 * Math.cos(x2omi + xli - g22)
        + d2211 * Math.cos(xli - g22)
        + d3210 * Math.cos(xomi + xli - g32)
        + d3222 * Math.cos(-xomi + xli - g32)
        + d5220 * Math.cos(xomi + xli - g52)
        + d5232 * Math.cos(-xomi + xli - g52)
        + 2.0
            * (d4410 * Math.cos(x2omi + x2li - g44)
                + d4422 * Math.cos(x2li - g44)
                + d5421 * Math.cos(xomi + x2li - g54)
                + d5433 * Math.cos(-xomi + x2li - g54));

    return {xndt, xldot, xnddt: xnddt * xldot};
}

export function applyDeepSpacePeriodics(
    periodics: DeepSpacePeriodics,
    elements: PeriodicElements,
    t: number,
): PeriodicElements {
    const solar = getPeriodicTerms(periodics.zmos + ZNS * t, ZES, {
        e2: periodics.se2,
        e3: periodics.se3,
        i2: periodics.si2,
        i3: periodics.si3,
        l2: periodics.sl2,
        l3: periodics.sl3,
        l4: periodics.sl4,
        gh2: periodics.sgh2,
        gh3: periodics.sgh3,
        gh4: periodics.sgh4,
        h2: periodics.sh2,
        h3: periodics.sh3,
    });
    const lunar = getPeriodicTerms(periodics.zmol + ZNL * t, ZEL, {
        e2: periodics.ee2,
        e3: periodics.e3,
        i2: periodics.xi2,
        i3: periodics.xi3,
        l2: periodics.xl2,
        l3: periodics.xl3,
        l4: periodics.xl4,
        gh2: periodics.xgh2,
        gh3: periodics.xgh3,
        gh4: periodics.xgh4,
        h2: periodics.xh2,
        h3: periodics.xh3,
    });

    const pe = solar.e + lunar.e;
    const pinc = solar.i + lunar.i;
    const pl = solar.l + lunar.l;
    let pgh = solar.gh + lunar.gh;
    let ph = solar.h + lunar.h;

    const inclp = elements.inclp + pinc;
    const ep = elements.ep + pe;
    const sinip = Math.sin(inclp);
    const cosip = Math.cos(inclp);

    if (inclp >= 0.2) {
        ph = ph / sinip;
        pgh = pgh - cosip * ph;

        return {
            ep,
            inclp,
            argpp: elements.argpp + pgh,
            nodep: elements.nodep + ph,
            mp: elements.mp + pl,
        };
    }

    const sinop = Math.sin(elements.nodep);
    const cosop = Math.cos(elements.nodep);
    const alfdp = sinip * sinop + (ph * cosop + pinc * cosip * sinop);
    const betdp = sinip * cosop + (-ph * sinop + pinc * cosip * cosop);
    const xnoh = elements.nodep % TWO_PI;
    const xls = elements.mp + elements.argpp + cosip * xnoh + (pl + pgh - pinc * xnoh * sinip);
    let nodep = Math.atan2(alfdp, betdp);

    if (Math.abs(xnoh - nodep) > Math.PI) {
        nodep = nodep < xnoh ? nodep + TWO_PI : nodep - TWO_PI;
    }

    const mp = elements.mp + pl;

    return {ep, inclp, nodep, argpp: xls - mp - cosip * nodep, mp};
}

function getPeriodicTerms(zm: number, ze: number, c: PeriodicCoefficients): PeriodicTerms {
    const zf = zm + 2.0 * ze * Math.sin(zm);
    const sinzf = Math.sin(zf);
    const f2 = 0.5 * sinzf * sinzf - 0.25;
    const f3 = -0.5 * sinzf * Math.cos(zf);

    return {
        e: c.e2 * f2 + c.e3 * f3,
        i: c.i2 * f2 + c.i3 * f3,
        l: c.l2 * f2 + c.l3 * f3 + c.l4 * sinzf,
        gh: c.gh2 * f2 + c.gh3 * f3 + c.gh4 * sinzf,
        h: c.h2 * f2 + c.h3 * f3,
    };
}
