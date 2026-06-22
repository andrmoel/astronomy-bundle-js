import drawEclipseMap from '../getEclipseMap';
import Catalogue from '../models/Catalogue';

const DEFAULT_DATE = '2026-08-12';
const DEFAULT_OUTPUT = 'packages/solarEclipse/eclipse-map.png';
const DEFAULT_BASEMAP = 'packages/solarEclipse/resources/worldmap_topo.png';

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

    await drawEclipseMap({
        basemap,
        output,
        overlays: [
            {
                elements: Catalogue.getBesselianElements(date),
                // isCentralLineVisible: true,
                isUmbraVisible: true,
                isPenumbraVisible: true,
                // isSunriseLineVisible: true,
                // isSunsetLineVisible: true,
                style: {
                    centralLineColor: 'rgba(20, 20, 20, 1)',
                    centralLineWidth: 3,
                    umbralFillColor: 'rgba(0, 0, 0, 0.4)',
                    umbralLimitColor: 'rgba(0, 0, 0, 0.4)',
                    umbralLimitWidth: 2,
                    penumbralFillColor: 'rgba(0, 0, 0, 0.3)',
                    penumbralLimitColor: 'rgba(0, 0, 0, 0.3)',
                    penumbralLimitWidth: 1.5,
                    sunriseBoundaryColor: 'rgba(255, 132, 0, 0.95)',
                    sunsetBoundaryColor: 'rgba(255, 205, 0, 0.95)',
                },
            },
        ],
    });

    console.log(`Generated solar eclipse map for ${date}: ${output}`);
}

main().catch((err: unknown) => {
    console.error(err);
    process.exitCode = 1;
});
