import { Plugin, ResolvedConfig, UserConfig } from 'vite';
import { PluginContext } from 'rollup';
import { basename, resolve } from 'path';
import { mkdir, readFile, stat, writeFile } from 'fs/promises';

interface Route {
    name: string;
    path: string;
    children?: Route[];
}

type ChangeFrequency =
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never';

type Config = Record<string, any> & {
    baseUrl: string;
    stripSuffix?: boolean;
    priority?: Record<string, number> | number;
    changeFrequency?: Record<string, ChangeFrequency> | ChangeFrequency;
};

export const sitemap = function sitemap(config: Config): Plugin {
    let entryPoints: Record<string, string>;
    let resolvedConfig: UserConfig;

    return {
        name: 'vite:sitemap',
        enforce: 'post',
        apply: 'build',

        config(config: Partial<UserConfig>): void {
            resolvedConfig = config;
            config.build = config.build || {};
            config.build.rollupOptions = config.build.rollupOptions || {};
        },

        configResolved(resolved: ResolvedConfig): void {
            const input = resolved.build.rollupOptions.input || {};

            if (!input) {
                return;
            }

            if (typeof input === 'string') {
                entryPoints = {
                    main: input,
                };

                return;
            }

            if (Array.isArray(input)) {
                entryPoints = input.reduce(
                    (carry, file) => ({
                        ...carry,
                        [basename(file)]: file,
                    }),
                    {} as Record<string, string>,
                );

                return;
            }

            entryPoints = input;
            // console.log('sitemap!', { resolved, target: resolved.build.rollupOptions.input });
        },

        async closeBundle(this: PluginContext): Promise<void> {
            const root = resolvedConfig.root || process.cwd();
            const dest = resolve(
                root,
                (resolvedConfig.build && resolvedConfig.build.outDir) || 'dist',
            );

            const routes = await getRoutes(entryPoints, config);
            const routesXML = getRoutesXML(routes);

            await mkdir(dest, { recursive: true });
            await writeFile(`${dest}/sitemap.xml`, routesXML);
        },
    };
};

function getRoutes(
    entryPoints: Record<string, string>,
    config: Config,
): Promise<SitemapRoute[]> {
    const changeFrequencies =
        typeof config.changeFrequency === 'string'
            ? Object.fromEntries(
                  Object.keys(entryPoints).map((entry) => [
                      entry,
                      config.changeFrequency as ChangeFrequency,
                  ]),
              )
            : config.changeFrequency || {};
    const priorities =
        typeof config.priority === 'number'
            ? Object.fromEntries(
                  Object.keys(entryPoints).map((entry) => [
                      entry,
                      config.priority as number,
                  ]),
              )
            : config.priority || {};

    return Promise.all(
        Object.entries(entryPoints).map(async ([path, file]) => {
            const { mtimeMs } = await stat(file);
            const lastModified = new Date(mtimeMs);
            const priority = priorities[path] || 0.5;
            const changeFrequency = changeFrequencies[path] || 'weekly';

            return {
                uri: new URL(path === 'index.html' ? '' : path, config.baseUrl),
                lastModified,
                changeFrequency,
                priority,
            };
        }),
    );
}

function getRoutesXML(routes: SitemapRoute[]): string {
    const list = routes
        .sort((a, b) => a.uri.toString().localeCompare(b.uri.toString()))
        .map(
            (route) => `<url>
    <loc>${route.uri.toString()}</loc>
    <lastmod>${route.lastModified.toISOString().split('T').shift()}</lastmod>
    <changefreq>${route.changeFrequency}</changefreq>
    <priority>${route.priority}</priority>
</url>`,
        )
        .join('\r\n');

    return `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
    ${list}
    </urlset>`;
}

interface SitemapRoute {
    uri: URL;
    lastModified: Date;
    priority: number;
    changeFrequency: ChangeFrequency;
}
