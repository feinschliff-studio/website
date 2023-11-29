import { STORYBLOK_ACCESS_TOKEN } from "$env/static/private";
import { init, isStoryblokError, loadStory } from "$lib/storyblok";
import type { EntryGenerator, PageServerLoad } from "./$types";
import type { PageStoryblok } from "$storyblok/components";
import { error as respondWithError } from "@sveltejs/kit";
import type { WebPage, WithContext } from "schema-dts";

export const entries: EntryGenerator = async function entries() {
  const storyblokClient = await init(STORYBLOK_ACCESS_TOKEN);
  const stories = await storyblokClient.getStories({
    content_type: "Page",
    version: "published",
    per_page: 100,
  });

  return stories.data.stories.map((story) => ({
    slug: (story.path ?? story.full_slug ?? story.slug).replace(/^\/|\/$/g, ""),
  }));
};

export const load: PageServerLoad = async function load({ parent, params, fetch }) {
  const parentData = await parent();
  const storyblokClient = await init(STORYBLOK_ACCESS_TOKEN, fetch);

  try {
    const slug = params.slug || "home";
    const { story } = await loadStory<PageStoryblok>(storyblokClient, slug);

    const schema: WithContext<WebPage> = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": story.name,
    };

    return {
      title: `${story.name} | ${parentData.siteConfig.companyName}`,
      schema,
      story,
    };
  } catch (error) {
    if (isStoryblokError(error)) {
      const { status, message } = error;

      throw respondWithError(status, message);
    }

    throw error;
  }
};
