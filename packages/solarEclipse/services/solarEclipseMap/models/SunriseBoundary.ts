import type {Canvas, SKRSContext2D} from '@napi-rs/canvas';
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import type {EclipsePaths, EclipseStyle} from '../types/SolarEclipsePathTypes';
import {renderSunriseBoundary} from '../utils/renderPaths';
import SolarEclipseMapLayer from './SolarEclipseMapLayer';

export default class SunriseBoundary extends SolarEclipseMapLayer {
    private constructor(date: string) {
        super(date);
    }

    public static create(date: string): SunriseBoundary {
        return new SunriseBoundary(date);
    }

    protected renderLayer(
        context: SKRSContext2D,
        canvas: Canvas,
        _elements: BesselianElements,
        paths: EclipsePaths,
        style?: EclipseStyle,
    ): void {
        renderSunriseBoundary(context, canvas, paths, style);
    }
}
