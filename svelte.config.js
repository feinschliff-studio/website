import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/kit/vite";
import process from "node:process";

/** @type {import("@sveltejs/kit").Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess({}),

  kit: {
    adapter: adapter(),

    csp: {
      mode: "auto",
      directives: {
        "script-src": [
          "self",
          "https://*.storyblok.com",
          "https://maps.googleapis.com",
          "https://static.cloudflareinsights.com",
        ],
        "frame-ancestors": ["self", "https://app.storyblok.com"],
      },
    },

    version: {
      name: process.env.NODE_ENV === "production"
        ? process.env.CF_PAGES_BRANCH === "main"
          ? "production:" + process.env.CF_PAGES_COMMIT_SHA
          : "preview:" + process.env.CF_PAGES_COMMIT_SHA
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
  },
};

export default config;
