import SolarEclipseMapLayer from './SolarEclipseMapLayer';

export default class SunriseBoundary extends SolarEclipseMapLayer {
    private constructor(date: string) {
        super(date, {isSunriseLineVisible: true});
    }

    public static create(date: string): SunriseBoundary {
        return new SunriseBoundary(date);
    }
}
