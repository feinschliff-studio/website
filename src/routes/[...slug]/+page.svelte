<script lang="ts">
  import { dev, version } from "$app/environment";
  import { StoryblokComponent } from "@storyblok/svelte";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import { serializeSchema } from "$lib/schema";

  if (dev || version.startsWith("preview")) {
    onMount(async () => {
      const { useStoryblokBridge } = await import("@storyblok/svelte");

      if (data.story) {
        useStoryblokBridge(data.story.id, (newStory) => (data.story = newStory), {
          resolveLinks: "url",
        });
      }
    });
  }

  export let data: PageData;
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

