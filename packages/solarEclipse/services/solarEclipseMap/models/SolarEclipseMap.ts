import type {SolarEclipseMapSettings} from '../types/SolarEclipsePathTypes';
import drawEclipseMap from '../utils/getEclipseMap';
import BaseMap from './Map';
import type SolarEclipseMapLayer from './SolarEclipseMapLayer';

export default class SolarEclipseMap {
    private baseMap: BaseMap | null = null;
    private readonly layers: Array<SolarEclipseMapLayer> = [];

    private constructor(
        private readonly width: number,
        private readonly height: number,
        private readonly settings?: SolarEclipseMapSettings,
    ) {}

    public static create(width: number, height: number, settings?: SolarEclipseMapSettings): SolarEclipseMap {
        return new SolarEclipseMap(width, height, settings);
    }

    public addLayer(layer: BaseMap | SolarEclipseMapLayer): this {
        if (layer instanceof BaseMap) {
            this.baseMap = layer;
        } else {
            this.layers.push(layer);
        }

        return this;
    }

    public print(output: string): Promise<void> {
        if (this.baseMap === null) {
            throw new Error('Solar eclipse map base map is not set.');
        }

        return drawEclipseMap({
            basemap: this.baseMap.getPath(),
            output,
            width: this.width,
            height: this.height,
            layers: this.layers,
            settings: this.settings,
        });
    }
}
