<script context="module" lang="ts">
  import type { PageStoryblok } from "$storyblok/components";
  import type { ISbStoryData } from "@storyblok/svelte";
  import type { ISbLinkURLObject } from "storyblok-js-client";

  export type PageContext = {
    getLinks(): ISbLinkURLObject[];
    getStory(): ISbStoryData<PageStoryblok>;
  };
</script>

<script lang="ts">
  import { dev, version } from "$app/environment";
  import { StoryblokComponent, useStoryblokBridge } from "@storyblok/svelte";
  import { onMount, setContext } from "svelte";
  import type { PageData } from "./$types";
  import { serializeSchema } from "$lib/schema";

  if (dev || version.startsWith("preview")) {
    onMount(() => {
      if (data.story) {
        useStoryblokBridge(data.story.id, (newStory) => (data.story = newStory), {
          resolveLinks: "url",
        });
      }
    });
  }

  export let data: PageData;
  $: links = data.links;
  $: story = data.story;
</script>

<svelte:head>
  <title>{data.title}</title>
  {@html serializeSchema(data.schema)}
</svelte:head>

<div>
  {#if story}
    <StoryblokComponent blok={story.content} />
  {/if}
</div>

