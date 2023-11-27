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
  import type { WebPage, WithContext } from "schema-dts";
  import JsonLd from "$lib/components/JsonLd.svelte";

  if (dev || version === "preview") {
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

  setContext("page", {
    getLinks() {
      return links;
    },
    getStory() {
      return story;
    },
  });

  $: schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": story.name,
  } satisfies WithContext<WebPage>;
</script>

<svelte:head>
  <title>{story.name}</title>
</svelte:head>

<div>
  {#if story}
    <StoryblokComponent blok={story.content} />
  {/if}

  <JsonLd schema={schema} />
</div>

