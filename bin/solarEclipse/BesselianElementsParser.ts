import {BesselianElements} from '../../src/solarEclipse/types/besselianElementsTypes';

type Polynomials = {
    x: Array<number>;
    y: Array<number>;
    d: Array<number>;
    l1: Array<number>;
    l2: Array<number>;
    mu: Array<number>;
}

type TanF1F2 = {
    tanF1: number,
    tanF2: number,
}

export default class BesselianElementsParser {
    private rows: string[] = [];

    constructor(private content: string) {
        this.rows = this.content.split('\n');
    }

    public parseBesselianElements(): BesselianElements {
        const tMax = this.parseTMax();
        const t0 = this.parseT0();
        const dT = this.parseDeltaT();
        const polynomials = this.parsePolynomials();
        const tanF1F2 = this.parseTanF1F2();
        const latGreatestEclipse = this.parseLatitudeGreatestEclipse();
        const lonGreatestEclipse = this.parseLongitudeGreatestEclipse();

        return {
            tMax,
            t0,
            dT,
            ...polynomials,
            ...tanF1F2,
            latGreatestEclipse,
            lonGreatestEclipse,
        };
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

    private parsePolynomials(): Polynomials {
        const polynomials: Polynomials = {
            x: [],
            y: [],
            d: [],
            l1: [],
            l2: [],
            mu: [],
        };

        const regExp = new RegExp(/[0-9]{1} +[0-9.-]+ +[0-9.-]+/si);

        this.rows.forEach((row: string) => {
            if (row.match(regExp)) {
                const parts = row.split(/\s+/).filter((value) => value);

                polynomials.x.push(parseFloat(parts[1]));
                polynomials.y.push(parseFloat(parts[2]));
                polynomials.d.push(parseFloat(parts[3]));
                polynomials.l1.push(parseFloat(parts[4]));
                polynomials.l2.push(parseFloat(parts[5]));
                polynomials.mu.push(parseFloat(parts[6]));
            }
        });

        return polynomials;
    }

    private parseTanF1F2(): TanF1F2 {
        const regExp = new RegExp(/Tan [f|ƒ]1 = ([0-9.]+).*?Tan [f|ƒ]2 = ([0-9.]+)/si);
        const matches = this.content.match(regExp);

        if (matches) {
            return {
                tanF1: parseFloat(matches[1]),
                tanF2: parseFloat(matches[2]),
            }
        }

        return {
            tanF1: 0.0,
            tanF2: 0.0,
        }
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
