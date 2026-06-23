import {writeFile} from 'node:fs/promises';
import {createCanvas, loadImage} from '@napi-rs/canvas';
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import {parseBesselianElements} from '@package/solarEclipse/utils/besselianElements';
import type {DrawEclipseMapOptions} from '../types/SolarEclipsePathTypes';
import calculateEclipsePaths from './eclipsePaths';
import renderPaths from './renderPaths';

function resolveBesselianElements(elements: Array<number> | BesselianElements): BesselianElements {
    return Array.isArray(elements) ? parseBesselianElements(elements) : elements;
}

export default async function drawEclipseMap(options: DrawEclipseMapOptions): Promise<void> {
    const basemap = await loadImage(options.basemap);
    const canvas = createCanvas(options.width ?? basemap.width, options.height ?? basemap.height);
    const context = canvas.getContext('2d');
    context.drawImage(basemap, 0, 0, canvas.width, canvas.height);

    for (const overlay of options.overlays) {
        const elements = resolveBesselianElements(overlay.elements);
        const paths = calculateEclipsePaths(elements);
        renderPaths(context, canvas, elements, paths, overlay.style, {
            isCentralLineVisible: overlay.isCentralLineVisible,
            isUmbraVisible: overlay.isUmbraVisible,
            isPenumbraVisible: overlay.isPenumbraVisible,
            isSunriseLineVisible: overlay.isSunriseLineVisible,
            isSunsetLineVisible: overlay.isSunsetLineVisible,
        });
    }

    const buffer = await canvas.encode('png');
    await writeFile(options.output, buffer);
}
