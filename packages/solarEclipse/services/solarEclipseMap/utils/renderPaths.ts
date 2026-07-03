import {type Canvas, createCanvas, type SKRSContext2D} from '@napi-rs/canvas';
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import type {EclipsePaths, EclipseStyle} from '../types/SolarEclipsePathTypes';
import {fillPolygons, strokePolyline} from './polyline';
import {DEFAULT_STYLE} from './style';

function resolveStyle(style?: EclipseStyle): Required<EclipseStyle> {
    return {...DEFAULT_STYLE, ...(style ?? {})};
}

// The penumbral shading: a location is shaded iff its own maximum eclipse happens with the
// Sun above the horizon of the map's settings (see penumbraVisibility). The
// per-pixel mask is drawn through offscreen canvases: a uniform fill in the style's colour
// is clipped to the mask's alpha with destination-in. (source-in would be the direct route,
// but @napi-rs/canvas applies the fill style's alpha twice under it.)
export function renderPenumbraPath(
    context: SKRSContext2D,
    canvas: Canvas,
    _elements: BesselianElements,
    paths: EclipsePaths,
    style?: EclipseStyle,
): void {
    const fillColor = resolveStyle(style).fillColor;
    const alpha = paths.penumbraVisibilityAlpha(canvas.width, canvas.height);
    const mask = createCanvas(canvas.width, canvas.height);
    const maskContext = mask.getContext('2d');
    const image = maskContext.createImageData(canvas.width, canvas.height);
    for (let i = 0; i < alpha.length; i++) {
        image.data[i * 4 + 3] = alpha[i];
    }
    maskContext.putImageData(image, 0, 0);

    const fill = createCanvas(canvas.width, canvas.height);
    const fillContext = fill.getContext('2d');
    fillContext.fillStyle = fillColor;
    fillContext.fillRect(0, 0, canvas.width, canvas.height);
    fillContext.globalCompositeOperation = 'destination-in';
    fillContext.drawImage(mask, 0, 0);
    context.drawImage(fill, 0, 0);
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

// The maximum-eclipse-at-rise/set curves are open polylines bisecting each rise/set loop.
export function renderMaxEclipseSunrise(
    context: SKRSContext2D,
    canvas: Canvas,
    paths: EclipsePaths,
    style?: EclipseStyle,
): void {
    const resolved = resolveStyle(style);
    strokePolyline(context, canvas, paths.maxEclipseSunrise, resolved.borderColor, resolved.borderWeight, false);
}

export function renderMaxEclipseSunset(
    context: SKRSContext2D,
    canvas: Canvas,
    paths: EclipsePaths,
    style?: EclipseStyle,
): void {
    const resolved = resolveStyle(style);
    strokePolyline(context, canvas, paths.maxEclipseSunset, resolved.borderColor, resolved.borderWeight, false);
}
