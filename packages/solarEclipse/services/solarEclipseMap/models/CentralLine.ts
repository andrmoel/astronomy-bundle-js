import SolarEclipseMapLayer from './SolarEclipseMapLayer';

export default class CentralLine extends SolarEclipseMapLayer {
    private constructor(date: string) {
        super(date, {isCentralLineVisible: true});
    }

    public static create(date: string): CentralLine {
        return new CentralLine(date);
    }
}
