import type {Canvas, SKRSContext2D} from '@napi-rs/canvas';
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import type {EclipsePaths, EclipseStyle} from '../types/SolarEclipsePathTypes';
import {fillPolygons, strokePolyline} from './polyline';
import {rasterizeShadowBorder, rasterizeShadowFill} from './shadowFill';
import {DEFAULT_STYLE} from './style';

function resolveStyle(style?: EclipseStyle): Required<EclipseStyle> {
    return {...DEFAULT_STYLE, ...(style ?? {})};
}

export function renderPenumbraPath(
    context: SKRSContext2D,
    canvas: Canvas,
    elements: BesselianElements,
    _paths: EclipsePaths,
    style?: EclipseStyle,
): void {
    const resolved = resolveStyle(style);
    const binary = rasterizeShadowFill(context, canvas, elements, false, 30 / 3600, resolved.fillColor);
    rasterizeShadowBorder(context, canvas, binary, resolved.borderColor, resolved.borderWeight);
}

export function renderUmbraPath(
    context: SKRSContext2D,
    canvas: Canvas,
    elements: BesselianElements,
    _paths: EclipsePaths,
    style?: EclipseStyle,
): void {
    const resolved = resolveStyle(style);
    const binary = rasterizeShadowFill(context, canvas, elements, true, 5 / 3600, resolved.fillColor);
    rasterizeShadowBorder(context, canvas, binary, resolved.borderColor, resolved.borderWeight);
}

export function renderCentralLine(
    context: SKRSContext2D,
    canvas: Canvas,
    paths: EclipsePaths,
    style?: EclipseStyle,
): void {
    const resolved = resolveStyle(style);
    strokePolyline(context, canvas, paths.centralLine, resolved.borderColor, resolved.borderWeight, false);
}

export function renderSunriseBoundary(
    context: SKRSContext2D,
    canvas: Canvas,
    paths: EclipsePaths,
    style?: EclipseStyle,
): void {
    const resolved = resolveStyle(style);
    fillPolygons(context, canvas, [paths.sunriseBoundary], resolved.fillColor);
    strokePolyline(context, canvas, paths.sunriseBoundary, resolved.borderColor, resolved.borderWeight, true);
}

export function renderSunsetBoundary(
    context: SKRSContext2D,
    canvas: Canvas,
    paths: EclipsePaths,
    style?: EclipseStyle,
): void {
    const resolved = resolveStyle(style);
    fillPolygons(context, canvas, [paths.sunsetBoundary], resolved.fillColor);
    strokePolyline(context, canvas, paths.sunsetBoundary, resolved.borderColor, resolved.borderWeight, true);
}
