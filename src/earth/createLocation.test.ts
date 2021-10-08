import createLocation from './createLocation';
import Location from './Location';

it('tests createLocation without elevation', () => {
    const location = createLocation(52.52, 13.41);

    expect(location).toBeInstanceOf(Location);
});

it('tests createLocation with elevation', () => {
    const location = createLocation(52.52, 13.41, 30);

    expect(location).toBeInstanceOf(Location);
});
