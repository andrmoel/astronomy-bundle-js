import {createTimeOfInterest} from '../time';
import {byEquatorialCoordinates} from './createStar';
import Star from './Star';

it('tests createStar', () => {
    const toi = createTimeOfInterest.fromCurrentTime();
    const start = byEquatorialCoordinates(toi);

    expect(start).toBeInstanceOf(Star);
});

it('tests createStar without TOI', () => {
    const start = byEquatorialCoordinates();

    expect(start).toBeInstanceOf(Star);
});
