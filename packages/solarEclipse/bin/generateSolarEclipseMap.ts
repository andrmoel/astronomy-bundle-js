import SunriseBoundary from '@package/solarEclipse/services/solarEclipseMap/models/SunriseBoundary';
import SunsetBoundary from '@package/solarEclipse/services/solarEclipseMap/models/SunsetBoundary';
import BaseMap from '../services/solarEclipseMap/models/Map';
import PenumbraPath from '../services/solarEclipseMap/models/PenumbraPath';
import SolarEclipseMap from '../services/solarEclipseMap/models/SolarEclipseMap';
import UmbraPath from '../services/solarEclipseMap/models/UmbraPath';
import type {EclipseStyle} from '../services/solarEclipseMap/types/SolarEclipsePathTypes';

const DEFAULT_DATE_1 = '2026-08-12';
const DEFAULT_DATE_2 = '1988-03-18';
const DEFAULT_DATE_3 = '2019-07-02';
const DEFAULT_DATE_4 = '2018-08-11';

const DEFAULT_OUTPUT = 'packages/solarEclipse/eclipse-map.png';
const DEFAULT_BASEMAP = 'packages/solarEclipse/services/solarEclipseMap/resources/worldmap_topo.png';
const DEFAULT_WIDTH = 3600;
const DEFAULT_HEIGHT = 1800;
const PENUMBRA_STYLE: EclipseStyle = {
    fillColor: 'rgba(0, 0, 0, 0.2)',
};
const UMBRA_STYLE: EclipseStyle = {
    fillColor: 'rgba(0, 0, 0, 0.4)',
};
// Curve of maximum (greatest) eclipse at sunrise/sunset — the green line bisecting each
// rise/set loop.
const MAX_ECLIPSE_STYLE: EclipseStyle = {
    borderColor: 'rgba(0, 176, 0, 0.9)',
    borderWeight: 0,
};

function printUsage(): void {
    console.log(
        [
            'Usage: npm run generate:map -- [date] [output] [basemap]',
            '',
            `date:    Eclipse date in YYYY-MM-DD format. Default: ${DEFAULT_DATE_1}`,
            `output:  Destination PNG path. Default: ${DEFAULT_OUTPUT}`,
            `basemap: Source basemap PNG path. Default: ${DEFAULT_BASEMAP}`,
        ].join('\n'),
    );
}

async function main(): Promise<void> {
    const [date = DEFAULT_DATE_1, output = DEFAULT_OUTPUT, basemap = DEFAULT_BASEMAP] = process.argv.slice(2);

    if (date === '--help' || date === '-h') {
        printUsage();
        return;
    }

    const start = Date.now();

    await SolarEclipseMap.create(DEFAULT_WIDTH, DEFAULT_HEIGHT, {refraction: true})
        .addLayer(BaseMap.create(basemap))

        .addLayer(PenumbraPath.create(date).setStyle(PENUMBRA_STYLE))
        .addLayer(UmbraPath.create(date).setStyle(UMBRA_STYLE))
        .addLayer(SunriseBoundary.create(date).setStyle(MAX_ECLIPSE_STYLE))
        .addLayer(SunsetBoundary.create(date).setStyle(MAX_ECLIPSE_STYLE))

        .addLayer(PenumbraPath.create(DEFAULT_DATE_2).setStyle(PENUMBRA_STYLE))
        .addLayer(UmbraPath.create(DEFAULT_DATE_2).setStyle(UMBRA_STYLE))
        .addLayer(SunriseBoundary.create(DEFAULT_DATE_2).setStyle(MAX_ECLIPSE_STYLE))
        .addLayer(SunsetBoundary.create(DEFAULT_DATE_2).setStyle(MAX_ECLIPSE_STYLE))

        .addLayer(PenumbraPath.create(DEFAULT_DATE_3).setStyle(PENUMBRA_STYLE))
        .addLayer(UmbraPath.create(DEFAULT_DATE_3).setStyle(UMBRA_STYLE))
        .addLayer(SunriseBoundary.create(DEFAULT_DATE_3).setStyle(MAX_ECLIPSE_STYLE))
        .addLayer(SunsetBoundary.create(DEFAULT_DATE_3).setStyle(MAX_ECLIPSE_STYLE))

        .addLayer(PenumbraPath.create(DEFAULT_DATE_4).setStyle(PENUMBRA_STYLE))
        .addLayer(UmbraPath.create(DEFAULT_DATE_4).setStyle(UMBRA_STYLE))
        .addLayer(SunriseBoundary.create(DEFAULT_DATE_4).setStyle(MAX_ECLIPSE_STYLE))
        .addLayer(SunsetBoundary.create(DEFAULT_DATE_4).setStyle(MAX_ECLIPSE_STYLE))

        .print(output);

    console.log(`Generated ${output} in ${((Date.now() - start) / 1000).toFixed(2)}s`);
}

main().catch((err: unknown) => {
    console.error(err);
    process.exitCode = 1;
});
