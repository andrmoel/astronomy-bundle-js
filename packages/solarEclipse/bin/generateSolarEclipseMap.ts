import BaseMap from '../services/solarEclipseMap/models/Map';
import PenumbraPath from '../services/solarEclipseMap/models/PenumbraPath';
import SolarEclipseMap from '../services/solarEclipseMap/models/SolarEclipseMap';
import UmbraPath from '../services/solarEclipseMap/models/UmbraPath';
import type {EclipseStyle} from '../services/solarEclipseMap/types/SolarEclipsePathTypes';

const DEFAULT_DATE = '2026-08-12';
const DEFAULT_DATE_2 = '2017-08-21';
const DEFAULT_OUTPUT = 'packages/solarEclipse/eclipse-map.png';
const DEFAULT_BASEMAP = 'packages/solarEclipse/services/solarEclipseMap/resources/worldmap_topo.png';
const DEFAULT_WIDTH = 3600;
const DEFAULT_HEIGHT = 1800;
const PENUMBRA_STYLE: EclipseStyle = {
    fillColor: 'rgba(0, 0, 0, 0.3)',
    borderColor: 'rgba(0, 0, 0, 0.3)',
};
const UMBRA_STYLE: EclipseStyle = {
    fillColor: 'rgba(0, 0, 0, 0.4)',
    borderColor: 'rgba(0, 0, 0, 0.4)',
};

function printUsage(): void {
    console.log(
        [
            'Usage: npm run generate:map -- [date] [output] [basemap]',
            '',
            `date:    Eclipse date in YYYY-MM-DD format. Default: ${DEFAULT_DATE}`,
            `output:  Destination PNG path. Default: ${DEFAULT_OUTPUT}`,
            `basemap: Source basemap PNG path. Default: ${DEFAULT_BASEMAP}`,
        ].join('\n'),
    );
}

async function main(): Promise<void> {
    const [date = DEFAULT_DATE, output = DEFAULT_OUTPUT, basemap = DEFAULT_BASEMAP] = process.argv.slice(2);

    if (date === '--help' || date === '-h') {
        printUsage();
        return;
    }

    await SolarEclipseMap.create(DEFAULT_WIDTH, DEFAULT_HEIGHT)
        .addLayer(BaseMap.create(basemap))
        .addLayer(PenumbraPath.create(date).setStyle(PENUMBRA_STYLE))
        .addLayer(UmbraPath.create(date).setStyle(UMBRA_STYLE))
        .addLayer(UmbraPath.create(DEFAULT_DATE_2))
        .print(output);

    console.log(`Generated solar eclipse map for ${date}: ${output}`);
}

main().catch((err: unknown) => {
    console.error(err);
    process.exitCode = 1;
});
