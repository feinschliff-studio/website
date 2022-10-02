import { defineConfig, loadEnv } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        root: 'src/',
        envDir: '../',
        base: '/',

        build: {
            outDir: '../dist',
            sourcemap: true,
            manifest: true,
            emptyOutDir: true,
            reportCompressedSize: true,
        },

        plugins: [
            createHtmlPlugin({
                inject: {
                    data: {
                        googleTagId: env.VITE_ENV_GOOGLE_TAG_ID,
                        primaryColor: 'rgb(202, 194, 188)',
                    },
                },
            }),
        ],
    };
});
