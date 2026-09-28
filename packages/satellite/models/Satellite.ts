import type {TwoLineElement} from '../types/SatelliteTypes';
import {parseTwoLineElement} from '../utils/twoLineElement';

export default class Satellite {
    private constructor(public readonly tle: TwoLineElement) {}

    public static fromTLE(tle: string): Satellite {
        return new Satellite(parseTwoLineElement(tle));
    }
}
