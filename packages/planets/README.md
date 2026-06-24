Part of the [Astronomy Bundle](../../README.md).

# Planets

The `planets` package provides objects for computing planetary positions as seen from Earth. The package entry point exports `Mercury`, `Venus`, `Mars`, `Jupiter`, `Saturn`, `Uranus`, and `Neptune`, each with heliocentric VSOP87 coordinates, geocentric coordinates, apparent coordinates corrected for light time, aberration, and nutation, and topocentric coordinates for observers on Earth's surface. Observation quantities such as angular diameter, elongation, phase angle, illuminated fraction, bright-limb position angle, waxing/waning state, and apparent magnitude are also available.

The examples below intentionally rotate between planets. The same methods are available on every planet class; you do not need separate helper functions for each planet.

## Contents

- [Install](#install)
- [High precision](#high-precision)
- [API Reference](#api-reference)
  - [Create a planet object](#create-a-planet-object)
  - [Heliocentric ecliptic spherical coordinates](#heliocentric-ecliptic-spherical-coordinates)
  - [Heliocentric ecliptic rectangular coordinates](#heliocentric-ecliptic-rectangular-coordinates)
  - [Geocentric ecliptic spherical coordinates](#geocentric-ecliptic-spherical-coordinates)
  - [Geocentric ecliptic rectangular coordinates](#geocentric-ecliptic-rectangular-coordinates)
  - [Geocentric equatorial spherical coordinates](#geocentric-equatorial-spherical-coordinates)
  - [Apparent geocentric coordinates](#apparent-geocentric-coordinates)
  - [Topocentric coordinates](#topocentric-coordinates)
  - [Distance to Earth](#distance-to-earth)
  - [Light time](#light-time)
  - [Angular diameter](#angular-diameter)
  - [Elongation](#elongation)
  - [Phase angle](#phase-angle)
  - [Illuminated fraction](#illuminated-fraction)
  - [Position angle of bright limb](#position-angle-of-bright-limb)
  - [Waxing / waning](#waxing--waning)
  - [Apparent magnitude](#apparent-magnitude)

## Install

With npm: `npm install @astronomy-bundle/planets @astronomy-bundle/core`\
With yarn: `yarn add @astronomy-bundle/planets @astronomy-bundle/core`\
With pnpm: `pnpm add @astronomy-bundle/planets @astronomy-bundle/core`

## High precision

Each planet class uses reduced VSOP87 series for the planet itself and for Earth by default. For maximum accuracy you can import a planet from its dedicated high-precision entry point instead, which uses the full VSOP87 series for both bodies. Example for Neptune:

```javascript
import {Neptune} from '@astronomy-bundle/planets/neptune/high-precision';
```

> **Warning:** The full VSOP87 series used by the high-precision variant contains significantly more terms than the reduced version. This results in a larger bundle size and slower parse time. Only use this variant when the extra accuracy is required.

## API Reference

### Create a planet object

**Description:** A planet object represents one planet at a specific point in time, given as a `TimeOfInterest`. If no TOI is provided it defaults to the current time.

All available planet classes use the same static constructor pattern:

| Planet | Standard import                                              | High-precision import |
| ------ |--------------------------------------------------------------| --------------------- |
| Mercury | `import {Mercury} from '@astronomy-bundle/planets/mercury';` | `import {Mercury} from '@astronomy-bundle/planets/mercury/high-precision';` |
| Venus | `import {Venus} from '@astronomy-bundle/planets/venus';`     | `import {Venus} from '@astronomy-bundle/planets/venus/high-precision';` |
| Mars | `import {Mars} from '@astronomy-bundle/planets/mars';`       | `import {Mars} from '@astronomy-bundle/planets/mars/high-precision';` |
| Jupiter | `import {Jupiter} from '@astronomy-bundle/planets/juputer';` | `import {Jupiter} from '@astronomy-bundle/planets/jupiter/high-precision';` |
| Saturn | `import {Saturn} from '@astronomy-bundle/planets/saturn';`   | `import {Saturn} from '@astronomy-bundle/planets/saturn/high-precision';` |
| Uranus | `import {Uranus} from '@astronomy-bundle/planets/uranus';`   | `import {Uranus} from '@astronomy-bundle/planets/uranus/high-precision';` |
| Neptune | `import {Neptune} from '@astronomy-bundle/planets/neptune';` | `import {Neptune} from '@astronomy-bundle/planets/neptune/high-precision';` |

Create an instance with `PlanetClass.create(toi)`, for example `Mars.create(toi)`. The same methods shown in the remaining examples are available on every class listed above.

**Example**: Create a Mars object for 1 January 2000 at 00:00 UTC

```javascript
import {TimeOfInterest} from '@astronomy-bundle/core';
import {Mars} from '@astronomy-bundle/planets/mars';
// or for high precision:
// import {Mars} from '@astronomy-bundle/planets/mars/high-precision';

const toi = TimeOfInterest.fromTime(2000, 1, 1, 0, 0, 0);
const mars = Mars.create(toi);
```

---

### Heliocentric ecliptic spherical coordinates

**Description:** These methods return the planet's position in the solar system as heliocentric ecliptic spherical coordinates `{lon, lat, radiusVector}`. Longitude and latitude are in degrees; the radius vector (distance from the Sun) is in astronomical units (AU). Two reference frames are available: J2000.0 (fixed equinox of year 2000) and the ecliptic of the date.

**Example**: Get Mercury's heliocentric ecliptic spherical coordinates for 1 January 2000 at 00:00 UTC

```javascript
import {TimeOfInterest} from '@astronomy-bundle/core';
import {Mercury} from '@astronomy-bundle/planets/mercury';

const toi = TimeOfInterest.fromTime(2000, 1, 1, 0, 0, 0);
const mercury = Mercury.create(toi);

const coordsJ2000 = mercury.getHeliocentricEclipticSphericalJ2000Coordinates();
const coordsDate = mercury.getHeliocentricEclipticSphericalDateCoordinates();
```

The result of the calculation should be:\
J2000 longitude: *252.41001662°*\
J2000 latitude: *-2.16943876°*\
J2000 radius vector: *0.46625953 AU*

Date longitude: *252.40999750°*\
Date latitude: *-2.16943862°*\
Date radius vector: *0.46625953 AU*

---

### Heliocentric ecliptic rectangular coordinates

**Description:** These methods return the planet's position as heliocentric ecliptic rectangular coordinates `{x, y, z}` in astronomical units (AU), derived from the spherical coordinates.

**Example**: Get Venus's heliocentric ecliptic rectangular coordinates for 1 January 2000 at 00:00 UTC

```javascript
import {TimeOfInterest} from '@astronomy-bundle/core';
import {Venus} from '@astronomy-bundle/planets/venus';

const toi = TimeOfInterest.fromTime(2000, 1, 1, 0, 0, 0);
const venus = Venus.create(toi);

const coordsJ2000 = venus.getHeliocentricEclipticRectangularJ2000Coordinates();
const coordsDate = venus.getHeliocentricEclipticRectangularDateCoordinates();
```

The result of the calculation should be:\
J2000 x: *-0.71861647 AU*\
J2000 y: *-0.02250360 AU*\
J2000 z: *0.04140800 AU*

Date x: *-0.71861648 AU*\
Date y: *-0.02250336 AU*\
Date z: *0.04140800 AU*

---

### Geocentric ecliptic spherical coordinates

**Description:** These methods return the planet's position as geocentric ecliptic spherical coordinates `{lon, lat, radiusVector}`. Longitude and latitude are in degrees; the radius vector (distance from Earth) is in astronomical units (AU). Two reference frames are available: J2000.0 and the ecliptic of the date.

**Example**: Get Mars's geocentric ecliptic spherical coordinates for 1 January 2000 at 00:00 UTC

```javascript
import {TimeOfInterest} from '@astronomy-bundle/core';
import {Mars} from '@astronomy-bundle/planets/mars';

const toi = TimeOfInterest.fromTime(2000, 1, 1, 0, 0, 0);
const mars = Mars.create(toi);

const coordsJ2000 = mars.getGeocentricEclipticSphericalJ2000Coordinates();
const coordsDate = mars.getGeocentricEclipticSphericalDateCoordinates();
```

The result of the calculation should be:\
J2000 longitude: *327.58707704°*\
J2000 latitude: *-1.07390696°*\
J2000 radius vector: *1.84689309 AU*

Date longitude: *327.58705790°*\
Date latitude: *-1.07390687°*\
Date radius vector: *1.84689309 AU*

---

### Geocentric ecliptic rectangular coordinates

**Description:** These methods return the planet's position as geocentric ecliptic rectangular coordinates `{x, y, z}` in astronomical units (AU). The coordinates are computed from the planet's heliocentric vector minus Earth's heliocentric vector.

**Example**: Get Jupiter's geocentric ecliptic rectangular coordinates for 1 January 2000 at 00:00 UTC

```javascript
import {TimeOfInterest} from '@astronomy-bundle/core';
import {Jupiter} from '@astronomy-bundle/planets/jupiter';

const toi = TimeOfInterest.fromTime(2000, 1, 1, 0, 0, 0);
const jupiter = Jupiter.create(toi);

const coordsJ2000 = jupiter.getGeocentricEclipticRectangularJ2000Coordinates();
const coordsDate = jupiter.getGeocentricEclipticRectangularDateCoordinates();
```

The result of the calculation should be:\
J2000 x: *4.17197659 AU*\
J2000 y: *1.96657435 AU*\
J2000 z: *-0.10181913 AU*

Date x: *4.17197725 AU*\
Date y: *1.96657296 AU*\
Date z: *-0.10181913 AU*

---

### Geocentric equatorial spherical coordinates

**Description:** These methods return the planet's position in the equatorial coordinate frame as `{rightAscension, declination, radiusVector}`. Right ascension and declination are in degrees; the radius vector is in AU. Two reference frames are available: J2000.0 and the equator of the date.

**Example**: Get Saturn's geocentric equatorial spherical coordinates for 1 January 2000 at 00:00 UTC

```javascript
import {TimeOfInterest} from '@astronomy-bundle/core';
import {Saturn} from '@astronomy-bundle/planets/saturn';

const toi = TimeOfInterest.fromTime(2000, 1, 1, 0, 0, 0);
const saturn = Saturn.create(toi);

const coordsJ2000 = saturn.getGeocentricEquatorialSphericalJ2000Coordinates();
const coordsDate = saturn.getGeocentricEquatorialSphericalDateCoordinates();
```

The result of the calculation should be:\
J2000 right ascension: *38.77891222°*\
J2000 declination: *12.61683145°*\
J2000 radius vector: *8.64555648 AU*

Date right ascension: *38.77889379°*\
Date declination: *12.61682543°*\
Date radius vector: *8.64555649 AU*

---

### Apparent geocentric coordinates

**Description:** Apparent coordinates apply light-time correction, aberration, and nutation to the geometric coordinates, giving the position as it would be observed from Earth's centre. Available in both ecliptic and equatorial spherical forms, as well as ecliptic rectangular.

**Example**: Get Uranus's apparent geocentric coordinates for 1 January 2000 at 00:00 UTC

```javascript
import {TimeOfInterest} from '@astronomy-bundle/core';
import {Uranus} from '@astronomy-bundle/planets/uranus';

const toi = TimeOfInterest.fromTime(2000, 1, 1, 0, 0, 0);
const uranus = Uranus.create(toi);

const eclipticSpherical = uranus.getApparentGeocentricEclipticSphericalCoordinates();
const eclipticRectangular = uranus.getApparentGeocentricEclipticRectangularCoordinates();
const equatorialSpherical = uranus.getApparentGeocentricEquatorialSphericalCoordinates();
```

The result of the calculation should be:\
Apparent ecliptic longitude: *314.78186561°*\
Apparent ecliptic latitude: *-0.62453323°*\
Apparent ecliptic radius vector: *20.72225950 AU*

Apparent ecliptic x: *14.59609121 AU*\
Apparent ecliptic y: *-14.70765590 AU*\
Apparent ecliptic z: *-0.22587149 AU*

Apparent right ascension: *317.43716009°*\
Apparent declination: *-16.99602659°*\
Apparent radius vector: *20.72225950 AU*

---

### Topocentric coordinates

**Description:** Topocentric coordinates shift the geocentric position to match the perspective of an observer at a specific location on Earth's surface. A `Location` (geographic latitude and longitude in degrees) is required. The API exposes apparent topocentric equatorial coordinates, apparent topocentric horizontal coordinates with geometric altitude, and observed topocentric horizontal coordinates with atmospheric refraction applied to the altitude.

**Example**: Get Neptune's topocentric coordinates for 1 January 2000 at 00:00 UTC, observer at 52.519°N, 13.408°E

```javascript
import {TimeOfInterest, Location} from '@astronomy-bundle/core';
import {Neptune} from '@astronomy-bundle/planets/neptune';

const toi = TimeOfInterest.fromTime(2000, 1, 1, 0, 0, 0);
const location = Location.create(52.519, 13.408);
const neptune = Neptune.create(toi);

const apparentEquatorial = neptune.getApparentTopocentricEquatorialSphericalCoordinates(location);
const apparentHorizontal = neptune.getApparentTopocentricHorizontalCoordinates(location);
const observedHorizontal = neptune.getRefractionCorrectedTopocentricHorizontalCoordinates(location);
```

The result of the calculation should be:\
Apparent topocentric right ascension: *305.414827°*\
Apparent topocentric declination: *-19.217270°*\
Apparent topocentric radius vector: *31.021081 AU*

Apparent topocentric azimuth: *339.698701°*\
Geometric altitude: *-55.400892°*\
Observed altitude (with refraction): *-55.400892°*

---

### Distance to Earth

**Description:** These methods return the distance between the planet and Earth in kilometres. `getDistanceToEarth` returns the geometric geocentric distance, `getApparentDistanceToEarth` returns the apparent geocentric distance after light-time correction, and the topocentric variant corrects for the observer's position on the surface.

**Example**: Get Mercury's distance to Earth for 1 January 2000 at 00:00 UTC

```javascript
import {TimeOfInterest, Location} from '@astronomy-bundle/core';
import {Mercury} from '@astronomy-bundle/planets/mercury';

const toi = TimeOfInterest.fromTime(2000, 1, 1, 0, 0, 0);
const location = Location.create(52.519, 13.408);
const mercury = Mercury.create(toi);

const distance = mercury.getDistanceToEarth();
const apparentDistance = mercury.getApparentDistanceToEarth();
const topocentricDistance = mercury.getTopocentricDistanceToEarth(location);
```

The result of the calculation should be:\
Geocentric distance: *211,427,521.84 km*\
Apparent geocentric distance: *211,418,256.22 km*\
Topocentric distance: *211,423,604.05 km*

---

### Light time

**Description:** Returns the time in seconds that light takes to travel from the planet to Earth at the given moment.

**Example**: Get Venus's light time for 1 January 2000 at 00:00 UTC

```javascript
import {TimeOfInterest} from '@astronomy-bundle/core';
import {Venus} from '@astronomy-bundle/planets/venus';

const toi = TimeOfInterest.fromTime(2000, 1, 1, 0, 0, 0);
const venus = Venus.create(toi);

const lightTime = venus.getLightTime();
```

The result of the calculation should be:\
Light time: *0h 9m 26.09s*

---

### Angular diameter

**Description:** Returns the planet's angular diameter in degrees as seen from Earth (or from a surface observer for the topocentric variant).

**Example**: Get Mars's angular diameter for 1 January 2000 at 00:00 UTC

```javascript
import {TimeOfInterest, Location} from '@astronomy-bundle/core';
import {Mars} from '@astronomy-bundle/planets/mars';

const toi = TimeOfInterest.fromTime(2000, 1, 1, 0, 0, 0);
const location = Location.create(52.519, 13.408);
const mars = Mars.create(toi);

const diameter = mars.getAngularDiameter();
const topocentricDiameter = mars.getTopocentricAngularDiameter(location);
```

The result of the calculation should be:\
Geocentric angular diameter: *0° 00' 05.071"*\
Topocentric angular diameter: *0° 00' 05.071"*

---

### Elongation

**Description:** Returns the angular separation between the planet and the Sun in degrees. The topocentric variant uses the planet's topocentric position for the observer location.

**Example**: Get Jupiter's elongation for 1 January 2000 at 00:00 UTC

```javascript
import {TimeOfInterest, Location} from '@astronomy-bundle/core';
import {Jupiter} from '@astronomy-bundle/planets/jupiter';

const toi = TimeOfInterest.fromTime(2000, 1, 1, 0, 0, 0);
const location = Location.create(52.519, 13.408);
const jupiter = Jupiter.create(toi);

const elongation = jupiter.getElongation();
const topocentricElongation = jupiter.getTopocentricElongation(location);
```

The result of the calculation should be:\
Elongation: *105.370933°*\
Topocentric elongation: *105.370480°*

---

### Phase angle

**Description:** Returns the planet's phase angle in degrees, the angle Sun-planet-Earth. A phase angle of 0° corresponds to a fully illuminated disk and larger values indicate a thinner visible phase.

**Example**: Get Saturn's phase angle for 1 January 2000 at 00:00 UTC

```javascript
import {TimeOfInterest, Location} from '@astronomy-bundle/core';
import {Saturn} from '@astronomy-bundle/planets/saturn';

const toi = TimeOfInterest.fromTime(2000, 1, 1, 0, 0, 0);
const location = Location.create(52.519, 13.408);
const saturn = Saturn.create(toi);

const phaseAngle = saturn.getPhaseAngle();
const topocentricPhaseAngle = saturn.getTopocentricPhaseAngle(location);
```

The result of the calculation should be:\
Phase angle: *5.292377°*\
Topocentric phase angle: *5.292399°*

---

### Illuminated fraction

**Description:** Returns the fraction of the planet's disk that is illuminated, as a value between 0 and 1.

**Example**: Get Uranus's illuminated fraction for 1 January 2000 at 00:00 UTC

```javascript
import {TimeOfInterest, Location} from '@astronomy-bundle/core';
import {Uranus} from '@astronomy-bundle/planets/uranus';

const toi = TimeOfInterest.fromTime(2000, 1, 1, 0, 0, 0);
const location = Location.create(52.519, 13.408);
const uranus = Uranus.create(toi);

const fraction = uranus.getIlluminatedFraction();
const topocentricFraction = uranus.getTopocentricIlluminatedFraction(location);
```

The result of the calculation should be:\
Illuminated fraction: *0.999800*\
Topocentric illuminated fraction: *0.999800*

---

### Position angle of bright limb

**Description:** Returns the position angle of the planet's bright limb in degrees, measured eastward from the north point of the disk. This indicates the direction from which the planet is illuminated.

**Example**: Get Neptune's position angle of bright limb for 1 January 2000 at 00:00 UTC

```javascript
import {TimeOfInterest, Location} from '@astronomy-bundle/core';
import {Neptune} from '@astronomy-bundle/planets/neptune';

const toi = TimeOfInterest.fromTime(2000, 1, 1, 0, 0, 0);
const location = Location.create(52.519, 13.408);
const neptune = Neptune.create(toi);

const chi = neptune.getPositionAngleOfBrightLimb();
const topocentricChi = neptune.getTopocentricPositionAngleOfBrightLimb(location);
```

The result of the calculation should be:\
Position angle: *256.128912°*\
Topocentric position angle: *256.129008°*

---

### Waxing / waning

**Description:** Returns `true` if the planet is currently waxing, `false` if it is waning.

**Example**: Check Mercury's waxing/waning state for 1 January 2000 at 00:00 UTC

```javascript
import {TimeOfInterest, Location} from '@astronomy-bundle/core';
import {Mercury} from '@astronomy-bundle/planets/mercury';

const toi = TimeOfInterest.fromTime(2000, 1, 1, 0, 0, 0);
const location = Location.create(52.519, 13.408);
const mercury = Mercury.create(toi);

const waxing = mercury.isWaxing();
const topocentricWaxing = mercury.isTopocentricWaxing(location);
```

The result of the calculation should be:\
Waxing: *false*\
Topocentric waxing: *false*

---

### Apparent magnitude

**Description:** Returns the planet's apparent visual magnitude. The value depends on the planet's distance from the Sun, distance from Earth, and phase angle.

**Example**: Get Venus's apparent magnitude for 1 January 2000 at 00:00 UTC

```javascript
import {TimeOfInterest, Location} from '@astronomy-bundle/core';
import {Venus} from '@astronomy-bundle/planets/venus';

const toi = TimeOfInterest.fromTime(2000, 1, 1, 0, 0, 0);
const location = Location.create(52.519, 13.408);
const venus = Venus.create(toi);

const magnitude = venus.getApparentMagnitude();
const topocentricMagnitude = venus.getTopocentricApparentMagnitude(location);
```

The result of the calculation should be:\
Apparent magnitude: *-4.07*\
Topocentric apparent magnitude: *-4.07*
