import {SolarEclipseType} from '@package/solarEclipse/enums/SolarEclipseType';
import type {BesselianElements} from '@package/solarEclipse/types/BesselianElementTypes';
import {getEclipseType} from '@package/solarEclipse/utils/eclipseType';

describe('eclipseType', () => {
    it('gets the eclipse type for a partial eclipse', () => {
        // 2025-03-29
        const elements: BesselianElements = {
            t0Jde: 2460763.95042,
            t0Hours: 11,
            tMin: -3,
            tMax: 3,
            deltaT: 69.2,
            x: [-0.40287, 0.50941223, 0.0000415, -0.00000845],
            y: [0.96569502, 0.27883479, -0.0000723, -0.00000484],
            d: [3.56602001, 0.015539, -0.000001],
            mu: [343.83166504, 15.0043602, 0],
            l1: [0.53576601, -0.0000533, -0.0000129],
            l2: [-0.01032, -0.000053, -0.0000128],
            tanF1: 0.0046823,
            tanF2: 0.004659,
            saros: 149,
        };

        const eclipseType = getEclipseType(elements);

        expect(eclipseType).toBe(SolarEclipseType.Partial);
    });

    it('gets the eclipse type for a total eclipse', () => {
        // 2017-08-21
        const elements: BesselianElements = {
            t0Jde: 2457987.26852,
            t0Hours: 18,
            tMin: -3,
            tMax: 3,
            deltaT: 68.8,
            x: [-0.12957101, 0.54064262, -0.0000294, -0.0000081],
            y: [0.485416, -0.14163999, -0.0000905, 0.00000205],
            d: [11.86695957, -0.013622, -0.000002],
            mu: [89.24542999, 15.00393963, 0],
            l1: [0.54209298, 0.0001241, -0.0000118],
            l2: [-0.004025, 0.0001234, -0.0000117],
            tanF1: 0.0046222,
            tanF2: 0.0045992,
            saros: 145,
        };

        const eclipseType = getEclipseType(elements);

        expect(eclipseType).toBe(SolarEclipseType.Total);
    });

    it('gets the eclipse type for an annular eclipse', () => {
        // 2023-10-02
        const elements: BesselianElements = {
            t0Jde: 2460586.2821,
            t0Hours: 19,
            tMin: -3,
            tMax: 3,
            deltaT: 74.3,
            x: [-0.068048, 0.44161701, 0.0000136, -0.00000483],
            y: [-0.36317, -0.243563, 0.0000339, 0.00000284],
            d: [-3.98725009, -0.015511, 0.000001],
            mu: [107.73108673, 15.00432968, 0],
            l1: [0.57034898, -2e-7, -0.0000098],
            l2: [0.024091, -2e-7, -0.0000097],
            tanF1: 0.0046734,
            tanF2: 0.0046501,
            saros: 144,
        };

        const eclipseType = getEclipseType(elements);

        expect(eclipseType).toBe(SolarEclipseType.Annular);
    });

    it('gets the eclipse type for a non-central total eclipse whose axis misses the Earth sphere', () => {
        // 2043-04-09 total (non-central) eclipse.
        const elements: BesselianElements = {
            t0Jde: 2467349.2900000215,
            t0Hours: 19,
            tMin: -4,
            tMax: 4,
            deltaT: 87.19999694824219,
            x: [-0.4477890133857727, 0.5135998574197864, 0.0000564989165929136, -0.000008500010071101979],
            y: [0.8979039788246155, 0.26973256548529156, -0.00009270025544070387, -0.0000047000154423563694],
            d: [7.749800205230713, 0.014808012576071224, -0.0000020000320444593986],
            mu: [104.61505126953125, 15.004059662775616, 0],
            l1: [0.5353430507942324, -0.000054599056063942283, -0.000012799829096346935],
            l2: [-0.010740775780510881, -0.00005439763420875544, -0.000012699850459303567],
            tanF1: 0.004668001831082628,
            tanF2: 0.004644799725337606,
            saros: 149,
        };

        const eclipseType = getEclipseType(elements);

        expect(eclipseType).toBe(SolarEclipseType.Total);
    });

    it('gets the eclipse type for a hybrid eclipse', () => {
        // 2023-04-20
        const elements: BesselianElements = {
            t0Jde: 2460054.67912,
            t0Hours: 4,
            tMin: -3,
            tMax: 3,
            deltaT: 69.2,
            x: [0.02685, 0.49501821, 0.0000135, -0.00000706],
            y: [-0.42736599, 0.2441992, -0.0000494, -0.00000368],
            d: [11.41178989, 0.013741, -0.000003],
            mu: [240.24293518, 15.00341988, 0],
            l1: [0.54680401, 0.0001216, -0.0000116],
            l2: [0.000663, 0.000121, -0.0000115],
            tanF1: 0.004655,
            tanF2: 0.0046318,
            saros: 129,
        };

        const eclipseType = getEclipseType(elements);

        expect(eclipseType).toBe(SolarEclipseType.Hybrid);
    });
});
