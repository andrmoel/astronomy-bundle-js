Part of the [Astronomy Bundle](../../README.md).

# Satellite

The `satellite` package provides the `Satellite` object, created from a two-line element set (TLE).

## Contents

- [Install](#install)
- [API Reference](#api-reference)
  - [Create the satellite object](#create-the-satellite-object)

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
