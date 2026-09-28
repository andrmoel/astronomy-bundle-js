import {
    DECAY_RADIUS_EARTH_RADII,
    DEEP_SPACE_PERIOD_MINUTES,
    JULIAN_DAY_1950_JAN_0,
    KM_PER_SEC,
    REVOLUTIONS_PER_DAY_TO_RAD_PER_MINUTE,
    TWO_PI,
    WGS72_J2,
    WGS72_J3OJ2,
    WGS72_J4,
    WGS72_RADIUS_KM,
    WGS72_XKE,
    X2O3,
} from '../constants/sgp4';
import type {TwoLineElement} from '../types/SatelliteTypes';
import type {MeanElements, PeriodicElements, SecularElements, Sgp4Record, Sgp4State} from '../types/Sgp4Types';
import {
    applyDeepSpacePeriodics,
    applyDeepSpaceSecular,
    initializeDeepSpaceCommon,
    initializeDeepSpaceSecular,
} from './deepSpace';

const TEMP4 = 1.5e-12;

export function initializeSgp4(tle: TwoLineElement): Sgp4Record {
    const deg2rad = Math.PI / 180;
    const epoch = tle.epoch.jd - JULIAN_DAY_1950_JAN_0;
    const ecco = tle.eccentricity;
    const inclo = tle.inclination * deg2rad;
    const nodeo = tle.rightAscensionOfAscendingNode * deg2rad;
    const argpo = tle.argumentOfPerigee * deg2rad;
    const mo = tle.meanAnomaly * deg2rad;
    const bstar = tle.bstarDragTerm;
    const noKozai = tle.meanMotion * REVOLUTIONS_PER_DAY_TO_RAD_PER_MINUTE;

    const eccsq = ecco * ecco;
    const omeosq = 1.0 - eccsq;
    const rteosq = Math.sqrt(omeosq);
    const cosio = Math.cos(inclo);
    const cosio2 = cosio * cosio;
    const sinio = Math.sin(inclo);

    const ak = (WGS72_XKE / noKozai) ** X2O3;
    const d1 = (0.75 * WGS72_J2 * (3.0 * cosio2 - 1.0)) / (rteosq * omeosq);
    let del = d1 / (ak * ak);
    const adel = ak * (1.0 - del * del - del * (1.0 / 3.0 + (134.0 * del * del) / 81.0));
    del = d1 / (adel * adel);
    const no = noKozai / (1.0 + del);

    const ao = (WGS72_XKE / no) ** X2O3;
    const po = ao * omeosq;
    const con42 = 1.0 - 5.0 * cosio2;
    const con41 = -con42 - cosio2 - cosio2;
    const posq = po * po;
    const rp = ao * (1.0 - ecco);
    const gsto = getGreenwichSiderealTime(epoch + JULIAN_DAY_1950_JAN_0);

    const ss = 78.0 / WGS72_RADIUS_KM + 1.0;
    let sfour = ss;
    let qzms24 = ((120.0 - 78.0) / WGS72_RADIUS_KM) ** 4;
    const perige = (rp - 1.0) * WGS72_RADIUS_KM;

    if (perige < 156.0) {
        sfour = perige < 98.0 ? 20.0 : perige - 78.0;
        qzms24 = ((120.0 - sfour) / WGS72_RADIUS_KM) ** 4;
        sfour = sfour / WGS72_RADIUS_KM + 1.0;
    }

    const pinvsq = 1.0 / posq;
    const tsi = 1.0 / (ao - sfour);
    const eta = ao * ecco * tsi;
    const etasq = eta * eta;
    const eeta = ecco * eta;
    const psisq = Math.abs(1.0 - etasq);
    const coef = qzms24 * tsi ** 4;
    const coef1 = coef / psisq ** 3.5;
    const cc2 =
        coef1
        * no
        * (ao * (1.0 + 1.5 * etasq + eeta * (4.0 + etasq))
            + ((0.375 * WGS72_J2 * tsi) / psisq) * con41 * (8.0 + 3.0 * etasq * (8.0 + etasq)));
    const cc1 = bstar * cc2;
    const cc3 = ecco > 1.0e-4 ? (-2.0 * coef * tsi * WGS72_J3OJ2 * no * sinio) / ecco : 0.0;
    const x1mth2 = 1.0 - cosio2;
    const cc4 =
        2.0
        * no
        * coef1
        * ao
        * omeosq
        * (eta * (2.0 + 0.5 * etasq)
            + ecco * (0.5 + 2.0 * etasq)
            - ((WGS72_J2 * tsi) / (ao * psisq))
                * (-3.0 * con41 * (1.0 - 2.0 * eeta + etasq * (1.5 - 0.5 * eeta))
                    + 0.75 * x1mth2 * (2.0 * etasq - eeta * (1.0 + etasq)) * Math.cos(2.0 * argpo)));
    const cc5 = 2.0 * coef1 * ao * omeosq * (1.0 + 2.75 * (etasq + eeta) + eeta * etasq);
    const cosio4 = cosio2 * cosio2;
    const temp1 = 1.5 * WGS72_J2 * pinvsq * no;
    const temp2 = 0.5 * temp1 * WGS72_J2 * pinvsq;
    const temp3 = -0.46875 * WGS72_J4 * pinvsq * pinvsq * no;
    const mdot = no + 0.5 * temp1 * rteosq * con41 + 0.0625 * temp2 * rteosq * (13.0 - 78.0 * cosio2 + 137.0 * cosio4);
    const argpdot =
        -0.5 * temp1 * con42
        + 0.0625 * temp2 * (7.0 - 114.0 * cosio2 + 395.0 * cosio4)
        + temp3 * (3.0 - 36.0 * cosio2 + 49.0 * cosio4);
    const xhdot1 = -temp1 * cosio;
    const nodedot = xhdot1 + (0.5 * temp2 * (4.0 - 19.0 * cosio2) + 2.0 * temp3 * (3.0 - 7.0 * cosio2)) * cosio;
    const xpidot = argpdot + nodedot;
    const delmotemp = 1.0 + eta * Math.cos(mo);

    const record: Sgp4Record = {
        bstar,
        ecco,
        argpo,
        inclo,
        mo,
        no,
        nodeo,
        isimp: rp < 220.0 / WGS72_RADIUS_KM + 1.0,
        aycof: -0.5 * WGS72_J3OJ2 * sinio,
        con41,
        cc1,
        cc4,
        cc5,
        d2: 0,
        d3: 0,
        d4: 0,
        delmo: delmotemp * delmotemp * delmotemp,
        eta,
        argpdot,
        omgcof: bstar * cc3 * Math.cos(argpo),
        sinmao: Math.sin(mo),
        t2cof: 1.5 * cc1,
        t3cof: 0,
        t4cof: 0,
        t5cof: 0,
        x1mth2,
        x7thm1: 7.0 * cosio2 - 1.0,
        mdot,
        nodedot,
        xlcof: getXlcof(sinio, cosio),
        xmcof: ecco > 1.0e-4 ? (-X2O3 * coef * bstar) / eeta : 0.0,
        nodecf: 3.5 * omeosq * xhdot1 * cc1,
        gsto,
        deepSpace: null,
    };

    if (TWO_PI / no >= DEEP_SPACE_PERIOD_MINUTES) {
        const common = initializeDeepSpaceCommon(epoch, ecco, argpo, inclo, nodeo, no);
        const secular = initializeDeepSpaceSecular(record, common, eccsq, xpidot);

        return {...record, isimp: true, deepSpace: {periodics: common.periodics, secular}};
    }

    if (record.isimp) {
        return record;
    }

    const cc1sq = cc1 * cc1;
    const d2 = 4.0 * ao * tsi * cc1sq;
    const temp = (d2 * tsi * cc1) / 3.0;
    const d3 = (17.0 * ao + sfour) * temp;
    const d4 = 0.5 * temp * ao * tsi * (221.0 * ao + 31.0 * sfour) * cc1;

    return {
        ...record,
        d2,
        d3,
        d4,
        t3cof: d2 + 2.0 * cc1sq,
        t4cof: 0.25 * (3.0 * d3 + cc1 * (12.0 * d2 + 10.0 * cc1sq)),
        t5cof: 0.2 * (3.0 * d4 + 12.0 * cc1 * d3 + 6.0 * d2 * d2 + 15.0 * cc1sq * (2.0 * d2 + cc1sq)),
    };
}

export function propagateSgp4(record: Sgp4Record, tsince: number): Sgp4State {
    const secular = getSecularElements(record, tsince);
    const periodic = getPeriodicElements(record, secular, tsince);

    return getState(record, periodic, secular);
}

function getSecularElements(record: Sgp4Record, t: number): SecularElements {
    const xmdf = record.mo + record.mdot * t;
    const argpdf = record.argpo + record.argpdot * t;
    const nodedf = record.nodeo + record.nodedot * t;
    const t2 = t * t;

    let argpm = argpdf;
    let mm = xmdf;
    let tempa = 1.0 - record.cc1 * t;
    let tempe = record.bstar * record.cc4 * t;
    let templ = record.t2cof * t2;

    if (!record.isimp) {
        const delomg = record.omgcof * t;
        const delmtemp = 1.0 + record.eta * Math.cos(xmdf);
        const delm = record.xmcof * (delmtemp * delmtemp * delmtemp - record.delmo);
        const temp = delomg + delm;
        const t3 = t2 * t;
        const t4 = t3 * t;
        mm = xmdf + temp;
        argpm = argpdf - temp;
        tempa = tempa - record.d2 * t2 - record.d3 * t3 - record.d4 * t4;
        tempe = tempe + record.bstar * record.cc5 * (Math.sin(mm) - record.sinmao);
        templ = templ + record.t3cof * t3 + t4 * (record.t4cof + t * record.t5cof);
    }

    let mean: MeanElements = {
        em: record.ecco,
        inclm: record.inclo,
        argpm,
        nodem: nodedf + record.nodecf * t2,
        mm,
        nm: record.no,
    };

    if (record.deepSpace !== null) {
        mean = applyDeepSpaceSecular(record, record.deepSpace.secular, mean, t);
    }

    if (mean.nm <= 0.0) {
        throw new Error(`SGP4: mean motion ${mean.nm} is not positive`);
    }

    const am = (WGS72_XKE / mean.nm) ** X2O3 * tempa * tempa;
    const em = mean.em - tempe;

    if (em >= 1.0 || em < -0.001) {
        throw new Error(`SGP4: mean eccentricity ${em} is out of range`);
    }

    const nodem = mean.nodem % TWO_PI;
    const argpmNormalized = mean.argpm % TWO_PI;
    const xlm = (mean.mm + record.no * templ + mean.argpm + mean.nodem) % TWO_PI;

    return {
        em: Math.max(em, 1.0e-6),
        inclm: mean.inclm,
        argpm: argpmNormalized,
        nodem,
        mm: (xlm - argpmNormalized - nodem) % TWO_PI,
        nm: WGS72_XKE / am ** 1.5,
        am,
    };
}

function getPeriodicElements(record: Sgp4Record, secular: SecularElements, t: number): PeriodicElements {
    const elements: PeriodicElements = {
        ep: secular.em,
        inclp: secular.inclm,
        nodep: secular.nodem,
        argpp: secular.argpm,
        mp: secular.mm,
    };

    if (record.deepSpace === null) {
        return elements;
    }

    const periodic = applyDeepSpacePeriodics(record.deepSpace.periodics, elements, t);

    if (periodic.inclp < 0.0) {
        periodic.inclp = -periodic.inclp;
        periodic.nodep = periodic.nodep + Math.PI;
        periodic.argpp = periodic.argpp - Math.PI;
    }

    if (periodic.ep < 0.0 || periodic.ep > 1.0) {
        throw new Error(`SGP4: perturbed eccentricity ${periodic.ep} is out of range`);
    }

    return periodic;
}

function getState(record: Sgp4Record, periodic: PeriodicElements, secular: SecularElements): Sgp4State {
    const {ep, inclp, nodep, argpp, mp} = periodic;
    const {am, nm} = secular;
    const sinip = Math.sin(inclp);
    const cosip = Math.cos(inclp);

    let {aycof, xlcof, con41, x1mth2, x7thm1} = record;

    if (record.deepSpace !== null) {
        const cosisq = cosip * cosip;
        aycof = -0.5 * WGS72_J3OJ2 * sinip;
        xlcof = getXlcof(sinip, cosip);
        con41 = 3.0 * cosisq - 1.0;
        x1mth2 = 1.0 - cosisq;
        x7thm1 = 7.0 * cosisq - 1.0;
    }

    const axnl = ep * Math.cos(argpp);
    let temp = 1.0 / (am * (1.0 - ep * ep));
    const aynl = ep * Math.sin(argpp) + temp * aycof;
    const xl = mp + argpp + nodep + temp * xlcof * axnl;
    const u = (xl - nodep) % TWO_PI;
    const {sineo1, coseo1} = solveKepler(u, axnl, aynl);

    const ecose = axnl * coseo1 + aynl * sineo1;
    const esine = axnl * sineo1 - aynl * coseo1;
    const el2 = axnl * axnl + aynl * aynl;
    const pl = am * (1.0 - el2);

    if (pl < 0.0) {
        throw new Error(`SGP4: semi-latus rectum ${pl} is negative`);
    }

    const rl = am * (1.0 - ecose);
    const rdotl = (Math.sqrt(am) * esine) / rl;
    const rvdotl = Math.sqrt(pl) / rl;
    const betal = Math.sqrt(1.0 - el2);
    temp = esine / (1.0 + betal);
    const sinu = (am / rl) * (sineo1 - aynl - axnl * temp);
    const cosu = (am / rl) * (coseo1 - axnl + aynl * temp);
    let su = Math.atan2(sinu, cosu);
    const sin2u = (cosu + cosu) * sinu;
    const cos2u = 1.0 - 2.0 * sinu * sinu;
    temp = 1.0 / pl;
    const temp1 = 0.5 * WGS72_J2 * temp;
    const temp2 = temp1 * temp;

    const mrt = rl * (1.0 - 1.5 * temp2 * betal * con41) + 0.5 * temp1 * x1mth2 * cos2u;

    if (mrt < DECAY_RADIUS_EARTH_RADII) {
        throw new Error('SGP4: satellite has decayed');
    }

    su = su - 0.25 * temp2 * x7thm1 * sin2u;
    const xnode = nodep + 1.5 * temp2 * cosip * sin2u;
    const xinc = inclp + 1.5 * temp2 * cosip * sinip * cos2u;
    const mvt = rdotl - (nm * temp1 * x1mth2 * sin2u) / WGS72_XKE;
    const rvdot = rvdotl + (nm * temp1 * (x1mth2 * cos2u + 1.5 * con41)) / WGS72_XKE;

    const sinsu = Math.sin(su);
    const cossu = Math.cos(su);
    const snod = Math.sin(xnode);
    const cnod = Math.cos(xnode);
    const sini = Math.sin(xinc);
    const cosi = Math.cos(xinc);
    const xmx = -snod * cosi;
    const xmy = cnod * cosi;
    const ux = xmx * sinsu + cnod * cossu;
    const uy = xmy * sinsu + snod * cossu;
    const uz = sini * sinsu;
    const vx = xmx * cossu - cnod * sinsu;
    const vy = xmy * cossu - snod * sinsu;
    const vz = sini * cossu;
    const mr = mrt * WGS72_RADIUS_KM;

    return {
        position: {x: mr * ux, y: mr * uy, z: mr * uz},
        velocity: {
            x: (mvt * ux + rvdot * vx) * KM_PER_SEC,
            y: (mvt * uy + rvdot * vy) * KM_PER_SEC,
            z: (mvt * uz + rvdot * vz) * KM_PER_SEC,
        },
    };
}

function solveKepler(u: number, axnl: number, aynl: number): {sineo1: number; coseo1: number} {
    let eo1 = u;
    let tem5 = 9999.9;
    let sineo1 = 0;
    let coseo1 = 0;

    for (let ktr = 1; Math.abs(tem5) >= 1.0e-12 && ktr <= 10; ktr++) {
        sineo1 = Math.sin(eo1);
        coseo1 = Math.cos(eo1);
        tem5 = (u - aynl * coseo1 + axnl * sineo1 - eo1) / (1.0 - coseo1 * axnl - sineo1 * aynl);

        if (Math.abs(tem5) >= 0.95) {
            tem5 = tem5 > 0.0 ? 0.95 : -0.95;
        }

        eo1 = eo1 + tem5;
    }

    return {sineo1, coseo1};
}

function getXlcof(sinio: number, cosio: number): number {
    const divisor = Math.abs(cosio + 1.0) > TEMP4 ? 1.0 + cosio : TEMP4;

    return (-0.25 * WGS72_J3OJ2 * sinio * (3.0 + 5.0 * cosio)) / divisor;
}

function getGreenwichSiderealTime(jdut1: number): number {
    const tut1 = (jdut1 - 2451545.0) / 36525.0;
    const seconds =
        -6.2e-6 * tut1 * tut1 * tut1 + 0.093104 * tut1 * tut1 + (876600.0 * 3600 + 8640184.812866) * tut1 + 67310.54841;
    const gst = ((seconds * Math.PI) / 180 / 240.0) % TWO_PI;

    return gst < 0.0 ? gst + TWO_PI : gst;
}
