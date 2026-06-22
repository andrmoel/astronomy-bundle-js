import type {EclipseStyle} from '../types/SolarEclipsePathTypes';

export const DEFAULT_STYLE: Required<EclipseStyle> = {
    centralLineColor: 'rgba(0, 0, 0, 1)',
    umbralLimitColor: 'rgba(0, 0, 0, 0.5)',
    penumbralLimitColor: 'rgba(0, 0, 0, 0.6)',
    umbralFillColor: 'rgba(0, 0, 0, 0.3)',
    penumbralFillColor: 'rgba(0, 0, 0, 0.1)',
    centralLineWidth: 1.5,
    umbralLimitWidth: 1,
    penumbralLimitWidth: 1.5,
    sunsetBoundaryColor: 'rgba(255, 200, 0, 0.85)',
    sunsetBoundaryFillColor: 'rgba(255, 200, 0, 0.3)',
    sunsetBoundaryWidth: 1.5,
    sunriseBoundaryColor: 'rgba(255, 140, 0, 0.85)',
    sunriseBoundaryFillColor: 'rgba(255, 140, 0, 0.3)',
    sunriseBoundaryWidth: 1.5,
};
