import {SolarEclipseType} from '../constants/solarEclipseTypes';

export type TimeCircumstances = {
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

export type TimeLocationCircumstances = {
    t: number,
    u: number,
    v: number,
    a: number,
    b: number,
    l1Derived: number,
    l2Derived: number,
    n2: number,
};

export type ObservationalCircumstances = {
    eclipseType: SolarEclipseType,
    maximumEclipse: number,
    magnitude: number,
    moonSunRatio: number,
}
