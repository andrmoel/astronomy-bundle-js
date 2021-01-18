import {createTimeOfInterest} from '../time';
import {byGeocentricEquatorialCoordinates} from './createStar';
import Star from './Star';

it('tests createStar', () => {
    const toi = createTimeOfInterest.fromCurrentTime();
    const start = byGeocentricEquatorialCoordinates(toi);

    expect(start).toBeInstanceOf(Star);
});

it('tests createStar without TOI', () => {
    const start = byGeocentricEquatorialCoordinates();

    expect(start).toBeInstanceOf(Star);
});
