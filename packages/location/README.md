# Location

The `location` package provides the `Location` object — a geographic coordinate container used throughout the astronomy-bundle library wherever an observer's position on Earth is required. It holds latitude, longitude, and optional elevation, and exposes helpers for coordinate formatting and distance calculations.

---

## Install

With npm: `npm install @astronomy-bundle/core`\
With yarn: `yarn add @astronomy-bundle/core`\
With pnpm: `pnpm add @astronomy-bundle/core`

---

## API Reference

### Create a Location object

**Description:** The `Location` object represents a point on the Earth's surface defined by latitude, longitude, and an optional elevation in meters. Latitude and longitude are given as decimal degrees; positive values are North/East, negative values are South/West.

**Example**: Create a location for Berlin, Germany at an elevation of 34 m

```javascript
import {Location} from '@astronomy-bundle/core';

const location = Location.create(52.519, 13.408, 34);
```

---

### Coordinate formatting

**Description:** These methods convert the decimal-degree coordinates into human-readable strings using the standard degree-minutes (DM) or degree-minutes-seconds (DMS) notation. The hemisphere prefix (N/S or E/W) is determined automatically from the sign of the value.

**Example**: Format the coordinates of Berlin, Germany

```javascript
import {Location} from '@astronomy-bundle/core';

const location = Location.create(52.519, 13.408);

const latDM  = location.getLatitudeInDegreeMinutes();         // N 52° 31.14'
const lonDM  = location.getLongitudeInDegreeMinutes();        // E 13° 24.48'
const latDMS = location.getLatitudeInDegreeMinutesSeconds();  // N 52° 31' 08.4"
const lonDMS = location.getLongitudeInDegreeMinutesSeconds(); // E 13° 24' 28.8"
```

---

### Distance between two locations

**Description:** Calculates the great-circle distance between two `Location` objects using the Haversine formula, which accounts for the spherical shape of the Earth. The result is returned in kilometres.

**Example**: Calculate the distance between the Eiffel Tower and the Washington Monument

```javascript
import {Location} from '@astronomy-bundle/core';

const locationParis = Location.create(48.858272, 2.29447);
const locationWashingtonDc = Location.create(38.889514, -77.035193);

const distanceInKm = locationParis.getDistanceToInKm(locationWashingtonDc);
```

The result of the calculation should be: *6177.93 km*
