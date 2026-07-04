import type {LatLon} from '@app/types/LocationTypes';
import type {EclipseGeometry} from '../utils/workerPool';

export type RiseSetBoundary = Array<LatLon>;

export interface SolarEclipseMapSettings {
    // With refraction on, the Sun counts as risen while its refracted upper limb is on or
    // above the horizon (centre altitude >= -50'); off, while its centre is on or above the
    // geometric horizon (zeta >= 0, the Espenak/Jubier convention). The switch moves every
    // horizon-dependent curve: rise/set loops, max-eclipse-at-rise/set curves, the penumbral
    // shading border, the umbra region clip and the central-line hooks.
    refraction?: boolean;
}

export interface EclipsePaths {
    centralLine: Array<LatLon>;
    umbralRegion: Array<Array<LatLon>>;
    sunsetBoundary: RiseSetBoundary;
    sunriseBoundary: RiseSetBoundary;
    maxEclipseSunset: Array<LatLon>;
    maxEclipseSunrise: Array<LatLon>;
    penumbraVisibilityAlpha(width: number, height: number): Uint8ClampedArray;
    prefetchPenumbraVisibilityAlpha(width: number, height: number): Promise<void>;
    prefetchGeometry(geometry: EclipseGeometry): Promise<void>;
}

export interface EclipseStyle {
    fillColor?: string;
    borderColor?: string;
    borderWeight?: number;
}
