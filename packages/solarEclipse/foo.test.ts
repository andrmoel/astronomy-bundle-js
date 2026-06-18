import Location from '@package/location/models/Location';
import Catalogue from '@package/solarEclipse/models/Catalogue';
import SolarEclipse from '@package/solarEclipse/models/SolarEclipse';

it('returns no visible eclipse for Burgos on 2046-02-05', () => {
    // Burgos
    const location = Location.create(42.348411, -3.69285);
    const elements = Catalogue.getBesselianElements('2046-02-05');
    const solarEclipse = SolarEclipse.createFromBesselianElements(elements);

    expect(() => solarEclipse.getLocalEclipse(location)).toThrow('No solar eclipse visible at this location');
});
