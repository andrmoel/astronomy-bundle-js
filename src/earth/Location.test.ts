import Location from './Location';

it('has no elevation', () => {
    const location = new Location(52.519, 13.408);

    expect(location.getLatitude()).toBe(52.519);
    expect(location.getLongitude()).toBe(13.408);
    expect(location.getElevation()).toBe(0);
});

it('has a given elevation', () => {
    const location = new Location(52.519, 13.408, 32);

    expect(location.getLatitude()).toBe(52.519);
    expect(location.getLongitude()).toBe(13.408);
    expect(location.getElevation()).toBe(32);
});
