import type {Canvas, SKRSContext2D} from '@napi-rs/canvas';
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import type {EclipsePaths, EclipseStyle} from '../types/SolarEclipsePathTypes';
import {renderMaxEclipseSunset} from '../utils/renderPaths';
import SolarEclipseMapLayer from './SolarEclipseMapLayer';

export default class MaxEclipseSunset extends SolarEclipseMapLayer {
    private constructor(date: string) {
        super(date);
    }

    public static create(date: string): MaxEclipseSunset {
        return new MaxEclipseSunset(date);
    }

    protected renderLayer(
        context: SKRSContext2D,
        canvas: Canvas,
        _elements: BesselianElements,
        paths: EclipsePaths,
        style?: EclipseStyle,
    ): void {
        renderMaxEclipseSunset(context, canvas, paths, style);
    }
}
