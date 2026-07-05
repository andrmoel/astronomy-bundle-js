import {DEG, RAD} from '@app/constants/math';
import type {LdemGeometry} from '../types/LdemTypes';
import type {LunarLibration} from '../types/LunarLimbTypes';

const SILHOUETTE_PSI_MIN_DEG = 87;
const SILHOUETTE_PSI_MAX_DEG = 93;
const SILHOUETTE_PSI_STEP_DEG = 0.02;

export function getLimbHeightKm(
    grid: Int16Array,
    geometry: LdemGeometry,
    positionAngleDeg: number,
    libration: LunarLibration,
    axisPositionAngleDeg: number,
    observerDistanceKm: number,
): number {
    const paFromLunarNorth = positionAngleDeg - axisPositionAngleDeg;
    const observerDistanceM = observerDistanceKm * 1000;
    const referenceRadiusM = geometry.referenceRadiusM;

    let maxApparentM = -Infinity;
    for (let psi = SILHOUETTE_PSI_MIN_DEG; psi <= SILHOUETTE_PSI_MAX_DEG; psi += SILHOUETTE_PSI_STEP_DEG) {
        const {lat, lon} = limbPointSelenographic(paFromLunarNorth, psi, libration);
        const surfaceRadiusM = referenceRadiusM + heightMetersAt(grid, geometry, lat, lon);
        const apparentM = apparentRadiusM(surfaceRadiusM, psi * DEG, observerDistanceM);
        if (apparentM > maxApparentM) {
            maxApparentM = apparentM;
        }
    }

    return (maxApparentM - referenceApparentRadiusM(referenceRadiusM, observerDistanceM)) / 1000;
}

function heightMetersAt(grid: Int16Array, geometry: LdemGeometry, latDeg: number, lonDeg: number): number {
    const {degPerPixel, latFirst, lonFirst, scalingFactorM} = geometry;
    const lonEast = ((lonDeg % 360) + 360) % 360;
    const rowFloat = (latFirst - latDeg) / degPerPixel;
    const colFloat = (lonEast - lonFirst) / degPerPixel;
    const row0 = Math.floor(rowFloat);
    const col0 = Math.floor(colFloat);
    const rowFrac = rowFloat - row0;
    const colFrac = colFloat - col0;

    const v00 = sample(grid, geometry, row0, col0);
    const v01 = sample(grid, geometry, row0, col0 + 1);
    const v10 = sample(grid, geometry, row0 + 1, col0);
    const v11 = sample(grid, geometry, row0 + 1, col0 + 1);

    const top = v00 + (v01 - v00) * colFrac;
    const bottom = v10 + (v11 - v10) * colFrac;
    const dn = top + (bottom - top) * rowFrac;

    return dn * scalingFactorM;
}

function sample(grid: Int16Array, geometry: LdemGeometry, row: number, col: number): number {
    const {rows, cols} = geometry;
    const wrappedCol = ((col % cols) + cols) % cols;
    const clampedRow = Math.max(0, Math.min(rows - 1, row));

    return grid[clampedRow * cols + wrappedCol];
}

function apparentRadiusM(surfaceRadiusM: number, psiRad: number, observerDistanceM: number): number {
    return (
        (surfaceRadiusM * Math.sin(psiRad) * observerDistanceM)
        / (observerDistanceM - surfaceRadiusM * Math.cos(psiRad))
    );
}

function referenceApparentRadiusM(referenceRadiusM: number, observerDistanceM: number): number {
    const psiTangent = Math.acos(referenceRadiusM / observerDistanceM);

    return apparentRadiusM(referenceRadiusM, psiTangent, observerDistanceM);
}

function limbPointSelenographic(
    positionAngleFromLunarNorthDeg: number,
    angularDistanceDeg: number,
    libration: LunarLibration,
): {lat: number; lon: number} {
    const pa = positionAngleFromLunarNorthDeg * DEG;
    const psi = angularDistanceDeg * DEG;
    const libL = libration.longitude * DEG;
    const libB = libration.latitude * DEG;
    const sinL = Math.sin(libL);
    const cosL = Math.cos(libL);
    const sinB = Math.sin(libB);
    const cosB = Math.cos(libB);
    const sinPa = Math.sin(pa);
    const cosPa = Math.cos(pa);
    const sinPsi = Math.sin(psi);
    const cosPsi = Math.cos(psi);

    // Orthonormal frame at the sub-observer point: e (toward observer), north tangent, east tangent.
    // dir is the tangent direction at position angle pa; the surface point is cos(psi)·e + sin(psi)·dir.
    const dirX = cosPa * (-sinB * cosL) + sinPa * sinL;
    const dirY = cosPa * (-sinB * sinL) - sinPa * cosL;
    const dirZ = cosPa * cosB;

    const x = cosPsi * (cosB * cosL) + sinPsi * dirX;
    const y = cosPsi * (cosB * sinL) + sinPsi * dirY;
    const z = cosPsi * sinB + sinPsi * dirZ;

    return {
        lat: Math.asin(z) * RAD,
        lon: Math.atan2(y, x) * RAD,
    };
}
