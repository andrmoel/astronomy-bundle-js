export type Name = {
    name: string;
};

export type RowOneValues = {
    noradNr: number;
    classification: string;
    internationalDesignator: string;
    epochYear: number;
    epochDayOfYear: number;
    firstDerivativeMeanMotion: number;
    secondDerivativeMeanMotion: number;
    dragTerm: number;
    ephemerisType: number;
    setNumber: number;
};

export type RowTwoValues = {
    catalogNumber: number;
    inclination: number;
    rightAscension: number;
    eccentricity: number;
    argumentOfPerigee: number;
    meanAnomaly: number;
    meanMotion: number;
    revolution: number;
};

export type TwoLineElement = Name & RowOneValues & RowTwoValues;
