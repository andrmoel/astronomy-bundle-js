import TimeOfInterest from '../../time/TimeOfInterest';

export default interface EventInterface {
    getStartTime(): Promise<TimeOfInterest>;

    getMaximum(): Promise<TimeOfInterest>;

    getEndTime(): Promise<TimeOfInterest>;
}
