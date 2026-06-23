import Catalogue from '@package/solarEclipse/models/Catalogue';
import type {EclipseMapOverlay, EclipseStyle} from '../types/SolarEclipsePathTypes';

type LayerVisibility = Pick<
    EclipseMapOverlay,
    'isCentralLineVisible' | 'isUmbraVisible' | 'isPenumbraVisible' | 'isSunriseLineVisible' | 'isSunsetLineVisible'
>;

export default abstract class SolarEclipseMapLayer {
    protected constructor(
        private readonly date: string,
        private readonly visibility: LayerVisibility,
        private style?: EclipseStyle,
    ) {}

    public setStyle(style: EclipseStyle): this {
        this.style = style;

        return this;
    }

    public toOverlay(): EclipseMapOverlay {
        return {
            elements: Catalogue.getBesselianElements(this.date),
            style: this.style,
            ...this.visibility,
        };
    }
}
