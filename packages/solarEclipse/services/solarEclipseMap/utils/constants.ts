export const RISE_SET_BOUNDARY_STEP_HOURS = 1 / 60;
export const RISE_SET_BOUNDARY_Q_SAMPLES = 180;
// Extra samples squeezed between a rise/set tangent tip and the neighbouring uniform step
// (sqrt-spaced in tau, so roughly even along the curve — see feedTipNeighborhood).
export const RISE_SET_TIP_REFINEMENT_SAMPLES = 16;
// Longest segment the rise/set loops may chord between consecutive samples; steps whose
// crossings jump further are bisected in tau (see feedRefined), at most this many times.
export const RISE_SET_MAX_CHORD_DEG = 0.75;
export const RISE_SET_GAP_SUBDIVISION_DEPTH = 5;
