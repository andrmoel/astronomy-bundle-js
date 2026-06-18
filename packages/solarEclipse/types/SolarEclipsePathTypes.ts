import type {LatLon} from '@app/types/LocationTypes';
import type {BesselianElements} from './BesselianElementTypes';

export type RiseSetBoundary = Array<LatLon>;

export interface EclipsePaths {
    centralLine: Array<LatLon>;
    umbralRegion: Array<Array<LatLon>>;
    penumbralRegion: Array<Array<LatLon>>;
    sunsetBoundary: RiseSetBoundary;
    sunriseBoundary: RiseSetBoundary;
}

export interface EclipseStyle {
    centralLineColor?: string;
    umbralLimitColor?: string;
    penumbralLimitColor?: string;
    umbralFillColor?: string;
    penumbralFillColor?: string;
    centralLineWidth?: number;
    umbralLimitWidth?: number;
    penumbralLimitWidth?: number;
    sunsetBoundaryColor?: string;
    sunsetBoundaryFillColor?: string;
    sunsetBoundaryWidth?: number;
    sunriseBoundaryColor?: string;
    sunriseBoundaryFillColor?: string;
    sunriseBoundaryWidth?: number;
}

export interface EclipseMapOverlay {
    elements: Array<number> | BesselianElements;
    style?: EclipseStyle;
    isCentralLineVisible?: boolean;
    isUmbraVisible?: boolean;
    isPenumbraVisible?: boolean;
    isSunriseLineVisible?: boolean;
    isSunsetLineVisible?: boolean;
}

export interface DrawEclipseMapOptions {
    basemap: string;
    output: string;
    overlays: Array<EclipseMapOverlay>;
}
