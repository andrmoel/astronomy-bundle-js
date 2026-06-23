import type {Canvas, SKRSContext2D} from '@napi-rs/canvas';
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import type {EclipsePaths, EclipseStyle} from '../types/SolarEclipsePathTypes';
import {renderPenumbraPath} from '../utils/renderPaths';
import SolarEclipseMapLayer from './SolarEclipseMapLayer';

export default class PenumbraPath extends SolarEclipseMapLayer {
    private constructor(date: string) {
        super(date);
    }

    public static create(date: string): PenumbraPath {
        return new PenumbraPath(date);
    }

    protected renderLayer(
        context: SKRSContext2D,
        canvas: Canvas,
        elements: BesselianElements,
        paths: EclipsePaths,
        style?: EclipseStyle,
    ): void {
        renderPenumbraPath(context, canvas, elements, paths, style);
    }
}
