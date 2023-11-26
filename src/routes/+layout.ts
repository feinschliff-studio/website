import { dev, version } from "$app/environment";
import { PUBLIC_STORYBLOK_ACCESS_TOKEN } from "$env/static/public";
import { init } from "$lib/storyblok";
import type { CookieBannerStoryblok, SiteConfigStoryblok } from "$storyblok/components";
import type { StoryblokClient } from "@storyblok/svelte";
import type { Load } from "@sveltejs/kit";

export const ssr = true;

/**
 * If we're running in the browser, and the app is either in development mode or rendering a preview,
 * initialize the Storyblok client. This allows to update the preview in real-time.
 */
export const load: Load = async function load() {
  const storyblokClient = await init(PUBLIC_STORYBLOK_ACCESS_TOKEN);
  const [cookieBanner, siteConfig] = await Promise.all([
    loadCookieBanner(storyblokClient),
    loadSiteConfig(storyblokClient),
  ]);

  return {
    storyblokClient,
    cookieBanner,
    siteConfig,
  };
};

async function loadSiteConfig(storyblokClient: StoryblokClient): Promise<SiteConfigStoryblok> {
  const response = await storyblokClient.get("cdn/stories/_settings", {
    version: dev || version === "preview" ? "draft" : "published",
  });

  return response.data.story.content;
}

async function loadCookieBanner(storyblokClient: StoryblokClient): Promise<CookieBannerStoryblok> {
  const response = await storyblokClient.get("cdn/stories/_cookie-banner", {
    version: dev || version === "preview" ? "draft" : "published",
  });

  return response.data.story.content;
}
