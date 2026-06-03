import {getContactTaus} from './contacts';
import elements from '../resources/besselianElements';
import {Location} from '@app/types/LocationTypes';
import {parseBesselianElements} from './besselianElements';

const besselianElements = parseBesselianElements(elements);
const location: Location = {
    lat: -79.738991,
    lon: -82.736597,
    elevation: 718,
};

it('tests getContactTaus', () => {
    const result = getContactTaus(besselianElements, location);

    expect(result).not.toBeNull();
    expect(result!.c1).toBeCloseTo(-1.084899);
    expect(result!.c2).toBeCloseTo(-0.232001);
    expect(result!.max).toBeCloseTo(-0.225928);
    expect(result!.c3).toBeCloseTo(-0.219840);
    expect(result!.c4).toBeCloseTo(0.6400323);
});
