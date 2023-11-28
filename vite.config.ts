import { sveltekit } from "@sveltejs/kit/vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { defineConfig } from "vite";
import storyblokComponentsPlugin from "./src/build/vite-plugin-storyblok-components";
import storyblokRedirectsPlugin from "./src/build/vite-plugin-storyblok-redirects.mjs";

export default defineConfig({
  plugins: [
    basicSsl(),
    storyblokComponentsPlugin({
      componentsPath: "src/lib/components/Blocks",
    }),
    storyblokRedirectsPlugin({
      datasource: "redirects",
    }),
    sveltekit(),
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
