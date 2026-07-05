import type {LdemGeometry} from '../types/LdemTypes';
import {getLimbHeightKm} from './limbProfile';

const geometry: LdemGeometry = {
    rows: 180,
    cols: 360,
    degPerPixel: 1,
    latFirst: 89.5,
    lonFirst: 0.5,
    scalingFactorM: 0.5,
    referenceRadiusM: 1737400,
};

const libration = {longitude: 2.0, latitude: -0.1};

it('reports ~zero height above the reference sphere for flat terrain', () => {
    const flat = new Int16Array(geometry.rows * geometry.cols); // all zeros -> surface on the sphere

    for (let pa = 0; pa < 360; pa += 30) {
        expect(getLimbHeightKm(flat, geometry, pa, libration, 340, 380000)).toBeCloseTo(0, 2);
    }
});

it('lifts the silhouette by a uniform terrain elevation', () => {
    const dn = 4000; // 4000 * 0.5 m = 2 km everywhere
    const raised = new Int16Array(geometry.rows * geometry.cols).fill(dn);

    const height = getLimbHeightKm(raised, geometry, 90, libration, 340, 380000);

    expect(height).toBeGreaterThan(1.9);
    expect(height).toBeLessThan(2.1);
});
