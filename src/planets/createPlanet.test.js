import {createTimeOfInterest} from '../time';
import {
    createJupiter,
    createMars,
    createMercury,
    createNeptune,
    createSaturn,
    createUranus,
    createVenus,
} from './createPlanet';
import Mercury from './Mercury';
import Venus from './Venus';
import Jupiter from './Jupiter';
import Mars from './Mars';
import Saturn from './Saturn';
import Uranus from './Uranus';
import Neptune from './Neptune';

describe('test for createMercury', () => {
    it('tests with TOI', () => {
        const toi = createTimeOfInterest.fromCurrentTime();
        const mercury = createMercury(toi);

        expect(mercury).toBeInstanceOf(Mercury);
    });

    it('tests without TOI', () => {
        const mercury = createMercury();

        expect(mercury).toBeInstanceOf(Mercury);
    });
});

describe('test for createVenus', () => {
    it('tests with TOI', () => {
        const toi = createTimeOfInterest.fromCurrentTime();
        const venus = createVenus(toi);

        expect(venus).toBeInstanceOf(Venus);
    });

    it('tests without TOI', () => {
        const venus = createVenus();

        expect(venus).toBeInstanceOf(Venus);
    });
});

describe('test for createMars', () => {
    it('tests with TOI', () => {
        const toi = createTimeOfInterest.fromCurrentTime();
        const mars = createMars(toi);

        expect(mars).toBeInstanceOf(Mars);
    });

    it('tests without TOI', () => {
        const mars = createMars();

        expect(mars).toBeInstanceOf(Mars);
    });
});

describe('test for createJupiter', () => {
    it('tests with TOI', () => {
        const toi = createTimeOfInterest.fromCurrentTime();
        const jupiter = createJupiter(toi);

        expect(jupiter).toBeInstanceOf(Jupiter);
    });

    it('tests without TOI', () => {
        const jupiter = createJupiter();

        expect(jupiter).toBeInstanceOf(Jupiter);
    });
});

describe('test for createSaturn', () => {
    it('tests with TOI', () => {
        const toi = createTimeOfInterest.fromCurrentTime();
        const saturn = createSaturn(toi);

        expect(saturn).toBeInstanceOf(Saturn);
    });

    it('tests without TOI', () => {
        const saturn = createSaturn();

        expect(saturn).toBeInstanceOf(Saturn);
    });
});

describe('test for createUranus', () => {
    it('tests with TOI', () => {
        const toi = createTimeOfInterest.fromCurrentTime();
        const uranus = createUranus(toi);

        expect(uranus).toBeInstanceOf(Uranus);
    });

    it('tests without TOI', () => {
        const uranus = createUranus();

        expect(uranus).toBeInstanceOf(Uranus);
    });
});

describe('test for createNeptune', () => {
    it('tests with TOI', () => {
        const toi = createTimeOfInterest.fromCurrentTime();
        const neptune = createNeptune(toi);

        expect(neptune).toBeInstanceOf(Neptune);
    });

    it('tests without TOI', () => {
        const neptune = createNeptune();

        expect(neptune).toBeInstanceOf(Neptune);
    });
});
