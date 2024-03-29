import { PUBLIC_STORYBLOK_ACCESS_TOKEN } from "$env/static/public";
import type { LayoutLoad } from "./$types";
import { init } from "$lib/storyblok";

export const ssr = true;

export const load: LayoutLoad = async function load({ data, fetch }) {
  const storyblokClient = await init(PUBLIC_STORYBLOK_ACCESS_TOKEN, fetch);

  return {
    ...data,
    storyblokClient,
  };
};
