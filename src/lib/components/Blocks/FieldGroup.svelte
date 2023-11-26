<script lang="ts">
  import type { FieldGroupStoryblok } from "$storyblok/components";
  import { StoryblokComponent, storyblokEditable } from "@storyblok/svelte";

  export let blok: FieldGroupStoryblok;
  let columns = Number(blok.columns ?? 1);
  let rows = Number(blok.rows ?? 1);
  let gap = blok.gap === "auto" ? null : Number(blok.gap ?? 4);
  $: fields = blok.fields ?? [];
</script>

{#key blok}
  <!-- eslint-disable svelte/sort-attributes -->
  <div
    class="grid"

    class:gap-[inherit]={gap === null}
    class:gap-0.5={gap === 0.5}
    class:gap-1={gap === 1}
    class:gap-1.5={gap === 1.5}
    class:gap-2={gap === 2}
    class:gap-2.5={gap === 2.5}
    class:gap-3={gap === 3}
    class:gap-3.5={gap === 3.5}
    class:gap-4={gap === 4}
    class:gap-5={gap === 5}
    class:gap-6={gap === 6}
    class:gap-7={gap === 7}
    class:gap-8={gap === 8}
    class:gap-9={gap === 9}
    class:gap-10={gap === 10}
    class:gap-11={gap === 11}
    class:gap-12={gap === 12}
    class:gap-14={gap === 14}
    class:gap-16={gap === 16}

    class:grid-cols-1={columns >= 1}
    class:md:grid-cols-2={columns >= 2}
    class:md:grid-cols-3={columns === 3}
    class:md:grid-cols-4={columns >= 4}
    class:lg:grid-cols-5={columns === 5}
    class:lg:grid-cols-6={columns === 6}
    class:lg:grid-cols-7={columns === 7}
    class:lg:grid-cols-8={columns >= 8}
    class:xl:grid-cols-9={columns === 9}
    class:xl:grid-cols-10={columns === 10}
    class:xl:grid-cols-11={columns === 11}
    class:xl:grid-cols-12={columns === 12}

    class:grid-rows-1={rows === 1}
    class:grid-rows-2={rows === 2}
    class:grid-rows-3={rows === 3}
    class:grid-rows-4={rows === 4}
    class:grid-rows-5={rows === 5}
    class:grid-rows-6={rows === 6}

    use:storyblokEditable={blok}
  >
    <!-- eslint-enable svelte/sort-attributes -->
    {#each fields as bodyBlok}
      <StoryblokComponent blok={bodyBlok} />
    {/each}
  </div>
{/key}
