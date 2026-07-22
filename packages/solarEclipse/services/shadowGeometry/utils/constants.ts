import {EARTH_POLAR_RADIUS_RATIO, ECCENTRICITY_SQUARED} from '@app/constants/earth';
import {DEG} from '@app/constants/math';

export {EARTH_ROTATION_DEG_PER_HOUR} from '@app/constants/earth';
export {DEG, RAD} from '@app/constants/math';

export const ONE_MINUS_F = EARTH_POLAR_RADIUS_RATIO;
export const E_SQ = ECCENTRICITY_SQUARED;

const HORIZON_REFRACTION_DEG = 34 / 60;
const SUN_SEMIDIAMETER_DEG = 16 / 60;
const RISE_SET_SUN_ALTITUDE_DEG = -(HORIZON_REFRACTION_DEG + SUN_SEMIDIAMETER_DEG);
export const REFRACTED_HORIZON_SIN_ALTITUDE = Math.sin(RISE_SET_SUN_ALTITUDE_DEG * DEG);
export const GEOMETRIC_HORIZON_SIN_ALTITUDE = 0;

export function horizonSinAltitude(settings?: {refraction?: boolean}): number {
    return settings?.refraction ? REFRACTED_HORIZON_SIN_ALTITUDE : GEOMETRIC_HORIZON_SIN_ALTITUDE;
}

export const CENTRAL_LINE_STEP_HOURS = 1 / (60 * 60);
export const UMBRA_REGION_STEP_HOURS = 1 / 720;

export const RISE_SET_BOUNDARY_STEP_HOURS = 1 / 60;
export const RISE_SET_BOUNDARY_Q_SAMPLES = 180;
export const RISE_SET_TIP_REFINEMENT_SAMPLES = 16;
export const RISE_SET_MAX_CHORD_DEG = 0.75;
export const RISE_SET_GAP_SUBDIVISION_DEPTH = 5;
