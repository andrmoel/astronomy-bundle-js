export const WGS72_MU = 398600.8;
export const WGS72_RADIUS_KM = 6378.135;
export const WGS72_XKE = 60.0 / Math.sqrt((WGS72_RADIUS_KM * WGS72_RADIUS_KM * WGS72_RADIUS_KM) / WGS72_MU);
export const WGS72_J2 = 0.001082616;
export const WGS72_J3 = -0.00000253881;
export const WGS72_J4 = -0.00000165597;
export const WGS72_J3OJ2 = WGS72_J3 / WGS72_J2;

export const TWO_PI = 2.0 * Math.PI;
export const X2O3 = 2.0 / 3.0;
export const MINUTES_PER_DAY = 1440.0;
export const REVOLUTIONS_PER_DAY_TO_RAD_PER_MINUTE = TWO_PI / MINUTES_PER_DAY;
export const JULIAN_DAY_1950_JAN_0 = 2433281.5;
export const DEEP_SPACE_PERIOD_MINUTES = 225.0;
export const DECAY_RADIUS_EARTH_RADII = 1.0;
export const KM_PER_SEC = (WGS72_RADIUS_KM * WGS72_XKE) / 60.0;

export const ZES = 0.01675;
export const ZEL = 0.0549;
export const ZNS = 1.19459e-5;
export const ZNL = 1.5835218e-4;
export const RPTIM = 4.37526908801129966e-3;
