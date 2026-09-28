Part of the [Astronomy Bundle](../../README.md).

# Satellite

The `satellite` package provides the `Satellite` object, created from a two-line element set (TLE). Positions are propagated with the SGP4/SDP4 model (Vallado's revised implementation with WGS-72 constants), the model TLEs are generated for. Deep-space objects with orbital periods of 225 minutes or more, such as GPS, geostationary, or Molniya satellites, include lunar and solar perturbations and resonance effects.

## Contents

- [Install](#install)
- [API Reference](#api-reference)
  - [Create the satellite object](#create-the-satellite-object)
  - [Name](#name)
  - [Orbit](#orbit)
  - [Geocentric equatorial rectangular coordinates](#geocentric-equatorial-rectangular-coordinates)
  - [Velocity](#velocity)
  - [Geocentric equatorial spherical coordinates](#geocentric-equatorial-spherical-coordinates)
  - [Geographic location](#geographic-location)
  - [Ground track](#ground-track)
  - [Footprint](#footprint)
  - [Topocentric horizontal coordinates](#topocentric-horizontal-coordinates)
  - [Range rate and Doppler shift](#range-rate-and-doppler-shift)
  - [Sunlight and visibility](#sunlight-and-visibility)

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

### Name

**Description:** Returns the satellite name from the optional name line of the TLE, or `null` if the TLE has no name line.

```javascript
satellite.getName(); // 'ISS (ZARYA)'
```

### Orbit

**Description:** Returns the orbital period in minutes, the semi-major axis in km, and the apogee and perigee heights above the Earth's equatorial radius in km, derived from the TLE mean motion and eccentricity. `getEpochAge` returns the days elapsed between the TLE epoch and the given `TimeOfInterest`; accuracy degrades with age, typically after a few days for low Earth orbits.

```javascript
satellite.getOrbitalPeriod(); // 92.994
satellite.getSemiMajorAxis(); // 6799.276
satellite.getApogeeHeight(); // 426.014
satellite.getPerigeeHeight(); // 416.267
satellite.getEpochAge(toi); // 1.436
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

### Velocity

**Description:** Returns the satellite's velocity in the TEME frame in km/s, and its speed in km/s.

```javascript
const {x, y, z} = satellite.getGeocentricEquatorialRectangularVelocity(toi);
const speed = satellite.getSpeed(toi);
```

The result of the calculation should be:\
x: 6.621 km/s\
y: -3.843 km/s\
z: -0.274 km/s\
Speed: 7.660 km/s

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

### Ground track

**Description:** Returns the sub-satellite points between two times, sampled every `stepMinutes` (default: 1) including the end time. The track is split into segments where it crosses the antimeridian; each segment ends and starts with an interpolated point at ±180° longitude, so every segment can be drawn as a line on a map.

```javascript
const end = TimeOfInterest.fromTime(2026, 9, 28, 16, 19, 0);
const segments = satellite.getGroundTrack(toi, end, 1);
```

The result of the calculation should be two segments: 47 points from 51.714°, 15.255° to -51.764°, 180°, and 56 points from -51.764°, -180° to 42.938°, 28.594°.

### Footprint

**Description:** Returns the area on the ground from which the satellite is visible above `minAltitude` degrees (default: 0), as a ring of `numberOfPoints` locations (default: 72), starting north of the sub-satellite point and running clockwise. `getFootprintRadius` returns its radius as a distance along the ground in km. A spherical Earth is assumed.

```javascript
const footprint = satellite.getFootprint(toi, 10, 72);
const radius = satellite.getFootprintRadius(toi, 10);
```

The result of the calculation should be:\
Radius (horizon): 2273.73 km\
Radius (10° altitude): 1407.91 km

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

### Range rate and Doppler shift

**Description:** Returns the rate of change of the distance between observer and satellite in km/s, positive while the satellite is receding, and the Doppler shift in Hz of a signal with the given frequency in Hz, as received by the observer.

```javascript
const rangeRate = satellite.getRangeRate(toi, location);
const dopplerShift = satellite.getDopplerShift(toi, location, 437.8e6);
```

The result of the calculation should be:\
Range rate: 2.098 km/s\
Doppler shift: -3064 Hz

### Sunlight and visibility

**Description:** `isSunlit` returns whether the centre of the Sun is above the Earth's limb as seen from the satellite, using the flattened Earth without atmosphere. `isVisible` returns whether an observer can see the satellite with the naked eye: it is above the horizon and sunlit while the Sun is more than 6° below the observer's horizon.

```javascript
satellite.isSunlit(TimeOfInterest.fromTime(2026, 9, 28, 14, 50, 15)); // true
satellite.isSunlit(TimeOfInterest.fromTime(2026, 9, 28, 14, 50, 30)); // false
satellite.isVisible(TimeOfInterest.fromTime(2026, 9, 28, 17, 50, 0), location); // true
```
