import { readFile } from 'fs/promises';
import { defineConfig, loadEnv } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { LocalBusiness, Thing } from 'schema-dts';

export default defineConfig(async ({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const schema = await loadSchema<LocalBusiness>('./schema.json');

    return {
        root: 'src/',
        envDir: '../',
        publicDir: 'public/',
        cacheDir: 'cache/',
        base: '/',
        appType: 'mpa',

        server: {
            strictPort: true,
            port: 3000,
        },

        css: {
            devSourcemap: true,
        },

        optimizeDeps: {
            esbuildOptions: {
                keepNames: true,
            },
        },

        build: {
            outDir: '../dist',
            sourcemap: true,
            manifest: true,
            emptyOutDir: true,
            reportCompressedSize: true,
        },

        define: {
            schema,
        },

        plugins: [
            createHtmlPlugin({
                inject: {
                    data: {
                        googleTagEnabled: flagEnabled(
                            env.VITE_GOOGLE_TAG_ENABLED?.toLowerCase(),
                        ),
                        googleTagId: env.VITE_GOOGLE_TAG_ID,
                        primaryColor: 'rgb(202, 194, 188)',
                        localBusinessSchema: schema,
                        geoMapId: env.VITE_GEO_MAP_ID,
                    },
                },
            }),
        ],
    };
});

function flagEnabled(value: string): boolean {
    return ['true', 'on', 'yes', '1'].includes(value);
}

async function loadSchema<T extends Thing>(path: string): Promise<T> {
    const schema = await readFile(path, 'utf-8');

    return JSON.parse(schema);
}
