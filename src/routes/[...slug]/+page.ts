import { loadStory, StoryblokError } from "$lib/storyblok";
import type { PageStoryblok } from "$storyblok/components";
import type { StoryblokClient } from "@storyblok/svelte";
import type { PageLoad } from "./$types";
import { error } from "@sveltejs/kit";

export const load: PageLoad = async function load({ parent, params }) {
  const { storyblokClient } = await parent() as { storyblokClient: StoryblokClient };

  try {
    const { story, links } = await loadStory<PageStoryblok>(
      storyblokClient,
      `cdn/stories/${params.slug || "home"}`,
    );

    return { story, links };
  } catch (err) {
    if (err instanceof StoryblokError) {
      throw error(err.status, err.message);
    }

    throw err;
  }
};
