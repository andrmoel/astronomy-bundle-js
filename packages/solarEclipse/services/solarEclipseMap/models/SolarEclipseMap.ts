import drawEclipseMap from '../utils/getEclipseMap';
import BaseMap from './Map';
import type SolarEclipseMapLayer from './SolarEclipseMapLayer';

export default class SolarEclipseMap {
    private baseMap: BaseMap | null = null;
    private readonly layers: Array<SolarEclipseMapLayer> = [];

    private constructor(
        private readonly width: number,
        private readonly height: number,
    ) {}

    public static create(width: number, height: number): SolarEclipseMap {
        return new SolarEclipseMap(width, height);
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
            overlays: this.layers.map((layer) => layer.toOverlay()),
        });
    }
}
