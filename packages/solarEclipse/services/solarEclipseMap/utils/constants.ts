import {EARTH_POLAR_RADIUS_RATIO, ECCENTRICITY_SQUARED} from '@app/constants/earth';
import {DEG} from '@app/constants/math';
import type {SolarEclipseMapSettings} from '../types/SolarEclipsePathTypes';

export {EARTH_ROTATION_DEG_PER_HOUR} from '@app/constants/earth';
export {DEG, RAD} from '@app/constants/math';

export const ONE_MINUS_F = EARTH_POLAR_RADIUS_RATIO;
export const E_SQ = ECCENTRICITY_SQUARED;

// Standard sunrise/sunset with refraction: the Sun's upper limb sits on the horizon, raised
// by atmospheric refraction. The Sun's centre is then 34' (horizon refraction) + 16'
// (semidiameter) below the astronomical horizon, i.e. at altitude -50'. In Besselian
// coordinates sin(altitude) = zeta / rho, so the refracted terminator lies at this slightly
// negative zeta on the night side rather than at zeta = 0 (geometric horizon of the Sun's
// centre, the Espenak/Jubier convention — expect a ~0.8 degree offset between the two
// conventions along all rise/set curves).
const HORIZON_REFRACTION_DEG = 34 / 60;
const SUN_SEMIDIAMETER_DEG = 16 / 60;
const RISE_SET_SUN_ALTITUDE_DEG = -(HORIZON_REFRACTION_DEG + SUN_SEMIDIAMETER_DEG);
export const REFRACTED_HORIZON_SIN_ALTITUDE = Math.sin(RISE_SET_SUN_ALTITUDE_DEG * DEG);
export const GEOMETRIC_HORIZON_SIN_ALTITUDE = 0;

// Sin of the Sun altitude that counts as rise/set for the map's settings; every
// horizon-dependent curve (loops, max-eclipse curves, penumbral shading border, umbra
// region clip, central-line hooks) derives its zeta threshold from this single value.
export function horizonSinAltitude(settings?: SolarEclipseMapSettings): number {
    return settings?.refraction ? REFRACTED_HORIZON_SIN_ALTITUDE : GEOMETRIC_HORIZON_SIN_ALTITUDE;
}

export const CENTRAL_LINE_STEP_HOURS = 1 / (60 * 60);
// Region fills are unions of instantaneous outlines. Along the rise/set edges the union
// boundary is traced by the corner where an outline switches from shadow edge to terminator
// arc; that corner advances with the shadow (~0.5°/min), so the step must keep the resulting
// stair teeth below a map pixel.
export const UMBRA_REGION_STEP_HOURS = 1 / 720;
export const RISE_SET_BOUNDARY_STEP_HOURS = 1 / 60;
export const RISE_SET_BOUNDARY_Q_SAMPLES = 180;
// Extra samples squeezed between a rise/set tangent tip and the neighbouring uniform step
// (sqrt-spaced in tau, so roughly even along the curve — see feedTipNeighborhood).
export const RISE_SET_TIP_REFINEMENT_SAMPLES = 16;
// Longest segment the rise/set loops may chord between consecutive samples; steps whose
// crossings jump further are bisected in tau (see feedRefined), at most this many times.
export const RISE_SET_MAX_CHORD_DEG = 0.75;
export const RISE_SET_GAP_SUBDIVISION_DEPTH = 5;
// Ring positions sampled per instant when locating the maximum-eclipse-at-horizon root.
export const MAX_ECLIPSE_RING_SAMPLES = 240;
