import SolarEclipseMapLayer from './SolarEclipseMapLayer';

export default class UmbraPath extends SolarEclipseMapLayer {
    private constructor(date: string) {
        super(date, {isUmbraVisible: true});
    }

    public static create(date: string): UmbraPath {
        return new UmbraPath(date);
    }
}
