import {createTimeOfInterest} from '../time';
import parseTwoLineElement from './parseTwoLineElement';
import Satellite from './Satellite';

it('tests fo', () => {
    const tleString = `
        ASTRA 2F
        1 38778U 12051A   12288.95265372  .00000136  00000-0  00000+0 0   217
        2 38778 000.0698 254.6769 0000479 231.1384 284.5280 01.00269150   226
    `;
    const tle = parseTwoLineElement(tleString);
    const toi = createTimeOfInterest.fromCurrentTime();

    const sat = new Satellite(tle, toi);
    console.log(sat.getCoords());
});
