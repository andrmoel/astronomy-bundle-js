import SolarEclipseMapLayer from './SolarEclipseMapLayer';

export default class PenumbraPath extends SolarEclipseMapLayer {
    private constructor(date: string) {
        super(date, {isPenumbraVisible: true});
    }

    public static create(date: string): PenumbraPath {
        return new PenumbraPath(date);
    }
}
