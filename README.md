> **Work in progress.** This is the next major version of astronomy-bundle and is not yet stable. If you are looking for the current stable release, see the [README (version 7.7.7)](old/README.md).

# Astronomy Bundle

A TypeScript library for astronomical calculations including the position of the Sun, Moon, and planets, sunrise and sunset times, and solar eclipses. Most calculations are based on Jean Meeus' *Astronomical Algorithms* and the VSOP87 theory.

## Packages

- [`@astronomy-bundle/core`](https://www.npmjs.com/package/@astronomy-bundle/core)
- [`@astronomy-bundle/earth`](https://www.npmjs.com/package/@astronomy-bundle/earth)
- [`@astronomy-bundle/moon`](https://www.npmjs.com/package/@astronomy-bundle/moon)
- [`@astronomy-bundle/sun`](https://www.npmjs.com/package/@astronomy-bundle/sun)
- [`@astronomy-bundle/planets`](https://www.npmjs.com/package/@astronomy-bundle/planets)
- [`@astronomy-bundle/solar-eclipse`](https://www.npmjs.com/package/@astronomy-bundle/solar-eclipse)

## API Reference

| Package | Description | Docs |
| ------- | ----------- | ---- |
| **Time** | The `TimeOfInterest` object — the central time representation for all calculations. Supports Julian Day, sidereal time, Delta T, and more. | [README](packages/time/README.md) |
| **Location** | The `Location` object — a geographic coordinate container with formatting and distance helpers. | [README](packages/location/README.md) |
| **Earth** | The `Earth` object — heliocentric VSOP87 coordinates, nutation, and obliquity of the ecliptic. | [README](packages/earth/README.md) |
| **Moon** | The `Moon` object — geocentric coordinates, apparent and observed topocentric coordinates, rise, transit and set times, phase angle, illuminated fraction, upcoming lunar phases, and apparent magnitude. | [README](packages/moon/README.md) |
| **Sun** | The `Sun` object — geocentric coordinates, apparent and observed topocentric coordinates, rise, transit and set times, angular diameter, light time, and apparent magnitude. | [README](packages/sun/README.md) |
| **Planets** | The `Mercury`, `Venus`, `Mars`, `Jupiter`, `Saturn`, `Uranus`, and `Neptune` objects — heliocentric, geocentric, apparent, and topocentric planetary coordinates, rise, transit and set times, plus distance, light time, phase, elongation, and magnitude. | [README](packages/planets/README.md) |
| **Solar Eclipse** | Solar eclipse calculations from Besselian elements — global circumstances (eclipse type, time and location of greatest eclipse, magnitude, obscuration, Moon/Sun ratio, and the central line path) and local circumstances for any observer (local type, contact times, magnitude, obscuration, duration, and the Sun's position at a given moment). Ships with built-in catalogues covering 1900–2100 and −1999–3000. | [README](packages/solarEclipse/README.md) |
