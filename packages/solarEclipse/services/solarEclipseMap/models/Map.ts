export default class BaseMap {
    private constructor(private readonly path: string) {}

    public static create(path: string): BaseMap {
        return new BaseMap(path);
    }

    public getPath(): string {
        return this.path;
    }
}
