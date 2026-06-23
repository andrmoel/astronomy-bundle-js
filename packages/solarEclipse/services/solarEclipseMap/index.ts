import CentralLine from '@package/solarEclipse/services/solarEclipseMap/models/CentralLine';
// biome-ignore lint/suspicious/noShadowRestrictedNames: The service API intentionally uses Map.create(...) here.
import Map from '@package/solarEclipse/services/solarEclipseMap/models/Map';
import PenumbraPath from '@package/solarEclipse/services/solarEclipseMap/models/PenumbraPath';
import SolarEclipseMap from '@package/solarEclipse/services/solarEclipseMap/models/SolarEclipseMap';
import SunriseBoundary from '@package/solarEclipse/services/solarEclipseMap/models/SunriseBoundary';
import SunsetBoundary from '@package/solarEclipse/services/solarEclipseMap/models/SunsetBoundary';
import UmbraPath from '@package/solarEclipse/services/solarEclipseMap/models/UmbraPath';

const width = 3600;
const height = 1800;
const path = './solarEclipseMap.png';
const baseMap = 'packages/solarEclipse/services/solarEclipseMap/resources/worldmap_topo.png';

const date = '2026-08-12';
const date2 = '2017-08-21';

const map = SolarEclipseMap.create(width, height)
    .addLayer(Map.create(baseMap))
    .addLayer(PenumbraPath.create(date))
    .addLayer(SunsetBoundary.create(date))
    .addLayer(SunriseBoundary.create(date))
    .addLayer(UmbraPath.create(date))
    .addLayer(UmbraPath.create(date2))
    .addLayer(CentralLine.create(date));

void map.print(path);
