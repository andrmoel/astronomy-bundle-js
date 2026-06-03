import {defineConfig, Options} from 'tsup';
import path from 'path';
import {copyFileSync, existsSync, readFileSync, writeFileSync} from 'fs';

const root = process.cwd();

const rootPkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf-8'));
const OMIT_FROM_DIST = ['private', 'workspaces', 'scripts', 'devDependencies'];

const aliasPlugin = {
    name: 'path-aliases',
    setup(build: any) {
        build.onResolve({filter: /^@(app|package)\//}, async (args: any) => {
            const mapped = args.path
                .replace(/^@app\//, './app/')
                .replace(/^@package\//, './packages/');
            return build.resolve(mapped, {kind: args.kind, resolveDir: root});
        });
    },
};

const shared: Partial<Options> = {
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    minify: true,
    sourcemap: true,
    esbuildPlugins: [aliasPlugin],
};

export default defineConfig([
    {
        ...shared,
        entry: {index: 'packages/core/index.ts'},
        outDir: 'packages/core/dist',
        async onSuccess() {
            writeDistPackageJson('packages/core');
            copyReadme('packages/core');
        },
    },
    {
        ...shared,
        entry: {index: 'packages/solarEclipse/index.ts'},
        outDir: 'packages/solarEclipse/dist',
        async onSuccess() {
            writeDistPackageJson('packages/solarEclipse');
            copyReadme('packages/solarEclipse');
        },
    },
]);

function copyReadme(packageDir: string): void {
    const pkgReadme = path.join(root, packageDir, 'README.md');
    const src = existsSync(pkgReadme) ? pkgReadme : path.join(root, 'README.md');
    copyFileSync(src, path.join(root, packageDir, 'dist/README.md'));
}

function writeDistPackageJson(packageDir: string): void {
    const srcPkg = JSON.parse(
        readFileSync(path.join(root, packageDir, 'package.json'), 'utf-8'),
    );
    const distPkg = {...rootPkg, ...srcPkg};
    OMIT_FROM_DIST.forEach((key) => delete distPkg[key]);
    Object.assign(distPkg, {
        main: './index.js',
        module: './index.mjs',
        types: './index.d.ts',
        exports: {
            '.': {
                types: './index.d.ts',
                import: './index.mjs',
                require: './index.js',
            },
        },
        files: ['*'],
        publishConfig: {access: 'public'},
    });
    writeFileSync(
        path.join(root, packageDir, 'dist/package.json'),
        JSON.stringify(distPkg, null, 2) + '\n',
    );
}

