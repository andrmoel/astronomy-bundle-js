import createBesselianElements from '../createBesselianElements';
import {BesselianElements} from '../types/besselianElementsTypes';
import {createTimeOfInterest} from '../../time';
import {round} from '../../utils/math';
import {
    getTimeLocationCircumstancesC1,
    getTimeLocationCircumstancesC2,
    getTimeLocationCircumstancesC3,
    getTimeLocationCircumstancesC4,
    getTimeLocationCircumstancesMaxEclipse,
} from './eventCircumstancesCalc';

import '../../assets/script_xavier';
import {getObservationalCircumstances} from './circumstancesCalc';

describe('test for partial solar eclipse 2019-01-06', () => {
    const toi = createTimeOfInterest.fromTime(2019, 1, 6, 0, 0, 0);
    let besselianElements: BesselianElements;

    beforeEach(async () => {
        besselianElements = await createBesselianElements(toi);
    });

    describe('an observer outside the path of eclipse', () => {
        const location = {
            lat: 42.55581,
            lon: 12.00954,
            elevation: 515,
        }

        it('tests getTimeLocationCircumstancesC1', () => {
            const circumstances = getTimeLocationCircumstancesC1(besselianElements, location);

            // TODO Throw exception, no eclipse possible
        });

        it('tests getTimeLocationCircumstancesC2', () => {
            const circumstances = getTimeLocationCircumstancesC2(besselianElements, location);

            // TODO Throw exception, no eclipse possible
        });

        it('tests getTimeLocationCircumstancesMaxEclipse', () => {
            const circumstances = getTimeLocationCircumstancesMaxEclipse(besselianElements, location);

            const obsCircumstances = getObservationalCircumstances(circumstances);

            console.log(obsCircumstances);
            // TODO Throw exception, no eclipse possible
        });

        it('tests getTimeLocationCircumstancesC3', () => {
            const circumstances = getTimeLocationCircumstancesC3(besselianElements, location);

            // TODO Throw exception, no eclipse possible
        });

        it('tests getTimeLocationCircumstancesC4', () => {
            const circumstances = getTimeLocationCircumstancesC4(besselianElements, location);

            // TODO Throw exception, no eclipse possible
        });
    });

    describe('an observer inside path of partial eclipse', () => {
        const location = {
            lat: 56.31702,
            lon: 160.84090,
            elevation: 50,
        }

        it('tests getTimeLocationCircumstancesC1', () => {
            const circumstances = getTimeLocationCircumstancesC1(besselianElements, location);

            expect(round(circumstances.t, 8)).toBe(-1.61763153);
            expect(round(circumstances.u, 6)).toBe(-0.548978);
            expect(round(circumstances.v, 6)).toBe(0.159704);
            expect(round(circumstances.a, 6)).toBe(0.367768);
            expect(round(circumstances.b, 6)).toBe(-0.006434);
            expect(round(circumstances.l1Derived, 6)).toBe(0.571736);
            expect(round(circumstances.l2Derived, 6)).toBe(0.025471);
            expect(round(circumstances.n2, 6)).toBe(0.135295);
        });

        it('tests getTimeLocationCircumstancesC2', () => {
            const circumstances = getTimeLocationCircumstancesC2(besselianElements, location);

            // TODO Throw exception, no eclipse possible
        });

        it('tests getTimeLocationCircumstancesMaxEclipse', () => {
            const circumstances = getTimeLocationCircumstancesMaxEclipse(besselianElements, location);

            expect(round(circumstances.t, 8)).toBe(-0.12886616);
            expect(round(circumstances.u, 6)).toBe(-0.007053);
            expect(round(circumstances.v, 6)).toBe(0.166332);
            expect(round(circumstances.a, 6)).toBe(0.363898);
            expect(round(circumstances.b, 6)).toBe(0.015431);
            expect(round(circumstances.l1Derived, 6)).toBe(0.571783);
            expect(round(circumstances.l2Derived, 6)).toBe(0.025517);
            expect(round(circumstances.n2, 6)).toBe(0.13266);
        });

        it('tests getTimeLocationCircumstancesC3', () => {
            const circumstances = getTimeLocationCircumstancesC3(besselianElements, location);

            // TODO Throw exception, no eclipse possible
        });

        it('tests getTimeLocationCircumstancesC4', () => {
            const circumstances = getTimeLocationCircumstancesC4(besselianElements, location);

            expect(round(circumstances.t, 8)).toBe(1.33158222);
            expect(round(circumstances.u, 6)).toBe(0.534497);
            expect(round(circumstances.v, 6)).toBe(0.204095);
            expect(round(circumstances.a, 6)).toBe(0.381066);
            expect(round(circumstances.b, 6)).toBe(0.035859);
            expect(round(circumstances.l1Derived, 6)).toBe(0.572138);
            expect(round(circumstances.l2Derived, 6)).toBe(0.025871);
            expect(round(circumstances.n2, 6)).toBe(0.146497);
        });
    });
});

describe('test for total solar eclipse 2020-12-14', () => {
    const toi = createTimeOfInterest.fromTime(2020, 12, 14, 0, 0, 0);
    let besselianElements: BesselianElements;

    beforeEach(async () => {
        besselianElements = await createBesselianElements(toi);
    });

    describe('an observer outside the path of eclipse', () => {
        const location = {
            lat: 10.48946,
            lon: -66.90969,
            elevation: 960,
        }

        it('tests getTimeLocationCircumstancesC1', () => {
            const circumstances = getTimeLocationCircumstancesC1(besselianElements, location);

            // TODO Throw exception, no eclipse possible
        });

        it('tests getTimeLocationCircumstancesC2', () => {
            const circumstances = getTimeLocationCircumstancesC2(besselianElements, location);

            // TODO Throw exception, no eclipse possible
        });

        it('tests getTimeLocationCircumstancesMaxEclipse', () => {
            const circumstances = getTimeLocationCircumstancesMaxEclipse(besselianElements, location);

            expect(round(circumstances.t, 8)).toBe(-0.61575574);
            expect(round(circumstances.u, 6)).toBe(-0.271173);
            expect(round(circumstances.v, 6)).toBe(-0.757723);
            expect(round(circumstances.a, 6)).toBe(0.31487);
            expect(round(circumstances.b, 6)).toBe(-0.112685);
            expect(round(circumstances.l1Derived, 6)).toBe(0.539994);
            expect(round(circumstances.l2Derived, 6)).toBe(-0.006114);
            expect(round(circumstances.n2, 6)).toBe(0.111841);
        });

        it('tests getTimeLocationCircumstancesC3', () => {
            const circumstances = getTimeLocationCircumstancesC3(besselianElements, location);

            // TODO Throw exception, no eclipse possible
        });

        it('tests getTimeLocationCircumstancesC4', () => {
            const circumstances = getTimeLocationCircumstancesC4(besselianElements, location);

            // TODO Throw exception, no eclipse possible
        });
    });

    describe('an observer inside path of partial eclipse', () => {
        const location = {
            lat: -22.92768,
            lon: -43.17063,
            elevation: 0,
        }

        it('tests getTimeLocationCircumstancesC1', () => {
            const circumstances = getTimeLocationCircumstancesC1(besselianElements, location);

            expect(round(circumstances.t, 8)).toBe(-0.02926645);
            expect(round(circumstances.u, 6)).toBe(-0.473179);
            expect(round(circumstances.v, 6)).toBe(-0.258729);
            expect(round(circumstances.a, 6)).toBe(0.333153);
            expect(round(circumstances.b, 6)).toBe(-0.057448);
            expect(round(circumstances.l1Derived, 6)).toBe(0.539295);
            expect(round(circumstances.l2Derived, 6)).toBe(-0.00681);
            expect(round(circumstances.n2, 6)).toBe(0.114291);
        });

        it('tests getTimeLocationCircumstancesC2', () => {
            const circumstances = getTimeLocationCircumstancesC2(besselianElements, location);

            // TODO Throw exception, no eclipse possible
        });

        it('tests getTimeLocationCircumstancesMaxEclipse', () => {
            const circumstances = getTimeLocationCircumstancesMaxEclipse(besselianElements, location);

            expect(round(circumstances.t, 8)).toBe(1.25551637);
            expect(round(circumstances.u, 6)).toBe(-0.024194);
            expect(round(circumstances.v, 6)).toBe(-0.31345);
            expect(round(circumstances.a, 6)).toBe(0.369799);
            expect(round(circumstances.b, 6)).toBe(-0.028543);
            expect(round(circumstances.l1Derived, 6)).toBe(0.54001);
            expect(round(circumstances.l2Derived, 6)).toBe(-0.006098);
            expect(round(circumstances.n2, 6)).toBe(0.137566);
        });

        it('tests getTimeLocationCircumstancesC3', () => {
            const circumstances = getTimeLocationCircumstancesC3(besselianElements, location);

            // TODO Throw exception, no eclipse possible
        });

        it('tests getTimeLocationCircumstancesC4', () => {
            const circumstances = getTimeLocationCircumstancesC4(besselianElements, location);

            expect(round(circumstances.t, 8)).toBe(2.39729641);
            expect(round(circumstances.u, 6)).toBe(0.425645);
            expect(round(circumstances.v, 6)).toBe(-0.333794);
            expect(round(circumstances.a, 6)).toBe(0.420675);
            expect(round(circumstances.b, 6)).toBe(-0.008093);
            expect(round(circumstances.l1Derived, 6)).toBe(0.540918);
            expect(round(circumstances.l2Derived, 6)).toBe(-0.005195);
            expect(round(circumstances.n2, 6)).toBe(0.177033);
        });
    });

    describe('an observer inside path of totality', () => {
        const location = {
            lat: -39.53940,
            lon: -70.37216,
            elevation: 450,
        }

        it('tests getTimeLocationCircumstancesC1', () => {
            const circumstances = getTimeLocationCircumstancesC1(besselianElements, location);

            expect(round(circumstances.t, 8)).toBe(-1.24158445);
            expect(round(circumstances.u, 6)).toBe(-0.51834);
            expect(round(circumstances.v, 6)).toBe(0.149826);
            expect(round(circumstances.a, 6)).toBe(0.384829);
            expect(round(circumstances.b, 6)).toBe(-0.123805);
            expect(round(circumstances.l1Derived, 6)).toBe(0.539559);
            expect(round(circumstances.l2Derived, 6)).toBe(-0.006546);
            expect(round(circumstances.n2, 6)).toBe(0.163421);
        });

        it('tests getTimeLocationCircumstancesC2', () => {
            const circumstances = getTimeLocationCircumstancesC2(besselianElements, location);

            expect(round(circumstances.t, 8)).toBe(0.13509718);
            expect(round(circumstances.u, 6)).toBe(-0.006495);
            expect(round(circumstances.v, 6)).toBe(-0.001872);
            expect(round(circumstances.a, 6)).toBe(0.362899);
            expect(round(circumstances.b, 6)).toBe(-0.096049);
            expect(round(circumstances.l1Derived, 6)).toBe(0.539345);
            expect(round(circumstances.l2Derived, 6)).toBe(-0.00676);
            expect(round(circumstances.n2, 6)).toBe(0.140921);
        });

        it('tests getTimeLocationCircumstancesMaxEclipse', () => {
            const circumstances = getTimeLocationCircumstancesMaxEclipse(besselianElements, location);

            expect(round(circumstances.t, 8)).toBe(0.1505589);
            expect(round(circumstances.u, 6)).toBe(-0.000885);
            expect(round(circumstances.v, 6)).toBe(-0.003355);
            expect(round(circumstances.a, 6)).toBe(0.362797);
            expect(round(circumstances.b, 6)).toBe(-0.095723);
            expect(round(circumstances.l1Derived, 6)).toBe(0.539344);
            expect(round(circumstances.l2Derived, 6)).toBe(-0.00676);
            expect(round(circumstances.n2, 6)).toBe(0.140784);
        });

        it('tests getTimeLocationCircumstancesC3', () => {
            const circumstances = getTimeLocationCircumstancesC3(besselianElements, location);

            expect(round(circumstances.t, 8)).toBe(0.1660297);
            expect(round(circumstances.u, 6)).toBe(0.004727);
            expect(round(circumstances.v, 6)).toBe(-0.004833);
            expect(round(circumstances.a, 6)).toBe(0.362697);
            expect(round(circumstances.b, 6)).toBe(-0.095396);
            expect(round(circumstances.l1Derived, 6)).toBe(0.539344);
            expect(round(circumstances.l2Derived, 6)).toBe(-0.00676);
            expect(round(circumstances.n2, 6)).toBe(0.140649);
        });

        it('tests getTimeLocationCircumstancesC4', () => {
            const circumstances = getTimeLocationCircumstancesC4(besselianElements, location);

            expect(round(circumstances.t, 8)).toBe(1.6025965);
            expect(round(circumstances.u, 6)).toBe(0.52602);
            expect(round(circumstances.v, 6)).toBe(-0.120008);
            expect(round(circumstances.a, 6)).toBe(0.367769);
            expect(round(circumstances.b, 6)).toBe(-0.065072);
            expect(round(circumstances.l1Derived, 6)).toBe(0.539536);
            expect(round(circumstances.l2Derived, 6)).toBe(-0.006569);
            expect(round(circumstances.n2, 6)).toBe(0.139488);
        });
    });
});

describe('test for annular solar eclipse 2021-06-10', () => {
    const toi = createTimeOfInterest.fromTime(2021, 6, 10, 0, 0, 0);
    let besselianElements: BesselianElements;

    beforeEach(async () => {
        besselianElements = await createBesselianElements(toi);
    });

    describe('an observer outside the path of eclipse', () => {
        const location = {
            lat: 42.55581,
            lon: 12.00954,
            elevation: 515,
        }

        it('tests getTimeLocationCircumstancesC1', () => {
            const circumstances = getTimeLocationCircumstancesC1(besselianElements, location);

            // TODO Throw exception, no eclipse possible
        });

        it('tests getTimeLocationCircumstancesC2', () => {
            const circumstances = getTimeLocationCircumstancesC2(besselianElements, location);

            // TODO Throw exception, no eclipse possible
        });

        it('tests getTimeLocationCircumstancesMaxEclipse', () => {
            const circumstances = getTimeLocationCircumstancesMaxEclipse(besselianElements, location);

            // TODO Throw exception, no eclipse possible
        });

        it('tests getTimeLocationCircumstancesC3', () => {
            const circumstances = getTimeLocationCircumstancesC3(besselianElements, location);

            // TODO Throw exception, no eclipse possible
        });

        it('tests getTimeLocationCircumstancesC4', () => {
            const circumstances = getTimeLocationCircumstancesC4(besselianElements, location);

            // TODO Throw exception, no eclipse possible
        });
    });

    describe('an observer inside path of partial eclipse', () => {
        const location = {
            lat: 52.52199,
            lon: 13.41297,
            elevation: 35,
        }

        it('tests getTimeLocationCircumstancesC1', () => {
            const circumstances = getTimeLocationCircumstancesC1(besselianElements, location);

            expect(round(circumstances.t, 8)).toBe(-1.37374146);
            expect(round(circumstances.u, 6)).toBe(-0.47515);
            expect(round(circumstances.v, 6)).toBe(0.297542);
            expect(round(circumstances.a, 6)).toBe(0.353489);
            expect(round(circumstances.b, 6)).toBe(0.113077);
            expect(round(circumstances.l1Derived, 6)).toBe(0.560623);
            expect(round(circumstances.l2Derived, 6)).toBe(0.014413);
            expect(round(circumstances.n2, 6)).toBe(0.137741);
        });

        it('tests getTimeLocationCircumstancesC2', () => {
            const circumstances = getTimeLocationCircumstancesC2(besselianElements, location);

            // TODO Throw exception, no eclipse possible
        });

        it('tests getTimeLocationCircumstancesMaxEclipse', () => {
            const circumstances = getTimeLocationCircumstancesMaxEclipse(besselianElements, location);

            expect(round(circumstances.t, 8)).toBe(-0.33407113);
            expect(round(circumstances.u, 6)).toBe(-0.114235);
            expect(round(circumstances.v, 6)).toBe(0.406489);
            expect(round(circumstances.a, 6)).toBe(0.342695);
            expect(round(circumstances.b, 6)).toBe(0.096307);
            expect(round(circumstances.l1Derived, 6)).toBe(0.560407);
            expect(round(circumstances.l2Derived, 6)).toBe(0.014198);
            expect(round(circumstances.n2, 6)).toBe(0.126715);
        });

        it('tests getTimeLocationCircumstancesC3', () => {
            const circumstances = getTimeLocationCircumstancesC3(besselianElements, location);

            // TODO Throw exception, no eclipse possible
        });

        it('tests getTimeLocationCircumstancesC4', () => {
            const circumstances = getTimeLocationCircumstancesC4(besselianElements, location);

            expect(round(circumstances.t, 8)).toBe(0.73815111);
            expect(round(circumstances.u, 6)).toBe(0.252658);
            expect(round(circumstances.v, 6)).toBe(0.500167);
            expect(round(circumstances.a, 6)).toBe(0.34375);
            expect(round(circumstances.b, 6)).toBe(0.078444);
            expect(round(circumstances.l1Derived, 6)).toBe(0.560359);
            expect(round(circumstances.l2Derived, 6)).toBe(0.014151);
            expect(round(circumstances.n2, 6)).toBe(0.124317);
        });
    });

    describe('an observer inside path of annularity', () => {
        const location = {
            lat: 54.75462,
            lon: -82.39848,
            elevation: 20,
        }

        it('tests getTimeLocationCircumstancesC1', () => {
            const circumstances = getTimeLocationCircumstancesC1(besselianElements, location);

            expect(round(circumstances.t, 8)).toBe(-1.97556532);
            expect(round(circumstances.u, 6)).toBe(-0.548079);
            expect(round(circumstances.v, 6)).toBe(-0.135031);
            expect(round(circumstances.a, 6)).toBe(0.592581);
            expect(round(circumstances.b, 6)).toBe(0.136664);
            expect(round(circumstances.l1Derived, 6)).toBe(0.564468);
            expect(round(circumstances.l2Derived, 6)).toBe(0.018238);
            expect(round(circumstances.n2, 6)).toBe(0.369829);
        });

        it('tests getTimeLocationCircumstancesC2', () => {
            const circumstances = getTimeLocationCircumstancesC2(besselianElements, location);

            expect(round(circumstances.t, 8)).toBe(-1.05513053);
            expect(round(circumstances.u, 6)).toBe(-0.016715);
            expect(round(circumstances.v, 6)).toBe(-0.005848);
            expect(round(circumstances.a, 6)).toBe(0.561269);
            expect(round(circumstances.b, 6)).toBe(0.14354);
            expect(round(circumstances.l1Derived, 6)).toBe(0.563935);
            expect(round(circumstances.l2Derived, 6)).toBe(0.017708);
            expect(round(circumstances.n2, 6)).toBe(0.335627);
        });

        it('tests getTimeLocationCircumstancesMaxEclipse', () => {
            const circumstances = getTimeLocationCircumstancesMaxEclipse(besselianElements, location);

            expect(round(circumstances.t, 8)).toBe(-1.02464793);
            expect(round(circumstances.u, 6)).toBe(0.000377);
            expect(round(circumstances.v, 6)).toBe(-0.00147);
            expect(round(circumstances.a, 6)).toBe(0.560162);
            expect(round(circumstances.b, 6)).toBe(0.143716);
            expect(round(circumstances.l1Derived, 6)).toBe(0.563916);
            expect(round(circumstances.l2Derived, 6)).toBe(0.01769);
            expect(round(circumstances.n2, 6)).toBe(0.334435);
        });

        it('tests getTimeLocationCircumstancesC3', () => {
            const circumstances = getTimeLocationCircumstancesC3(besselianElements, location);

            expect(round(circumstances.t, 8)).toBe(-0.99417691);
            expect(round(circumstances.u, 6)).toBe(0.017429);
            expect(round(circumstances.v, 6)).toBe(0.002912);
            expect(round(circumstances.a, 6)).toBe(0.559051);
            expect(round(circumstances.b, 6)).toBe(0.143888);
            expect(round(circumstances.l1Derived, 6)).toBe(0.563897);
            expect(round(circumstances.l2Derived, 6)).toBe(0.01767);
            expect(round(circumstances.n2, 6)).toBe(0.333241);
        });

        it('tests getTimeLocationCircumstancesC4', () => {
            const circumstances = getTimeLocationCircumstancesC4(besselianElements, location);

            expect(round(circumstances.t, 8)).toBe(-0.0199363);
            expect(round(circumstances.u, 6)).toBe(0.544226);
            expect(round(circumstances.v, 6)).toBe(0.145155);
            expect(round(circumstances.a, 6)).toBe(0.521966);
            expect(round(circumstances.b, 6)).toBe(0.1475);
            expect(round(circumstances.l1Derived, 6)).toBe(0.563251);
            expect(round(circumstances.l2Derived, 6)).toBe(0.017028);
            expect(round(circumstances.n2, 6)).toBe(0.294205);
        });
    });
});
