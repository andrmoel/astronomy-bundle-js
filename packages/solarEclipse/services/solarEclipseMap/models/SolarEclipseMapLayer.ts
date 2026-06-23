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

    public getElements(): BesselianElements {
        return Catalogue.getBesselianElements(this.date);
    }

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
