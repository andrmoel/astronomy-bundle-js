import type {Canvas, SKRSContext2D} from '@napi-rs/canvas';
import Catalogue from '@package/solarEclipse/models/Catalogue';
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import type {EclipsePaths, EclipseStyle} from '../types/SolarEclipsePathTypes';

export default abstract class SolarEclipseMapLayer {
    protected constructor(
        private readonly date: string,
        private style?: EclipseStyle,
    ) {}

    public setStyle(style: EclipseStyle): this {
        this.style = style;

        return this;
    }

    protected getStyle(): EclipseStyle | undefined {
        return this.style;
    }

    public getElements(): BesselianElements {
        return Catalogue.getBesselianElements(this.date);
    }

    // Computes the paths this layer will draw, ahead of the synchronous render pass.
    // Layers whose paths are worker-pool-backed return a promise; the others warm their
    // memos on the main thread while the pool works (see drawEclipseMap).
    public abstract prepare(paths: EclipsePaths, width: number, height: number): Promise<void> | void;

    public render(context: SKRSContext2D, canvas: Canvas, elements: BesselianElements, paths: EclipsePaths): void {
        this.renderLayer(context, canvas, elements, paths, this.style);
    }

    protected abstract renderLayer(
        context: SKRSContext2D,
        canvas: Canvas,
        elements: BesselianElements,
        paths: EclipsePaths,
        style?: EclipseStyle,
    ): void;
}
