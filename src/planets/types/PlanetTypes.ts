import TimeOfInterest from '../../time/TimeOfInterest';

export enum Position {
    North = 'north',
    South = 'south'
}

export type Conjunction = {
    toi: TimeOfInterest,
    position: Position,
    angularDistance: number,
}
