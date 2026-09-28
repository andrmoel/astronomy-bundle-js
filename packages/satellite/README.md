Part of the [Astronomy Bundle](../../README.md).

# Satellite

The `satellite` package provides the `Satellite` object, created from a two-line element set (TLE). Positions are propagated with the SGP4/SDP4 model (Vallado's revised implementation with WGS-72 constants), the model TLEs are generated for. Deep-space objects with orbital periods of 225 minutes or more, such as GPS, geostationary, or Molniya satellites, include lunar and solar perturbations and resonance effects.

## Contents

- [Install](#install)
- [API Reference](#api-reference)
  - [Create the satellite object](#create-the-satellite-object)
  - [Geocentric equatorial rectangular coordinates](#geocentric-equatorial-rectangular-coordinates)
  - [Geocentric equatorial spherical coordinates](#geocentric-equatorial-spherical-coordinates)
  - [Geographic location](#geographic-location)
  - [Topocentric horizontal coordinates](#topocentric-horizontal-coordinates)

## Install

With npm: `npm install @astronomy-bundle/satellite`\
With yarn: `yarn add @astronomy-bundle/satellite`\
With pnpm: `pnpm add @astronomy-bundle/satellite`

## API Reference

### Create the satellite object

**Description:** The `Satellite` object is created from a TLE string with two lines, optionally preceded by a name line. Line length, line numbers and checksums are validated; an `Error` is thrown for invalid input. All parsed TLE fields are exposed via the read-only `tle` property, the epoch as a `TimeOfInterest`.

**Example**: Create the ISS from its TLE

```javascript
import {Satellite} from '@astronomy-bundle/satellite';

const satellite = Satellite.fromTLE(`ISS (ZARYA)
1 25544U 98067A   26270.17419514  .00009528  00000-0  18291-3 0  9997
2 25544  51.6315 155.3455 0007168 193.0560 167.0244 15.48664528587561`);

satellite.tle.name; // 'ISS (ZARYA)'
satellite.tle.satelliteNumber; // 25544
satellite.tle.inclination; // 51.6315
satellite.tle.meanMotion; // 15.48664528
```

### Geocentric equatorial rectangular coordinates

**Description:** Returns the satellite's position propagated with SGP4 to the given `TimeOfInterest`. The coordinates are in the TEME frame (true equator, mean equinox), the native output frame of SGP4, in km. An `Error` is thrown if propagation fails, e.g. because the satellite has decayed.

**Example**: Get the ISS position on 28 September 2026 at 14:39 UTC

```javascript
import {Satellite} from '@astronomy-bundle/satellite';
import {TimeOfInterest} from '@astronomy-bundle/core';

const toi = TimeOfInterest.fromTime(2026, 9, 28, 14, 39, 0);
const {x, y, z} = satellite.getGeocentricEquatorialRectangularCoordinates(toi);
```

The result of the calculation should be:\
x: -1957.969 km\
y: -3744.080 km\
z: 5319.007 km

### Geocentric equatorial spherical coordinates

**Description:** Returns right ascension and declination in degrees, referred to the true equator and equinox of date, and the distance from the Earth's centre in km.

```javascript
const {rightAscension, declination, radiusVector} = satellite.getGeocentricEquatorialSphericalCoordinates(toi);
```

The result of the calculation should be:\
Right ascension: 242.395°\
Declination: 51.538°\
Distance: 6792.909 km

### Geographic location

**Description:** Returns the sub-satellite point as a `Location` object: geodetic latitude and longitude in degrees (east positive) and the elevation above the reference ellipsoid in meters.

```javascript
const location = satellite.getGeographicLocation(toi);
```

The result of the calculation should be:\
Latitude: 51.714°\
Longitude: 15.255°\
Elevation: 427 907 m

### Topocentric horizontal coordinates

**Description:** Returns azimuth (measured from north towards east) and altitude in degrees and the distance in km, as seen by an observer at the given location. Atmospheric refraction is not applied.

```javascript
const location = {lat: 52.52, lon: 13.405, elevation: 34};
const {azimuth, altitude, radiusVector} = satellite.getTopocentricHorizontalCoordinates(toi, location);
```

The result of the calculation should be:\
Azimuth: 124.562°\
Altitude: 68.743°\
Distance: 456.947 km
