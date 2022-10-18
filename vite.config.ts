import { readFile } from 'fs/promises';
import { defineConfig, loadEnv } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import { LocalBusiness, Thing } from 'schema-dts';
import { resolve } from 'path'

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

            rollupOptions: {
                input: {
                    main: resolve(__dirname + '/pages/index.html'),
                    contact: resolve(__dirname + '/pages/contact.html'),
                    privacy: resolve(__dirname + '/pages/privacy.html'),
                    imprint: resolve(__dirname + '/pages/imprint.html'),
                },
            },
        },

        define: {
            schema,
            vars: {
                primaryColor: 'rgb(202, 194, 188)',
                localBusinessSchema: schema,
                geoMapId: env.VITE_GEO_MAP_ID,
                googleTagId: env.VITE_GOOGLE_TAG_ID,
                googleTagEnabled: flagEnabled(
                    env.VITE_GOOGLE_TAG_ENABLED?.toLowerCase(),
                ),
                footerLinks: [
                    {
                        href: '/pages/contact.html',
                        label: 'Kontakt',
                    },
                    {
                        href: '/pages/privacy.html',
                        label: 'Datenschutz',
                    },
                    {
                        href: '/pages/imprint.html',
                        label: 'Impressum',
                    },
                ],
            },
        },

        plugins: [
            createHtmlPlugin({
                pages: [
                    {
                        entry: 'src/main.ts',
                        filename: 'index.html',
                        template: 'pages/index.html',
                    },
                    {
                        entry: 'src/main.ts',
                        filename: 'contact.html',
                        template: 'pages/contact.html',
                    },
                    {
                        entry: 'src/main.ts',
                        filename: 'privacy.html',
                        template: 'pages/privacy.html',
                    },
                    {
                        entry: 'src/main.ts',
                        filename: 'imprint.html',
                        template: 'pages/imprint.html',
                    },
                ],
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
