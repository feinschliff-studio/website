import { dev, version } from "$app/environment";
import type { MultilinkStoryblok } from "$storyblok/components";
import {
  apiPlugin,
  type ISbStoryData,
  type ISbStoryParams,
  type StoryblokClient,
  storyblokInit,
  useStoryblokApi,
} from "@storyblok/svelte";
import type { ISbComponentType, ISbLinkURLObject } from "storyblok-js-client";
import { components } from "virtual:$storyblok/components";

export async function init(accessToken: string) {
  storyblokInit({
    accessToken,
    use: [apiPlugin],
    bridge: dev || version === "preview",
    components,
    apiOptions: {
      https: true,
      region: "eu",
    },
  });

  return useStoryblokApi();
}

export async function loadStory<T extends ISbComponentType<V>, V extends string = string>(
  client: StoryblokClient,
  slug: string,
  params?: ISbStoryParams,
) {
  const { data } = await client.get(slug, {
    version: dev || version === "preview" ? "draft" : "published",
    resolve_links: "story",
    ...params,
  });
  const story: ISbStoryData<T> = data.story;
  const links = (data.links as ISbLinkURLObject[]).reduce<Map<string, ISbLinkURLObject>>(
    (links, link: ISbLinkURLObject) => links.set(link.uuid, link),
    new Map(),
  );

  return { story, links };
}

export function resolveLink(linkField: Exclude<MultilinkStoryblok, { linktype?: "asset" }>): string | undefined {
  const slug = linkField.story?.path
    ?? linkField.story?.full_slug
    ?? linkField.url
    ?? linkField.cached_url;

  return slug && slug.startsWith("/") ? slug : `/${slug}`;
}
