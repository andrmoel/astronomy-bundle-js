import {existsSync, writeFileSync} from 'fs';
import axios from 'axios';
import pLimit from 'p-limit';
import {decodeHTML} from 'entities';
import {SOLAR_ECLIPSES} from '../../src/solarEclipse/constants/solarEclipseList';
import {createTimeOfInterest} from '../../src/time';
import {pad} from '../../src/utils/math';

import BesselianElementsParser from './BesselianElementsParser';

export default class BesselianElementsDownloader {
    public async run(): Promise<void> {
        const limit = pLimit(10);

        const promises = SOLAR_ECLIPSES.map((jd0) => limit(
            () => BesselianElementsDownloader.downloadSingleBesselianElements(jd0)
        ));

        await Promise.all(promises);
    }

    private static async downloadSingleBesselianElements(jd: number): Promise<void> {
        const url = BesselianElementsDownloader.getDownloadUrl(jd);
        const file = BesselianElementsDownloader.getLocalFile(jd);

        await BesselianElementsDownloader.downloadFile(url, file);
    }

    private static getDownloadUrl(jd: number): string {
        const {year, month, day} = createTimeOfInterest.fromJulianDay(jd).getTime();

        const sign = year >= 0 ? '' : '-';
        const dateString = sign + pad(Math.abs(year), 4) + pad(month, 2) + pad(day, 2);

        return `https://eclipse.gsfc.nasa.gov/SEsearch/SEdata.php?Ecl=${dateString}`;
    }

    private static getLocalFile(jd: number): string {
        const dir = __dirname + '/../../src/solarEclipse/resources/besselianElements/';
        const fileName = jd + '.ts';

        return dir + fileName;
    }

    private static async downloadFile(url: string, file: string): Promise<void> {
        if (!existsSync(file)) {
            const {data} = await axios.get(url);

            console.log('Downloaded besselian elements: ' + url);

            const besselianElementsString = BesselianElementsDownloader.parseBesselianElementsString(data, url);

            const parser = new BesselianElementsParser(besselianElementsString);
            const besselianElements = parser.parseBesselianElements();

            const content = 'export default ' + JSON.stringify(besselianElements);

            writeFileSync(file, content);
        }
    }

    private static parseBesselianElementsString(content: string, url: string): string {
        const regExp = new RegExp(/<pre>(.*?)<\/pre>/si);
        const matches = content.match(regExp);

        if (matches) {
            const html = matches[1].replace(/(<([^>]+)>)/gi, '');

            return decodeHTML(html);
        }

        throw Error(`Could not parse besselian elements string: ${url}`);
    }
}
