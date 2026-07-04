import type {Canvas, SKRSContext2D} from '@napi-rs/canvas';
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import type {EclipsePaths, EclipseStyle} from '../types/SolarEclipsePathTypes';
import {buildPenumbraFill, renderPenumbraPath} from '../utils/renderPaths';
import SolarEclipseMapLayer from './SolarEclipseMapLayer';

export default class PenumbraPath extends SolarEclipseMapLayer {
    private preparedFill: Canvas | null = null;

    private constructor(date: string) {
        super(date);
    }

    public static create(date: string): PenumbraPath {
        return new PenumbraPath(date);
    }

    // The mask is computed on the worker pool, and its offscreen composite is built as soon
    // as the mask arrives — while the pool still works on the other layers' masks — so the
    // render pass only blits it.
    public async prepare(paths: EclipsePaths, width: number, height: number): Promise<void> {
        await paths.prefetchPenumbraVisibilityAlpha(width, height);
        this.preparedFill = buildPenumbraFill(width, height, paths, this.getStyle());
    }

    protected renderLayer(
        context: SKRSContext2D,
        canvas: Canvas,
        elements: BesselianElements,
        paths: EclipsePaths,
        style?: EclipseStyle,
    ): void {
        renderPenumbraPath(context, canvas, elements, paths, style, this.preparedFill ?? undefined);
    }
}
