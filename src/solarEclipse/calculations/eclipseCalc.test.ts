import {round} from '../../utils/math';
import {getCentralDuration, getDuration} from './eclipseCalc';

// TSE 2020-12-14
const besselianElements = {
    tMax: 2459198.177,
    t0: 16,
    dT: 72.1,
    x: [-0.181824, 0.5633567, 0.0000216, -0.000009],
    y: [-0.269645, -0.0858122, 0.0001884, 0.0000015],
    d: [-23.2577591, -0.001986, 0.000006, 0],
    l1: [0.543862, 0.000097, -0.0000126, 0],
    l2: [-0.002265, 0.0000965, -0.0000125, 0],
    mu: [61.265911, 14.9965, 0, 0],
    tanF1: 0.0047502,
    tanF2: 0.0047266,
    latGreatestEclipse: -40.3,
    lonGreatestEclipse: -67.9,
}

describe('tests getDuration', () => {
    it('has no eclipse for given location', () => {
        const location = {
            lat: 10.48946,
            lon: -66.90969,
            elevation: 960,
        }

        const result = getDuration(besselianElements, location);

        expect(result).toBe(0.0);
    });

    it('has eclipse from C1 to C4', () => {
        const location = {
            lat: -22.92768,
            lon: -43.17063,
            elevation: 450,
        }

        const result = getDuration(besselianElements, location);

        expect(round(result, 1)).toBe(8735.9);
    });

    it('has eclipse from sunrise to C4', () => {
        // TODO Write test
    });

    it('has eclipse from C1 to sunset', () => {
        // TODO Write test
    });
});

describe('tests getCentralDuration', () => {
    it('has no eclipse for given location', () => {
        const location = {
            lat: 10.48946,
            lon: -66.90969,
            elevation: 960,
        }

        const result = getCentralDuration(besselianElements, location);

        expect(result).toBe(0.0);
    });

    it('has only partial eclipse for given location', () => {
        const location = {
            lat: -22.92768,
            lon: -43.17063,
            elevation: 450,
        }

        const result = getCentralDuration(besselianElements, location);

        expect(result).toBe(0.0);
    });

    it('has eclipse from C2 to C3', () => {
        const location = {
            lat: -39.53940,
            lon: -70.37216,
            elevation: 450,
        }

        const result = getCentralDuration(besselianElements, location);

        expect(round(result, 1)).toBe(111.4);
    });

    it('has eclipse from sunrise to C4', () => {
        // TODO Write test
    });

    it('has eclipse from C1 to sunset', () => {
        // TODO Write test
    });
});
