import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/kit/vite";
import { env } from "node:process";

/** @type {import("@sveltejs/kit").Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess({}),

  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: adapter(),

    csp: {
      mode: "auto",
      directives: {
        "script-src": [
          "'self'",
          "https://*.storyblok.com",
          "https://maps.googleapis.com",
          "https://static.cloudflareinsights.com",
        ],
      },
    },

    version: {
      name: env.NODE_ENV === "production"
        ? env.CF_PAGES_BRANCH === "main"
          ? "production:" + env.CF_PAGES_COMMIT_SHA
          : "preview:" + env.CF_PAGES_COMMIT_SHA
        : "development",
    },

    alias: {
      "$routes": "./src/routes",
      "@storyblok/svelte": "./node_modules/@storyblok/svelte",
      "$storyblok": ".storyblok",
      "$storyblok/*": ".storyblok/*",
    },

    prerender: {
      crawl: true,
      concurrency: 20,
      handleHttpError: "fail",
    },
  },
  compilerOptions: {
    enableSourcemap: true,
    sourcemap: true,
  },
};

export default config;
