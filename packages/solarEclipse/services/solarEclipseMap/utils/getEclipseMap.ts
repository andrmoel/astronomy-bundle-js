import {writeFile} from 'node:fs/promises';
import {createCanvas, loadImage} from '@napi-rs/canvas';
import type SolarEclipseMapLayer from '../models/SolarEclipseMapLayer';
import type {SolarEclipseMapSettings} from '../types/SolarEclipsePathTypes';
import calculateEclipsePaths from './eclipsePaths';
import {encodePngParallel} from './workerPool';

interface DrawEclipseMapOptions {
    basemap: string;
    output: string;
    width?: number;
    height?: number;
    layers: Array<SolarEclipseMapLayer>;
    settings?: SolarEclipseMapSettings;
}

export default async function drawEclipseMap(options: DrawEclipseMapOptions): Promise<void> {
    // The basemap decodes while the path math runs; it is only awaited up front when the
    // canvas size has to be taken from it.
    const basemapPromise = loadImage(options.basemap);
    let {width, height} = options;
    if (width === undefined || height === undefined) {
        const basemap = await basemapPromise;
        width ??= basemap.width;
        height ??= basemap.height;
    }

    // All path math happens before the render pass: each layer prepares the paths it will
    // draw, with the penumbra masks fanned out to the worker pool (their prepare() returns
    // a promise) while the polygon layers compute on the main thread in between.
    const prepared = options.layers.map((layer) => {
        const elements = layer.getElements();

        return {layer, elements, paths: calculateEclipsePaths(elements, options.settings)};
    });
    const ready = prepared.map(({layer, paths}) => layer.prepare(paths, width, height));

    // The base draw overlaps the pool as well; only the layer compositing has to wait.
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');
    context.drawImage(await basemapPromise, 0, 0, canvas.width, canvas.height);

    // Layers draw in their original order, but each one as soon as it and all layers
    // before it are prepared — the earlier eclipses composite while the later ones still
    // occupy the pool.
    for (let i = 0; i < prepared.length; i++) {
        await ready[i];
        const {layer, elements, paths} = prepared[i];
        layer.render(context, canvas, elements, paths);
    }

    // The PNG stores the canvas pixels losslessly (see pngEncode): the decoded image is
    // pixel-identical to canvas.encode('png'), compressed on the worker pool instead.
    const buffer = await encodePngParallel(context.getImageData(0, 0, width, height).data, width, height);
    await writeFile(options.output, buffer);
}
