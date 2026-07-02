import type {Canvas, SKRSContext2D} from '@napi-rs/canvas';
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import type {EclipsePaths, EclipseStyle} from '../types/SolarEclipsePathTypes';
import {fillPolygons, strokePolyline} from './polyline';
import {DEFAULT_STYLE} from './style';

function resolveStyle(style?: EclipseStyle): Required<EclipseStyle> {
    return {...DEFAULT_STYLE, ...(style ?? {})};
}

// The umbral and penumbral regions are unions of many overlapping instantaneous outlines,
// so they have no strokeable boundary — the layers are fill-only.
export function renderPenumbraPath(
    context: SKRSContext2D,
    canvas: Canvas,
    _elements: BesselianElements,
    paths: EclipsePaths,
    style?: EclipseStyle,
): void {
    fillPolygons(context, canvas, paths.penumbralRegion, resolveStyle(style).fillColor);
}

export function renderUmbraPath(
    context: SKRSContext2D,
    canvas: Canvas,
    _elements: BesselianElements,
    paths: EclipsePaths,
    style?: EclipseStyle,
): void {
    fillPolygons(context, canvas, paths.umbralRegion, resolveStyle(style).fillColor);
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
