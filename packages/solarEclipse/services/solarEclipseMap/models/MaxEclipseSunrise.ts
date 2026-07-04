import type {Canvas, SKRSContext2D} from '@napi-rs/canvas';
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import type {EclipsePaths, EclipseStyle} from '../types/SolarEclipsePathTypes';
import {renderMaxEclipseSunrise} from '../utils/renderPaths';
import SolarEclipseMapLayer from './SolarEclipseMapLayer';

export default class MaxEclipseSunrise extends SolarEclipseMapLayer {
    private constructor(date: string) {
        super(date);
    }

    public static create(date: string): MaxEclipseSunrise {
        return new MaxEclipseSunrise(date);
    }

    public prepare(paths: EclipsePaths): Promise<void> {
        return paths.prefetchGeometry('maxEclipseSunrise');
    }

    protected renderLayer(
        context: SKRSContext2D,
        canvas: Canvas,
        _elements: BesselianElements,
        paths: EclipsePaths,
        style?: EclipseStyle,
    ): void {
        renderMaxEclipseSunrise(context, canvas, paths, style);
    }
}
