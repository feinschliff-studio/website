import { STORYBLOK_ACCESS_TOKEN } from "$env/static/private";
import { init } from "$lib/storyblok";
import type { EntryGenerator } from "./$types";

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
