import parseTwoLineElement from './parseTwoLineElement';

it('has valid TLE with name', () => {
    const tleString = `
        ISS(ZARYA)
        1 25544U 98067A   06040.85138889  .00012260  00000-0  86027-4 0  3194
        2 25544  51.6448 122.3522 0008835 257.3473 251.7436 15.74622749413094
    `;

    const tle = parseTwoLineElement(tleString);

    expect(tle).toEqual({
        name: 'ISS(ZARYA)',
        noradNr: 25544,
        classification: 'U',
        internationalDesignator: '98067A',
        epochYear: 2006,
        epochDayOfYear: 40.85138889,
        firstDerivativeMeanMotion: 0.0001226,
        secondDerivativeMeanMotion: 0,
        dragTerm: 0.000086027,
        ephemerisType: 0,
        setNumber: 319,
        catalogNumber: 25544,
        inclination: 51.6448,
        rightAscension: 122.3522,
        eccentricity: 0.0008835,
        argumentOfPerigee: 257.3473,
        meanAnomaly: 251.7436,
        meanMotion: 15.74622749,
        revolution: 41309,
    });
});

it('has valid TLE without name', () => {
    const tleString = `
        1 25544U 98067A   06040.85138889  .00012260  00000-0  86027-4 0  3194
        2 25544  51.6448 122.3522 0008835 257.3473 251.7436 15.74622749413094
    `;

    const tle = parseTwoLineElement(tleString);

    expect(tle).toEqual({
        name: 'satellite',
        noradNr: 25544,
        classification: 'U',
        internationalDesignator: '98067A',
        epochYear: 2006,
        epochDayOfYear: 40.85138889,
        firstDerivativeMeanMotion: 0.0001226,
        secondDerivativeMeanMotion: 0,
        dragTerm: 0.000086027,
        ephemerisType: 0,
        setNumber: 319,
        catalogNumber: 25544,
        inclination: 51.6448,
        rightAscension: 122.3522,
        eccentricity: 0.0008835,
        argumentOfPerigee: 257.3473,
        meanAnomaly: 251.7436,
        meanMotion: 15.74622749,
        revolution: 41309,
    });
});

it('has missing row 1', () => {
    const tleString = `
        ISS(ZARYA)
        2 25544  51.6448 122.3522 0008835 257.3473 251.7436 15.74622749413094
    `;

    expect(() => {
        parseTwoLineElement(tleString);
    }).toThrow('Missing TLE row 1');
});

it('has missing row 2', () => {
    const tleString = `
        1 25544U 98067A   06040.85138889  .00012260  00000-0  86027-4 0  3194
    `;

    expect(() => {
        parseTwoLineElement(tleString);
    }).toThrow('Missing TLE row 2');
});
