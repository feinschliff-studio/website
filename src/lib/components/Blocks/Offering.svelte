<script lang="ts">
  import RichText from "$lib/components/RichText.svelte";
  import type { OfferingStoryblok } from "$storyblok/components";
  import { storyblokEditable } from "@storyblok/svelte";

  export let blok: OfferingStoryblok;
  export let showDescription: boolean = true;
</script>

<article use:storyblokEditable={blok}>
  <header class="flex flex-col md:flex-row md:items-center justify-between font-display">
    <h4
      class="inline-flex items-baseline whitespace-nowrap flex-grow after:flex-grow after:w-full after:h-1.5
            after:mx-2 after:bg-gradient-radial after:from-20% after:from-secondary/50 after:to-0% after:to-transparent
            after:bg-left-top after:bg-[length:8px_8px]"
    >
      {blok.name}
    </h4>
    <data class="opacity-75" value={blok.price}>{blok.price}</data>
  </header>

  {#if blok.description && showDescription}
    <RichText content={blok.description} />
  {/if}
</article>
