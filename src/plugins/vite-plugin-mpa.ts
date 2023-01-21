import type { Plugin, UserConfig } from 'vite';
import history from 'connect-history-api-fallback';
import { resolve, basename, dirname, extname, join } from 'path';
import { mkdir, rename, rm, unlink } from 'fs/promises';
import { cwd } from 'process';
import fg from 'fast-glob';
import type { Rewrite } from 'connect-history-api-fallback';

export const mpa = function mpa(userOptions: UserOptions = {}): Plugin {
    const options = {
        open: '',
        scanDir: 'pages',
        scanFile: 'main.{js,ts,jsx,tsx}',
        defaultEntries: '',
        filename: 'index.html',
        rewrites: [],
        ...userOptions,
    };

    let resolvedConfig: UserConfig;

    return {
        name: 'vite:mpa',
        enforce: 'pre',

        async config(config: Partial<UserConfig>): Promise<void> {
            resolvedConfig = config;
            config.build = config.build || {};
            config.server = config.server || {};
            config.build.rollupOptions = config.build.rollupOptions || {};
            config.build.rollupOptions.input = await resolveAppInput(
                config.root || cwd(),
                options,
            );

            // default '' means first-page and you can customized or disabled.
            config.server.open =
                options.open === ''
                    ? getFirstPage(config.build.rollupOptions.input)
                    : options.open;
        },

        async configureServer({ middlewares: app }): Promise<void> {
            app.use(
                // @see https://github.com/vitejs/vite/blob/8733a83d291677b9aff9d7d78797ebb44196596e/packages/vite/src/node/server/index.ts#L433
                // @ts-ignore
                history({
                    verbose:
                        Boolean(process.env.DEBUG) &&
                        process.env.DEBUG !== 'false',
                    disableDotRule: undefined,
                    htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
                    rewrites: await getHistoryReWriteRuleList(
                        resolvedConfig.root || cwd(),
                        options,
                    ),
                }),
            );
        },

        async closeBundle(): Promise<void> {
            const root = resolvedConfig.root || process.cwd();
            const dest = resolve(
                root,
                (resolvedConfig.build && resolvedConfig.build.outDir) || 'dist',
            );

            // 1. rename all xxx.html to index.html if needed
            if (options.filename !== 'index.html') {
                await fg(resolve(`${dest}/${options.scanDir}/**/*.html`)).then(
                    (files) =>
                        files
                            .map((file) => resolve(dest, file))
                            .map((path) =>
                                rename(
                                    path,
                                    path.replace(
                                        options.filename,
                                        'index.html',
                                    ),
                                ),
                            ),
                );
            }

            // 2. remove all *.html at dest root
            await fg(resolve(`${dest}/*.html`)).then((files) =>
                files.forEach((file) => unlink(resolve(dest, file))),
            );

            // 3. move src/pages/* to dest root
            await fg(resolve(`${dest}/${options.scanDir}/**/*`)).then((files) =>
                files.map(async (file) => {
                    const outputPath = resolve(
                        dest,
                        file
                            .replace(resolve(dest, options.scanDir), '')
                            .replace(/^\//, ''),
                    );

                    await mkdir(dirname(outputPath), {
                        recursive: true,
                    });

                    rename(resolve(dest, file), outputPath);
                }),
            );

            // 4. remove empty src dir
            await rm(resolve(`${dest}/${options.scanDir}`), {
                recursive: true,
                force: true,
            });
        },

        transformIndexHtml(html, context): string {
            const referencedAssets = Object.fromEntries(
                Object.entries(context.bundle || {})
                    .filter(([k]) => k.startsWith('assets'))
                    .map(([k, v]) => [
                        // Extract the hash from "assets/e.[a6558b35].jpg"
                        k.split('/', 2).pop().split('.').slice(-2, -1),
                        v.fileName,
                    ]),
            );

            return html.replace(
                /__VITE_ASSET__(.[a-z0-9]+)__/gi,
                (full, match) => {
                    if (!(match in referencedAssets)) {
                        return full;
                    }

                    return join(resolvedConfig.base, referencedAssets[match]);
                },
            );
        },
    };
};

/**
 * return first page path
 */
function getFirstPage(pages: Record<string, string>): string {
    if ('index.html' in pages) {
        return '/index.html';
    }

    const firstPageName = Object.keys(pages)[0];
    return `/${firstPageName}/index.html`;
}

function generateFileName(pageName: string, path: string): string {
    const xPath = path === '' ? '' : `${path}/`;

    // TODO: Why is pages/ replaced here?
    return `${xPath}${pageName}.html`.replace(/^pages\//, '');
}

function scanFile2Html(current: string, scanFile: string, filename: string) {
    // support main.ts & main.{ts,js}
    const expression = `${scanFile.split('.')[0]}[.](.*)`;
    const entryExpression = new RegExp(expression);

    return current.replace(entryExpression, filename);
}

async function getPagesInfo(
    root: string,
    { scanDir }: MpaOptions,
): Promise<PageInfo> {
    const path = resolve(root, scanDir);
    const files = await fg(`${path}/**`.replace('//', '/'));

    return files
        .map((entry: string) => ({
            pageName: basename(entry, extname(entry)),
            pagePath: entry.replace(path + '/', ''),
            outputPath: dirname(entry),
            entry,
        }))
        .reduce(
            (carry, { entry, pageName, pagePath, outputPath }) => ({
                ...carry,
                [pagePath]: {
                    filename: generateFileName(pageName, outputPath),
                    entry,
                },
            }),
            {},
        );
}

async function resolveAppInput(
    root: string,
    options: MpaOptions,
): Promise<Record<string, string>> {
    const { scanFile, filename } = options;
    const pages = await getPagesInfo(root, options);

    return Object.entries(pages).reduce(
        (carry, [page, { entry }]) => ({
            ...carry,
            [page]: resolve(scanFile2Html(entry, scanFile, filename)),
        }),
        {},
    );
}

/**
 * history rewrite list
 */
async function getHistoryReWriteRuleList(
    root: string,
    options: MpaOptions,
): Promise<Rewrite[]> {
    const { scanDir, scanFile, filename, rewrites } = options;
    const basePath = resolve(root);
    const pages = await getPagesInfo(root, options);
    const list: Rewrite[] = [
        ...rewrites,
        {
            from: /^\/$/,
            to: `/${scanDir}/${filename}`,
        },
    ];

    return Object.entries(pages).reduce((carry, [pageName, { entry }]) => {
        const to = scanFile2Html(entry, scanFile, filename).replace(
            basePath,
            '',
        );
        const variants = [
            `^/${pageName}/index.html/*`, // handle html5 history mode fallback
            `^/${pageName}/index.html$`, // support pageName/index.html
            `^\/${pageName}.html$`, // support pageName.html, not recommended
            `^\/${pageName}$`, // support pageName, not recommended
            `^/${pageName}/`, // support pageName/{pages}
        ].map((uri) => ({
            from: new RegExp(uri),
            to,
        }));

        return carry.concat(variants);
    }, list);
}

type PageInfo = Record<
    string,
    {
        entry: string;
        filename: string;
    }
>;

export interface MpaOptions {
    /**
     * open path for viteDevServer
     * this plugin will try to open first page for you, but you can still custom, e.g. /index#/about
     * @default firstPagePath
     */
    open: string | boolean;

    /**
     * where to scan
     * @default 'src/pages'
     */
    scanDir: string;

    /**
     * scanFile
     * @default 'main.{js,ts,jsx,tsx}'
     */
    scanFile: string;

    /**
     * html filename, yarn crate @vitejs/app => projectRoot/index.html or MPA projectRoot/pages/${pageName}/index.html
     * @default 'index.html'
     */
    filename: string;

    /**
     * default included entry
     * @default ''
     */
    defaultEntries: string;

    /**
     * rewrite rule list
     * @default []
     */
    rewrites: Rewrite[];
}

type UserOptions = Partial<MpaOptions>;
