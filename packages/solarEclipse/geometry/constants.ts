import {EARTH_POLAR_RADIUS_RATIO, ECCENTRICITY_SQUARED} from '@app/constants/earth';
import {DEG} from '@app/constants/math';

export {EARTH_ROTATION_DEG_PER_HOUR} from '@app/constants/earth';
export {DEG, RAD} from '@app/constants/math';

export const ONE_MINUS_F = EARTH_POLAR_RADIUS_RATIO;
export const E_SQ = ECCENTRICITY_SQUARED;

// Standard sunrise/sunset: the Sun's upper limb sits on the horizon, raised by atmospheric
// refraction. The Sun's centre is then 34' (horizon refraction) + 16' (semidiameter) below
// the astronomical horizon, i.e. at altitude -50'. In Besselian coordinates sin(altitude) =
// zeta / rho, so the terminator used for the rise/set curves lies at this slightly negative
// zeta on the night side rather than at zeta = 0 (geometric horizon of the Sun's centre).
const HORIZON_REFRACTION_DEG = 34 / 60;
const SUN_SEMIDIAMETER_DEG = 16 / 60;
const RISE_SET_SUN_ALTITUDE_DEG = -(HORIZON_REFRACTION_DEG + SUN_SEMIDIAMETER_DEG);
export const RISE_SET_SIN_ALTITUDE = Math.sin(RISE_SET_SUN_ALTITUDE_DEG * DEG);

export const CENTRAL_LINE_STEP_HOURS = 1 / (60 * 60);
export const UMBRA_PATH_STEP_HOURS = 1 / (360 * 5);
export const PENUMBRA_PATH_STEP_HOURS = 1 / (120 * 5);
export const RISE_SET_BOUNDARY_STEP_HOURS = 1 / 60;
export const RISE_SET_BOUNDARY_Q_SAMPLES = 180;
