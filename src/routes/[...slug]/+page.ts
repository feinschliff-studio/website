import type { StoryblokError } from "$lib/storyblok";
import type { PageStoryblok } from "$storyblok/components";
import type { PageLoad } from "./$types";
import { dev, version } from "$app/environment";

export const load: PageLoad = async function load({ data, parent, params }) {
  if (dev || version.startsWith("preview")) {
    const { storyblokClient } = await parent();

    try {
      const { loadStory } = await import("$lib/storyblok");
      const { story } = await loadStory<PageStoryblok>(
        storyblokClient,
        `cdn/stories/${params.slug || "home"}`,
      );

      return { ...data, story };
    } catch (err) {
      if ((err as StoryblokError).status) {
        const { status, message } = err as StoryblokError;
        const { error } = await import("@sveltejs/kit");

        throw error(status, message);
      }

      throw err;
    }
  }

  return data;
};
