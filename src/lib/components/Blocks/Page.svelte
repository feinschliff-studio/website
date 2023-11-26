<script lang="ts">
  import type { PageStoryblok } from "$storyblok/components";
  import { StoryblokComponent, storyblokEditable } from "@storyblok/svelte";

  export let blok: PageStoryblok;
  $: body = blok.body ?? [];
</script>

{#key blok}
  <div use:storyblokEditable={blok}>
    <main>
      {#each body as bodyBlok}
        <StoryblokComponent blok={bodyBlok} />
      {/each}
    </main>
  </div>
{/key}

