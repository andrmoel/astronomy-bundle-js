import {createTimeOfInterest} from '../time';
import createSatellite from './createSatellite';
import Satellite from './Satellite';
import parseTwoLineElement from './parseTwoLineElement';

it('tests createSatellite', () => {
    const tle = parseTwoLineElement('');
    const toi = createTimeOfInterest.fromCurrentTime();

    const satellite = createSatellite(tle, toi);

    expect(satellite).toBeInstanceOf(Satellite);
});

it('tests createSatellite without TOI', () => {
    const tle = parseTwoLineElement('');

    const satellite = createSatellite(tle);

    expect(satellite).toBeInstanceOf(Satellite);
});
