import { sveltekit } from "@sveltejs/kit/vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { defineConfig } from "vite";
import fontDownload from "vite-plugin-webfont-dl";
import storyblokComponentsPlugin from "./src/build/vite-plugin-storyblok-components";
import storyblokRedirectsPlugin from "./src/build/vite-plugin-storyblok-redirects.mjs";

export default defineConfig({
  plugins: [
    basicSsl(),
    storyblokComponentsPlugin({
      componentsPath: "src/lib/components/Blocks",
    }),
    storyblokRedirectsPlugin({
      datasource: 'redirects'
    }),
    sveltekit(),
    fontDownload(),
  ],

  server: {
    https: true,
    strictPort: true,
  },

  build: {
    sourcemap: true,
    reportCompressedSize: true,
  },

  css: {
    devSourcemap: true,
  },
});
