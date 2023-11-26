import { loadStory } from "$lib/storyblok";
import type { PageStoryblok } from "$storyblok/components";
import type { StoryblokClient } from "@storyblok/svelte";
import type { PageLoad } from "./$types";

export const load: PageLoad = async function load({ parent, params }) {
  const { storyblokClient } = await parent() as { storyblokClient: StoryblokClient };
  const { story, links } = await loadStory<PageStoryblok>(
    storyblokClient,
    `cdn/stories/${params.slug || "home"}`,
  );

  return { story, links };
};
