import {copyFileSync, existsSync, readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import type {OnResolveArgs, PluginBuild} from 'esbuild';
import {defineConfig, type Options} from 'tsup';
import packages from './packages.config';

const root = process.cwd();

const rootPkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf-8'));
const OMIT_FROM_DIST = ['private', 'workspaces', 'scripts', 'devDependencies'];

const aliasPlugin = {
    name: 'path-aliases',
    setup(build: PluginBuild) {
        build.onResolve({filter: /^@(app|package)\//}, async (args: OnResolveArgs) => {
            const mapped = args.path.replace(/^@app\//, './app/').replace(/^@package\//, './packages/');
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

const EXTRA_ENTRIES = ['high-precision', 'catalogue', 'catalogue-full'];

export default defineConfig(
    packages.map((pkg) => {
        const entry: Record<string, string> = {index: `${pkg}/index.ts`};
        for (const extra of EXTRA_ENTRIES) {
            if (existsSync(path.join(root, `${pkg}/index.${extra}.ts`))) {
                entry[extra] = `${pkg}/index.${extra}.ts`;
            }
        }
        return {
            ...shared,
            entry,
            outDir: `${pkg}/dist`,
            async onSuccess() {
                writeDistPackageJson(pkg);
                copyReadme(pkg);
            },
        };
    }),
);

function copyReadme(packageDir: string): void {
    const pkgReadme = path.join(root, packageDir, 'README.md');
    const src = existsSync(pkgReadme) ? pkgReadme : path.join(root, 'README.md');
    copyFileSync(src, path.join(root, packageDir, 'dist/README.md'));
}

function writeDistPackageJson(packageDir: string): void {
    const srcPkg = JSON.parse(readFileSync(path.join(root, packageDir, 'package.json'), 'utf-8'));
    const distPkg = {...rootPkg, ...srcPkg};

    for (const key of OMIT_FROM_DIST) {
        delete distPkg[key];
    }

    const exports: Record<string, object> = {
        '.': {
            types: './index.d.ts',
            import: './index.mjs',
            require: './index.js',
        },
    };
    for (const extra of EXTRA_ENTRIES) {
        if (existsSync(path.join(root, packageDir, `index.${extra}.ts`))) {
            exports[`./${extra}`] = {
                types: `./${extra}.d.ts`,
                import: `./${extra}.mjs`,
                require: `./${extra}.js`,
            };
        }
    }
    Object.assign(distPkg, {
        main: './index.js',
        module: './index.mjs',
        types: './index.d.ts',
        exports: exports,
        files: ['*'],
        publishConfig: {access: 'public'},
    });
    writeFileSync(path.join(root, packageDir, 'dist/package.json'), `${JSON.stringify(distPkg, null, 2)}\n`);
}
