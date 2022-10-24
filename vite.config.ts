import { readFile } from 'fs/promises';
import { defineConfig, loadEnv } from 'vite';
import { LocalBusiness, Thing } from 'schema-dts';
import { sitemap } from './src/plugins/vite-plugin-sitemap';
import { mpa } from './src/plugins/vite-plugin-mpa';
import { join, parse, resolve } from 'path';
import { ViteEjsPlugin } from 'vite-plugin-ejs';

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
                /*
                input: {
                    'main': resolve(__dirname + '/src/pages/index.html'),
                    'pages/x/contact': resolve(
                        __dirname + '/src/pages/contact.html',
                    ),
                    'privacy': resolve(__dirname + '/src/pages/privacy.html'),
                    'imprint': resolve(__dirname + '/src/pages/imprint.html'),
                },
                input: {
                    main: resolve(__dirname + '/src/pages/index.html'),
                    ...entryPoints(
                        'src/pages/contact.html',
                        'src/pages/privacy.html',
                        'src/pages/imprint.html',
                    )
                }
*/
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
                        href: '/contact.html',
                        label: 'Kontakt',
                    },
                    {
                        href: '/privacy.html',
                        label: 'Datenschutz',
                    },
                    {
                        href: '/imprint.html',
                        label: 'Impressum',
                    },
                ],
            },
        },

        plugins: [
            mpa({}),

            sitemap({
                baseUrl: schema.url,
            }),

            ViteEjsPlugin({
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
                            href: '/contact.html',
                            label: 'Kontakt',
                        },
                        {
                            href: '/privacy.html',
                            label: 'Datenschutz',
                        },
                        {
                            href: '/imprint.html',
                            label: 'Impressum',
                        },
                    ],
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

function entryPoints(...paths: string[]): Record<string, string> {
    const entries = paths.map(parse).map((entry) => {
        const { dir, base, name } = entry;
        const key = join(dir, name);
        const path = resolve(__dirname, dir, base);

        return [key, path];
    });

    return Object.fromEntries(entries);
}
