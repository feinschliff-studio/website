<script lang="ts">
  import ScrollIndicator from "$lib/components/ScrollIndicator.svelte";
  import { resolveLink } from "$lib/storyblok";
  import type { HeroStoryblok, LinkStoryblok, TextStoryblok } from "$storyblok/components";
  import { storyblokEditable } from "@storyblok/svelte";

  export let blok: HeroStoryblok;
  let anchor = blok.anchor;
  let title = blok.headline;
  let backgroundImage = blok.backgroundImage?.filename;
  let backgroundColor = blok.backgroundColor?.value;
  let subheading = blok.subheading?.at(0) as (TextStoryblok | LinkStoryblok | undefined);
</script>

<header
  id={anchor}
  style:background-color={backgroundColor}
  style:background-image={`url(${backgroundImage})`}
  class="flex flex-col w-full min-h-[100vh] bg-cover bg-no-repeat {blok.patternOverlay ? 'bg-blend-lighten bg-[position:center_-20vh]' : ''}"
  use:storyblokEditable={blok}
>
  <div
    class="section__hero flex-grow flex flex-col justify-end pl-8 pb-32 sm:pb-[calc(100vh_/_3)] md:pb-[calc(100vh_/_5)]
    md:pl-[calc(100vw_/_5)]"
  >
    <h1 class="text-shadow shadow-black/5 m-0 text-[4vmax] xs:text-[6vmax] font-extralight">{title}</h1>

    {#if subheading}
      <strong class="m-0 text-[2vmax] text-shadow shadow-black/5">
        {#if subheading.component === "Link"}
          <a href={resolveLink(subheading.target)}>{subheading.label}</a>
        {:else}
          <span>{subheading.text}</span>
        {/if}
      </strong>
    {/if}
  </div>

  {#if blok.scrollIndicator}
    <!-- TODO: The intro anchor should not be hardcoded here -->
    <ScrollIndicator href="#intro" size={24} />
  {/if}
</header>
