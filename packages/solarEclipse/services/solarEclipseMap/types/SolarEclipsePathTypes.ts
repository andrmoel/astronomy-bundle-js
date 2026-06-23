import type {LatLon} from '@app/types/LocationTypes';
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';

export type RiseSetBoundary = Array<LatLon>;

export interface EclipsePaths {
    centralLine: Array<LatLon>;
    umbralRegion: Array<Array<LatLon>>;
    penumbralRegion: Array<Array<LatLon>>;
    sunsetBoundary: RiseSetBoundary;
    sunriseBoundary: RiseSetBoundary;
}

export interface EclipseStyle {
    fillColor?: string;
    borderColor?: string;
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
    width?: number;
    height?: number;
    overlays: Array<EclipseMapOverlay>;
}
