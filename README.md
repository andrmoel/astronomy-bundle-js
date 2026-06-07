> **Work in progress.** This is the next major version of astronomy-bundle and is not yet stable. If you are looking for the current stable release, see the [README (version 7.7.7)](old/README.md).

# Astronomy Bundle

A TypeScript library for astronomical calculations including the position of the Sun, Moon, and planets, sunrise and sunset times, and solar eclipses. Most calculations are based on Jean Meeus' *Astronomical Algorithms* and the VSOP87 theory.

## Packages

- [`@astronomy-bundle/core`](https://www.npmjs.com/package/@astronomy-bundle/core)
- [`@astronomy-bundle/earth`](https://www.npmjs.com/package/@astronomy-bundle/earth)
- [`@astronomy-bundle/moon`](https://www.npmjs.com/package/@astronomy-bundle/moon)
- [`@astronomy-bundle/sun`](https://www.npmjs.com/package/@astronomy-bundle/sun)
- [`@astronomy-bundle/solar-eclipse`](https://www.npmjs.com/package/@astronomy-bundle/solar-eclipse)

## API Reference

| Package | Description | Docs |
| ------- | ----------- | ---- |
| **Time** | The `TimeOfInterest` object — the central time representation for all calculations. Supports Julian Day, sidereal time, Delta T, and more. | [README](packages/time/README.md) |
| **Location** | The `Location` object — a geographic coordinate container with formatting and distance helpers. | [README](packages/location/README.md) |
| **Earth** | The `Earth` object — heliocentric VSOP87 coordinates, nutation, and obliquity of the ecliptic. | [README](packages/earth/README.md) |
| **Moon** | The `Moon` object — geocentric and topocentric coordinates, phase angle, illuminated fraction, upcoming lunar phases, and apparent magnitude. | [README](packages/moon/README.md) |
| **Sun** | The `Sun` object — geocentric and topocentric coordinates, angular diameter, light time, and apparent magnitude. | [README](packages/sun/README.md) |
| **Solar Eclipse** | Solar eclipse calculations using Besselian elements. Provides global and local eclipse circumstances for any observer position. | — |
