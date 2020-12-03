import TimeOfInterest from '../../time/TimeOfInterest';

export enum Position {'north', 'south'}

export default interface IConjunction {
    toi: TimeOfInterest,
    position: Position,
    angularDistance: number,
}
