import type {LdemGeometry} from '../types/LdemTypes';
import type {LunarLibration} from '../types/LunarLimbTypes';
import {parseLdemLabel} from '../utils/ldemLabel';
import {getLimbHeightKm} from '../utils/limbProfile';

export default class LunarLimbProfile implements LunarLimbProfile {
    private grid: Int16Array | null = null;

    private constructor(
        private readonly imgData: Uint8Array,
        private readonly geometry: LdemGeometry,
    ) {}

    public static create(imgData: Uint8Array, label: string): LunarLimbProfile {
        return new LunarLimbProfile(imgData, parseLdemLabel(label));
    }

    public getReferenceRadiusKm(): number {
        return this.geometry.referenceRadiusM / 1000;
    }

    public getLimbHeightKm(
        positionAngleDeg: number,
        libration: LunarLibration,
        axisPositionAngleDeg: number,
        observerDistanceKm: number,
    ): number {
        return getLimbHeightKm(
            this.loadGrid(),
            this.geometry,
            positionAngleDeg,
            libration,
            axisPositionAngleDeg,
            observerDistanceKm,
        );
    }

    private loadGrid(): Int16Array {
        if (this.grid !== null) {
            return this.grid;
        }

        const {rows, cols} = this.geometry;
        if (this.imgData.length !== rows * cols * 2) {
            throw new Error(`LDEM size mismatch: expected ${rows * cols * 2}, got ${this.imgData.length}`);
        }
        this.grid = new Int16Array(this.imgData.buffer, this.imgData.byteOffset, rows * cols);

        return this.grid;
    }
}
