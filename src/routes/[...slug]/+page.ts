import type { PageStoryblok } from "$storyblok/components";
import type { PageLoad } from "./$types";
import { dev, version } from "$app/environment";

export const load: PageLoad = async function load({ data, parent, params }) {
  if (dev || version.startsWith("preview")) {
    const { storyblokClient } = await parent();

    try {
      const { loadStory } = await import("$lib/storyblok");
      const slug = params.slug || "home";
      const { story } = await loadStory<PageStoryblok>(storyblokClient, slug);

      return { ...data, story };
    } catch (error) {
      const [{ error: respondWithError }, { isStoryblokError }] = await Promise.all([
        import("@sveltejs/kit"),
        import("$lib/storyblok"),
      ]);

      if (isStoryblokError(error)) {
        const { status, message } = error;

        throw respondWithError(status, message);
      }

      throw error;
    }
  }

  return data;
};
