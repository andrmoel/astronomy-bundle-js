import type TimeOfInterest from '@package/time/models/TimeOfInterest';

export type TwoLineElement = {
    name: string | null;
    satelliteNumber: number;
    classification: string;
    internationalDesignator: string;
    epoch: TimeOfInterest;
    meanMotionFirstDerivative: number;
    meanMotionSecondDerivative: number;
    bstarDragTerm: number;
    ephemerisType: number;
    elementSetNumber: number;
    inclination: number;
    rightAscensionOfAscendingNode: number;
    eccentricity: number;
    argumentOfPerigee: number;
    meanAnomaly: number;
    meanMotion: number;
    revolutionNumber: number;
};
