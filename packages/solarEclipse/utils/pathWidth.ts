import {EARTH_EQUATORIAL_DIAMETER_METERS} from '@app/constants/earth';
import {solveSurfacePoint} from '@package/solarEclipse/services/shadowGeometry/utils/surface';
import type {BesselianElements} from '../types/BesselianElementTypes';
import {getBesselianElementsAtTime} from './besselianElements';

export function getUmbraPathWidth(elements: BesselianElements, tau: number): number {
    const e = getBesselianElementsAtTime(elements, tau);
    const surface = solveSurfacePoint(elements, e, e.x, e.y, false);
    if (surface === null || surface.zeta <= 0) {
        return 0;
    }

    const umbralRadius = e.l2 - surface.zeta * elements.tanF2;

    return (EARTH_EQUATORIAL_DIAMETER_METERS * Math.abs(umbralRadius)) / surface.zeta;
}
