import type {Canvas, SKRSContext2D} from '@napi-rs/canvas';
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import type {EclipsePaths, EclipseStyle} from '../types/SolarEclipsePathTypes';
import {fillPolygons, strokePolyline} from './polyline';
import {rasterizeShadowFill} from './shadowFill';
import {DEFAULT_STYLE} from './style';

const CENTRAL_LINE_WIDTH = 1.5;
const SHADOW_BORDER_WIDTH = 1.5;
const RISE_SET_BORDER_WIDTH = 1.5;

function resolveStyle(style?: EclipseStyle): Required<EclipseStyle> {
    return {...DEFAULT_STYLE, ...(style ?? {})};
}

export function renderPenumbraPath(
    context: SKRSContext2D,
    canvas: Canvas,
    elements: BesselianElements,
    paths: EclipsePaths,
    style?: EclipseStyle,
): void {
    const resolved = resolveStyle(style);
    rasterizeShadowFill(context, canvas, elements, false, 30 / 3600, resolved.fillColor);
    for (const path of paths.penumbralRegion) {
        strokePolyline(context, canvas, path, resolved.borderColor, SHADOW_BORDER_WIDTH, true);
    }
}

export function renderUmbraPath(
    context: SKRSContext2D,
    canvas: Canvas,
    elements: BesselianElements,
    paths: EclipsePaths,
    style?: EclipseStyle,
): void {
    const resolved = resolveStyle(style);
    rasterizeShadowFill(context, canvas, elements, true, 5 / 3600, resolved.fillColor);
    for (const path of paths.umbralRegion) {
        strokePolyline(context, canvas, path, resolved.borderColor, SHADOW_BORDER_WIDTH, true);
    }
}

export function renderCentralLine(
    context: SKRSContext2D,
    canvas: Canvas,
    paths: EclipsePaths,
    style?: EclipseStyle,
): void {
    const resolved = resolveStyle(style);
    strokePolyline(context, canvas, paths.centralLine, resolved.borderColor, CENTRAL_LINE_WIDTH, false);
}

export function renderSunriseBoundary(
    context: SKRSContext2D,
    canvas: Canvas,
    paths: EclipsePaths,
    style?: EclipseStyle,
): void {
    const resolved = resolveStyle(style);
    fillPolygons(context, canvas, [paths.sunriseBoundary], resolved.fillColor);
    strokePolyline(context, canvas, paths.sunriseBoundary, resolved.borderColor, RISE_SET_BORDER_WIDTH, true);
}

export function renderSunsetBoundary(
    context: SKRSContext2D,
    canvas: Canvas,
    paths: EclipsePaths,
    style?: EclipseStyle,
): void {
    const resolved = resolveStyle(style);
    fillPolygons(context, canvas, [paths.sunsetBoundary], resolved.fillColor);
    strokePolyline(context, canvas, paths.sunsetBoundary, resolved.borderColor, RISE_SET_BORDER_WIDTH, true);
}
