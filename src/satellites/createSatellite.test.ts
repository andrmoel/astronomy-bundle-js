import {createTimeOfInterest} from '../time';
import createSatellite from './createSatellite';
import parseTwoLineElement from './parseTwoLineElement';
import Satellite from './Satellite';

const tleString = `
    ISS(ZARYA)
    1 25544U 98067A   06040.85138889  .00012260  00000-0  86027-4 0  3194
    2 25544  51.6448 122.3522 0008835 257.3473 251.7436 15.74622749413094
`;

it('tests createSatellite', () => {
    const tle = parseTwoLineElement(tleString);
    const toi = createTimeOfInterest.fromCurrentTime();

    const satellite = createSatellite(tle, toi);

    expect(satellite).toBeInstanceOf(Satellite);
});

it('tests createSatellite without TOI', () => {
    const tle = parseTwoLineElement(tleString);

    const satellite = createSatellite(tle);

    expect(satellite).toBeInstanceOf(Satellite);
});
