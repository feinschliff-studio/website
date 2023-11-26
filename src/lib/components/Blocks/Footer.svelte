<script lang="ts">
  import ContentSection from "$lib/components/Blocks/ContentSection.svelte";
  import RichText from "$lib/components/RichText.svelte";
  import type { FooterStoryblok } from "$storyblok/components";
  import { StoryblokComponent, storyblokEditable } from "@storyblok/svelte";

  export let blok: FooterStoryblok;
  let anchor = blok.anchor;
  $: links = blok.links ?? [];
  let colored = blok.colored ?? false;
</script>

{#key blok}
  <footer class="contents select-none" use:storyblokEditable={blok}>
    <ContentSection id={anchor} {colored} recede>
      <nav class="flex justify-center items-center text-2xl space-x-6">
        {#each links as item}
          <StoryblokComponent blok={item} />
        {/each}
      </nav>

      {#if blok.content}
        <div class="w-full max-w-5xl mx-auto flex justify-center items-center text-white/75">
          <RichText content={blok.content} />
        </div>
      {/if}
    </ContentSection>
  </footer>
{/key}
