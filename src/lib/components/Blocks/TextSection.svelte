<script lang="ts">
  import ContentSection from "$lib/components/ContentSection.svelte";
  import Heading from "$lib/components/Heading.svelte";
  import RichText from "$lib/components/RichText.svelte";
  import type { TextSectionStoryblok } from "$storyblok/components";
  import { storyblokEditable } from "@storyblok/svelte";

  export let blok: TextSectionStoryblok;
  let bleed = blok.bleed ?? false;
  let popOut = blok.popOut ?? false;
  let recede = blok.recede ?? false;
  let colored = blok.colored ?? false;
  let headingLevel = Number(blok.headingLevel ?? 2);
  let subheadingLevel = Number(blok.subheadingLevel ?? 3);
  let anchor = blok.anchor;
</script>

<section class="contents" use:storyblokEditable={blok}>
  <ContentSection id={anchor} {bleed} {colored} header={!! blok.heading} {popOut} {recede}>
    <svelte:fragment slot="heading">
      {#if blok.heading}
        <Heading level={headingLevel} text={blok.heading} />
      {/if}
    </svelte:fragment>

    <svelte:fragment slot="subheading">
      {#if blok.subheading}
        <Heading level={subheadingLevel} text={blok.subheading} />
      {/if}
    </svelte:fragment>

    <RichText content={blok.content} />
  </ContentSection>
</section>
