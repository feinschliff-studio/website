<script lang="ts">
  import ContentSection from "$lib/components/ContentSection.svelte";
  import Offering from "$lib/components/Blocks/Offering.svelte";
  import RichText from "$lib/components/RichText.svelte";
  import type { OfferingListStoryblok } from "$storyblok/components";
  import { storyblokEditable } from "@storyblok/svelte";

  export let blok: OfferingListStoryblok;
  let highlights = blok.highlights ?? [];
  let items = blok.items ?? [];
  let anchor = blok.anchor;
</script>

<section class="contents" use:storyblokEditable={blok}>
  <ContentSection id={anchor}>
    <div class="space-y-4 mb-4">
      {#each highlights as highlight}
        <Offering blok={highlight} />
      {/each}
    </div>

    <ul class="space-y-2">
      {#each items as offering}
        <li>
          <Offering blok={offering} showDescription={false} />
        </li>
      {/each}
    </ul>

    {#if blok.content}
      <RichText content={blok.content} />
    {/if}
  </ContentSection>
</section>
