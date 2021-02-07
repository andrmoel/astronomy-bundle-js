import TimeOfInterest from '../time/TimeOfInterest';

export enum Position {'north', 'south'}

export type Conjunction = {
    toi: TimeOfInterest,
    position: Position,
    angularDistance: number,
}
