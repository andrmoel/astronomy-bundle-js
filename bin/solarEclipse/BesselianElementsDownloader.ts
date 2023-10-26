import axios from 'axios';
import {decodeHTML} from 'entities';
import {existsSync, writeFileSync} from 'fs';
import pLimit from 'p-limit';

import {time2julianDay} from '../../dist/time/calculations/timeCalc';
import {SOLAR_ECLIPSES} from '../../src/solarEclipse/constants/solarEclipseList';
import {createTimeOfInterest} from '../../src/time';
import {pad} from '../../src/utils/math';
import BesselianElementsParser from './BesselianElementsParser';

export default class BesselianElementsDownloader {
    private targetDir: string = __dirname + '/../../src/solarEclipse/besselianElements/';

    public async run(): Promise<void> {
        const limit = pLimit(10);

        const promises = SOLAR_ECLIPSES.map((jd0: number) => limit(() => {
            if (BesselianElementsDownloader.isBetweenGivenTimePeriod(jd0)) {
                this.downloadSingleBesselianElements(jd0);
            }
        }));

        await Promise.all(promises);

        this.createGetterFunction();
    }

    private async downloadSingleBesselianElements(jd: number): Promise<void> {
        const url = BesselianElementsDownloader.getDownloadUrl(jd);
        const file = this.getLocalFile(jd);

        await BesselianElementsDownloader.downloadFile(url, file);
    }

    private createGetterFunction(): void {
        let content = `import {BesselianElementsArray} from '../types/besselianElementsTypes';

        export default function loadBesselianElements(jd0: number): BesselianElementsArray | undefined {
                switch(jd0) {
        `;

        for (let i = 0; i <= SOLAR_ECLIPSES.length; i++) {
            const jd0 = SOLAR_ECLIPSES[i];

            if (BesselianElementsDownloader.isBetweenGivenTimePeriod(jd0)) {
                content += `case ${jd0}: return require('./${jd0}');\n`;
            }
        }

        content += `
                }
            }
        `;

        const file = this.targetDir + 'loadBesselianElements.ts';

        writeFileSync(file, content);
    }

    private static getDownloadUrl(jd: number): string {
        const {year, month, day} = createTimeOfInterest.fromJulianDay(jd).getTime();

        const sign = year >= 0 ? '' : '-';
        const dateString = sign + pad(Math.abs(year), 4) + pad(month, 2) + pad(day, 2);

        return `https://eclipse.gsfc.nasa.gov/SEsearch/SEdata.php?Ecl=${dateString}`;
    }

    private getLocalFile(jd: number): string {
        const fileName = jd + '.json';

        return this.targetDir + fileName;
    }

    private static async downloadFile(url: string, file: string): Promise<void> {
        if (!existsSync(file)) {
            try {
                const {data} = await axios.get(url);

                BesselianElementsDownloader.onDownloadSuccess(data, url, file);
            } catch (error) {
                console.log('Error while downloading: ' + url);
            }
        }
    }

    private static onDownloadSuccess(data: string, url: string, file: string): void {
        console.log('Downloaded besselian elements: ' + url);

        const besselianElementsString = BesselianElementsDownloader.parseBesselianElementsString(data, url);

        const parser = new BesselianElementsParser(besselianElementsString);
        const besselianElements = parser.parseBesselianElements();

        const content = JSON.stringify(besselianElements);

        writeFileSync(file, content);
    }

    private static parseBesselianElementsString(content: string, url: string): string {
        const regExp = new RegExp(/<pre>(.*?)<\/pre>/is);
        const matches = content.match(regExp);

        if (matches) {
            const html = matches[1].replace(/(<([^>]+)>)/gi, '');

            return decodeHTML(html);
        }

        throw new Error(`Could not parse besselian elements string: ${url}`);
    }

    private static isBetweenGivenTimePeriod(jd0: number): boolean {
        return jd0 >= time2julianDay({year: 1500, month: 1, day: 1, hour: 0, min: 0, sec: 0})
            && jd0 < time2julianDay({year: 2500, month: 1, day: 1, hour: 0, min: 0, sec: 0});
    }
}
