import { dev, version } from "$app/environment";
import type { MultilinkStoryblok } from "$storyblok/components";
import { apiPlugin, type StoryblokClient, storyblokInit, useStoryblokApi } from "@storyblok/svelte";
import type { ISbComponentType, ISbError, ISbStory, ISbStoryData, ISbStoryParams } from "storyblok-js-client";
import { components } from "virtual:$storyblok/components";

export async function init(accessToken: string, fetch?: typeof window.fetch) {
  storyblokInit({
    accessToken,
    use: [apiPlugin],
    bridge: dev || version.startsWith("preview"),
    components,
    apiOptions: {
      https: true,
      region: "eu",
      fetch,
    },
  });

  return useStoryblokApi();
}

export async function loadStory<T extends ISbComponentType<V>, V extends string = string>(
  client: StoryblokClient,
  slug: string,
  params?: ISbStoryParams,
) {
  let result: ISbStory;

  try {
    result = await client.getStory(slug, {
      version: dev || version.startsWith("preview") ? "draft" : "published",
      resolve_links: "link",
      ...params,
    });
  } catch (error) {
    if (typeof error !== "string") {
      throw error;
    }

    const errorData = JSON.parse(error) as ISbError;
    const message = `Failed to fetch story "${slug}" from Storyblok API: ${errorData.message}` +
      (errorData.response ? `: ${errorData.response}` : "");

    throw new StoryblokError(message, errorData.status ?? 500);
  }

  const { data } = result;
  const story = data.story as ISbStoryData<T>;

  return { story };
}

export function resolveLink(linkField: Exclude<MultilinkStoryblok, { linktype?: "asset" }>): string | undefined {
  const slug = linkField.story?.path
    ?? linkField.story?.real_path
    ?? linkField.story?.url
    ?? linkField.story?.full_slug
    ?? linkField.url
    ?? linkField.cached_url;

  return slug && slug.startsWith("/") ? slug : `/${slug}`;
}

export class StoryblokError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    Error.captureStackTrace(this, StoryblokError);
  }
}

export function isStoryblokError(error: unknown): error is StoryblokError {
  return !!(error && typeof error === "object" && "status" in error);
}
