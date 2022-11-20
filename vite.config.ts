import { readFile } from 'fs/promises';
import { defineConfig, loadEnv } from 'vite';
import { LocalBusiness, Thing } from 'schema-dts';
import { sitemap } from './src/plugins/vite-plugin-sitemap';
import { mpa } from './src/plugins/vite-plugin-mpa';
import fontDownload from 'vite-plugin-webfont-dl';
import { join, parse, resolve } from 'path';
import { ViteEjsPlugin } from 'vite-plugin-ejs';
import { fileURLToPath, URL } from 'node:url';

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
            rollupOptions: {},
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

            fontDownload(
                [
                    'https://fonts.googleapis.com/css2?family=Jost:wght@400;500;700&family=Source+Sans+Pro:wght@300;400&display=swap',
                ],
                {},
            ),

            ViteEjsPlugin(
                {
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
                {
                    ejs: {
                        async: false,
                        includer(path) {
                            const root = fileURLToPath(
                                new URL('./src', import.meta.url),
                            );
                            const filename = resolve(root, path);

                            return { filename };
                        },
                    },
                },
            ),
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
