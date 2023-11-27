import { apiPlugin, type ISbResult, type StoryblokClient, storyblokInit } from "@storyblok/js";
import { mkdir, writeFile } from "fs/promises";
import { resolve } from "node:path";
import type { Plugin } from "vite";
import "dotenv/config";

interface PluginOptions {
  datasource: string;
}

async function initStoryblokApi(accessToken: string): Promise<StoryblokClient> {
  const { storyblokApi } = storyblokInit({
    accessToken,
    use: [apiPlugin],
    apiOptions: {
      https: true,
      region: "eu",
    },
  });

  return storyblokApi as StoryblokClient;
}

export function generateRedirectsPlugin({ datasource }: PluginOptions): Plugin {
  let client: StoryblokClient;
  let outputPath: string;

  return {
    name: "vite-plugin-storyblok-redirects",

    async configResolved(resolvedConfig) {
      outputPath = resolve(resolvedConfig.root, resolvedConfig.build.outDir);
      const token = process.env.STORYBLOK_ACCESS_TOKEN;

      if (!token) {
        throw new Error("STORYBLOK_ACCESS_TOKEN is not defined: Could not write _redirects file");
      }

      client = await initStoryblokApi(token);
    },

    async closeBundle() {
      let response: ISbResult;

      try {
        response = await client.get(`cdn/datasource_entries`, {
          dimension: "status",
          per_page: 100,
          datasource,
        });
      } catch (error) {
        this.error(`Could not fetch redirects from Storyblok: ${error}`);
      }

      // noinspection JSUnresolvedReference
      const datasourceEntries = response.data.datasource_entries as {
        id: number;
        name: string;
        value: string;
        dimension_value: string | null;
      }[];

      const redirects = datasourceEntries.map(
        ({
           name,
           value,
           dimension_value,
         }) => `${name} ${value} ${dimension_value ?? 302}`,
      );
      const redirectsFile = resolve(outputPath, "_redirects");

      await mkdir(outputPath, { recursive: true });
      await writeFile(redirectsFile, redirects.join("\n"), "utf-8");
    },
  };
}

export default generateRedirectsPlugin;
