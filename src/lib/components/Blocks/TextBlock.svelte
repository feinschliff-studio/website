<script lang="ts">
  import Heading from "$lib/components/Heading.svelte";
  import RichText from "$lib/components/RichText.svelte";
  import type { TextBlockStoryblok } from "$storyblok/components";
  import { storyblokEditable } from "@storyblok/svelte";

  export let blok: TextBlockStoryblok;
</script>

<article use:storyblokEditable={blok}>
  {#if blok.heading}
    <header>
      <Heading level={Number(blok.headingLevel)}>{blok.heading}</Heading>

      <Heading level={Number(blok.subheadingLevel)}>{blok.subheading}</Heading>
    </header>
  {/if}

  <div class="text-lg">
    <RichText content={blok.content} />
  </div>
</article>
