import {writeFile} from 'node:fs/promises';
import {createCanvas, loadImage} from '@napi-rs/canvas';
import type SolarEclipseMapLayer from '../models/SolarEclipseMapLayer';
import calculateEclipsePaths from './eclipsePaths';

interface DrawEclipseMapOptions {
    basemap: string;
    output: string;
    width?: number;
    height?: number;
    layers: Array<SolarEclipseMapLayer>;
}

export default async function drawEclipseMap(options: DrawEclipseMapOptions): Promise<void> {
    const basemap = await loadImage(options.basemap);
    const canvas = createCanvas(options.width ?? basemap.width, options.height ?? basemap.height);
    const context = canvas.getContext('2d');
    context.drawImage(basemap, 0, 0, canvas.width, canvas.height);

    for (const layer of options.layers) {
        const elements = layer.getElements();
        const paths = calculateEclipsePaths(elements);
        layer.render(context, canvas, elements, paths);
    }

    const buffer = await canvas.encode('png');
    await writeFile(options.output, buffer);
}
