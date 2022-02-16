import {BesselianElementsArray} from '../../src/solarEclipse/types/besselianElementsTypes';

type Polynomial = [number, number, number, number];

export default class BesselianElementsParser {
    private rows: Array<string> = [];

    public constructor(private content: string) {
        this.rows = this.content.split('\n');
    }

    public parseBesselianElements(): BesselianElementsArray {
        const tMax = this.parseTMax();
        const t0 = this.parseT0();
        const dT = this.parseDeltaT();
        const polynomials = this.parsePolynomials();
        const tanF1F2 = this.parseTanF1F2();
        const latGE = this.parseLatitudeGreatestEclipse();
        const lonGE = this.parseLongitudeGreatestEclipse();

        return [
            tMax,
            t0,
            dT,
            polynomials[0],
            polynomials[1],
            polynomials[2],
            polynomials[3],
            polynomials[4],
            polynomials[5],
            tanF1F2[0],
            tanF1F2[1],
            latGE,
            lonGE,
        ];
    }

    private parseTMax(): number {
        const regExp = new RegExp(/Instant of.*J[.]?D[.]? = ([0-9.]+)/si);
        const matches = this.content.match(regExp);

        if (matches) {
            return parseFloat(matches[1]);
        }

        return 0.0;
    }

    private parseT0(): number {
        const regExp = new RegExp(/t0 =.*?([0-9.]+).*?TDT/si);
        const matches = this.content.match(regExp);

        if (matches) {
            return parseFloat(matches[1]);
        }

        return 0.0;
    }

    private parseDeltaT(): number {
        const regExp = new RegExp(/ΔT =.*?([0-9.]+).*?s/si);
        const matches = this.content.match(regExp);

        if (matches) {
            return parseFloat(matches[1]);
        }

        return 0.0;
    }

    private parsePolynomials(): Array<Polynomial> {
        const polynomials: Array<Array<number>> = [
            [],
            [],
            [],
            [],
            [],
            [],
        ];

        const regExp = new RegExp(/[0-9]{1} +[0-9.-]+ +[0-9.-]+/si);

        this.rows.forEach((row: string) => {
            if (row.match(regExp)) {
                const parts = row.split(/\s+/).filter((value) => value);

                polynomials[0].push(parseFloat(parts[1]));
                polynomials[1].push(parseFloat(parts[2]));
                polynomials[2].push(parseFloat(parts[3]));
                polynomials[3].push(parseFloat(parts[4]));
                polynomials[4].push(parseFloat(parts[5]));
                polynomials[5].push(parseFloat(parts[6]));
            }
        });

        return polynomials as Array<Polynomial>;
    }

    private parseTanF1F2(): Array<number> {
        const regExp = new RegExp(/Tan [f|ƒ]1 = ([0-9.]+).*?Tan [f|ƒ]2 = ([0-9.]+)/si);
        const matches = this.content.match(regExp);

        if (matches) {
            return [
                parseFloat(matches[1]),
                parseFloat(matches[2]),
            ];
        }

        return [0.0, 0.0];
    }

    private parseLatitudeGreatestEclipse(): number {
        const regExp = new RegExp(/Latitude:([0-9. ]+)° ([NS])/si);
        const matches = this.content.match(regExp);

        if (matches) {
            return parseFloat(matches[1]) * (matches[2] === 'N' ? 1 : -1);
        }

        return 0.0;
    }

    private parseLongitudeGreatestEclipse(): number {
        const regExp = new RegExp(/Longitude:([0-9. ]+)° ([WE])/si);
        const matches = this.content.match(regExp);

        if (matches) {
            return parseFloat(matches[1]) * (matches[2] === 'E' ? 1 : -1);
        }

        return 0.0;
    }
}
