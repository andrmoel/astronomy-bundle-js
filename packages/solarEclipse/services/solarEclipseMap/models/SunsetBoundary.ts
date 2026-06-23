import SolarEclipseMapLayer from './SolarEclipseMapLayer';

export default class SunsetBoundary extends SolarEclipseMapLayer {
    private constructor(date: string) {
        super(date, {isSunsetLineVisible: true});
    }

    public static create(date: string): SunsetBoundary {
        return new SunsetBoundary(date);
    }
}
