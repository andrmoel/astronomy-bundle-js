import {createTimeOfInterest} from '../time';
import {createMercury} from './index';
import Mercury from './Mercury';

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
