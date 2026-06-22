import type {LatLon} from '@app/types/LocationTypes';
import type {Canvas, SKRSContext2D} from '@napi-rs/canvas';

export function projectLonLatToPixel(point: LatLon, canvas: Canvas): {x: number; y: number} {
    return {
        x: ((point.lon + 180) / 360) * canvas.width,
        y: ((90 - point.lat) / 180) * canvas.height,
    };
}

function traceSubpath(context: SKRSContext2D, canvas: Canvas, points: Array<LatLon>, closed: boolean): void {
    let previousX: number | null = null;
    for (const [i, point] of points.entries()) {
        const {x, y} = projectLonLatToPixel(point, canvas);
        if (i === 0) {
            context.moveTo(x, y);
        } else if (previousX !== null && Math.abs(x - previousX) > canvas.width / 2) {
            context.moveTo(x, y);
        } else {
            context.lineTo(x, y);
        }
        previousX = x;
    }
    if (closed && points.length >= 3) {
        const first = projectLonLatToPixel(points[0], canvas);
        const last = projectLonLatToPixel(points[points.length - 1], canvas);
        if (Math.abs(first.x - last.x) < canvas.width / 2) {
            context.lineTo(first.x, first.y);
        }
    }
}

export function strokePolyline(
    context: SKRSContext2D,
    canvas: Canvas,
    points: Array<LatLon>,
    color: string,
    lineWidth: number,
    closed: boolean,
): void {
    if (points.length < 2) {
        return;
    }

    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.lineCap = 'round';
    context.lineJoin = 'round';

    context.beginPath();
    traceSubpath(context, canvas, points, closed);
    context.stroke();
}

function unwrapPoints(points: Array<LatLon>): Array<LatLon> {
    if (points.length === 0) {
        return points;
    }
    const result: Array<LatLon> = [points[0]];
    for (let i = 1; i < points.length; i++) {
        let lon = points[i].lon;
        const prevLon = result[i - 1].lon;
        while (lon - prevLon > 180) {
            lon -= 360;
        }
        while (lon - prevLon < -180) {
            lon += 360;
        }
        result.push({lat: points[i].lat, lon});
    }

    return result;
}

function traceFillSubpath(context: SKRSContext2D, canvas: Canvas, points: Array<LatLon>): void {
    const unwrapped = unwrapPoints(points);
    const coords: Array<{x: number; y: number}> = [];
    let xMin = Infinity;
    let xMax = -Infinity;
    for (const point of unwrapped) {
        const {x, y} = projectLonLatToPixel(point, canvas);
        coords.push({x, y});
        if (x < xMin) {
            xMin = x;
        }
        if (x > xMax) {
            xMax = x;
        }
    }

    const drawShifted = (shift: number): void => {
        for (const [i, {x, y}] of coords.entries()) {
            if (i === 0) {
                context.moveTo(x + shift, y);
            } else {
                context.lineTo(x + shift, y);
            }
        }
        context.closePath();
    };

    drawShifted(0);
    // When the polygon extends past the left edge, draw a copy shifted right
    // so the portion that wraps around the antimeridian fills correctly on the right side.
    if (xMin < 0) {
        drawShifted(canvas.width);
    }
    // When the polygon extends past the right edge, draw a copy shifted left.
    if (xMax > canvas.width) {
        drawShifted(-canvas.width);
    }
}

export function fillPolygons(
    context: SKRSContext2D,
    canvas: Canvas,
    contours: Array<Array<LatLon>>,
    color: string,
): void {
    const usable = contours.filter((contour) => contour.length >= 3);
    if (usable.length === 0) {
        return;
    }

    context.fillStyle = color;
    context.beginPath();
    for (const contour of usable) {
        traceFillSubpath(context, canvas, contour);
    }
    context.fill('nonzero');
}
