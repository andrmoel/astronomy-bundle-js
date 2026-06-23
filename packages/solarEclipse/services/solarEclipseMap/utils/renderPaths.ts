import type {Canvas, SKRSContext2D} from '@napi-rs/canvas';
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import type {EclipsePaths, EclipseStyle} from '../types/SolarEclipsePathTypes';
import {fillPolygons, strokePolyline} from './polyline';
import {rasterizeShadowFill} from './shadowFill';
import {DEFAULT_STYLE} from './style';

const CENTRAL_LINE_WIDTH = 1.5;
const SHADOW_BORDER_WIDTH = 1.5;
const RISE_SET_BORDER_WIDTH = 1.5;

export interface RenderPathsVisibility {
    isCentralLineVisible?: boolean;
    isUmbraVisible?: boolean;
    isPenumbraVisible?: boolean;
    isSunriseLineVisible?: boolean;
    isSunsetLineVisible?: boolean;
}

export default function renderPaths(
    context: SKRSContext2D,
    canvas: Canvas,
    elements: BesselianElements,
    paths: EclipsePaths,
    style?: EclipseStyle,
    visibility?: RenderPathsVisibility,
): void {
    const resolved: Required<EclipseStyle> = {...DEFAULT_STYLE, ...(style ?? {})};
    const isPenumbraVisible = !!visibility?.isPenumbraVisible;
    const isUmbraVisible = !!visibility?.isUmbraVisible;
    const isCentralLineVisible = !!visibility?.isCentralLineVisible;
    const isSunriseLineVisible = !!visibility?.isSunriseLineVisible;
    const isSunsetLineVisible = !!visibility?.isSunsetLineVisible;

    if (isPenumbraVisible) {
        rasterizeShadowFill(context, canvas, elements, false, 30 / 3600, resolved.fillColor);
        for (const path of paths.penumbralRegion) {
            strokePolyline(context, canvas, path, resolved.borderColor, SHADOW_BORDER_WIDTH, true);
        }
    }

    if (isUmbraVisible) {
        rasterizeShadowFill(context, canvas, elements, true, 5 / 3600, resolved.fillColor);
        for (const path of paths.umbralRegion) {
            strokePolyline(context, canvas, path, resolved.borderColor, SHADOW_BORDER_WIDTH, true);
        }
    }

    if (isCentralLineVisible) {
        strokePolyline(context, canvas, paths.centralLine, resolved.borderColor, CENTRAL_LINE_WIDTH, false);
    }

    if (isSunriseLineVisible) {
        fillPolygons(context, canvas, [paths.sunriseBoundary], resolved.fillColor);
        strokePolyline(context, canvas, paths.sunriseBoundary, resolved.borderColor, RISE_SET_BORDER_WIDTH, true);
    }

    if (isSunsetLineVisible) {
        fillPolygons(context, canvas, [paths.sunsetBoundary], resolved.fillColor);
        strokePolyline(context, canvas, paths.sunsetBoundary, resolved.borderColor, RISE_SET_BORDER_WIDTH, true);
    }
}
