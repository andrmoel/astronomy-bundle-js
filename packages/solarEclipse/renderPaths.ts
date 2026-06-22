import type {Canvas, SKRSContext2D} from '@napi-rs/canvas';
import {fillPolygons, strokePolyline} from './render/polyline';
import {rasterizeShadowFill} from './render/shadowFill';
import {DEFAULT_STYLE} from './render/style';
import type {BesselianElements} from './types/BesselianElementTypes';
import type {EclipsePaths, EclipseStyle} from './types/SolarEclipsePathTypes';

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
        rasterizeShadowFill(context, canvas, elements, false, 30 / 3600, resolved.penumbralFillColor);
    }

    if (isUmbraVisible) {
        rasterizeShadowFill(context, canvas, elements, true, 5 / 3600, resolved.umbralFillColor);
    }

    if (isCentralLineVisible) {
        strokePolyline(context, canvas, paths.centralLine, resolved.centralLineColor, resolved.centralLineWidth, false);
    }

    if (isSunriseLineVisible) {
        fillPolygons(context, canvas, [paths.sunriseBoundary], resolved.sunriseBoundaryFillColor);
        strokePolyline(
            context,
            canvas,
            paths.sunriseBoundary,
            resolved.sunriseBoundaryColor,
            resolved.sunriseBoundaryWidth,
            true,
        );
    }

    if (isSunsetLineVisible) {
        fillPolygons(context, canvas, [paths.sunsetBoundary], resolved.sunsetBoundaryFillColor);
        strokePolyline(
            context,
            canvas,
            paths.sunsetBoundary,
            resolved.sunsetBoundaryColor,
            resolved.sunsetBoundaryWidth,
            true,
        );
    }
}
