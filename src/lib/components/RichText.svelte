<script lang="ts">
  import { StoryblokComponent } from "@storyblok/svelte";
  import type { RichtextStoryblok } from "$storyblok/components";
  import { renderRichText } from "@storyblok/js";

  let className: string = "";
  export { className as class };
  export let content: RichtextStoryblok;
  $: nodes = content.content ?? [];
  export let dense: boolean = false;

  function renderNode(node: RichtextStoryblok): string {
    return renderRichText({
      type: "doc",
      content: [node],
    });
  }
</script>
<div class={'rich-text ' + className} class:rich-text--dense={dense}>
  {#each nodes as node}
    {#if node.type === "blok"}
      {#each node.attrs.body as blok}
        <StoryblokComponent blok="{blok}" />
      {/each}
    {:else}
      {@html renderNode(node)}
    {/if}
  {/each}
</div>

<style lang="postcss">
    .rich-text :global(p) {
        @apply my-4 first:mt-0 last:mb-0;
    }

    .rich-text--dense :global(p) {
        @apply my-1;
    }

    .rich-text :global(ul) {
        list-style: disc;
        @apply ml-4 pl-6;
    }

    .rich-text :global(ul li p) {
        @apply m-0;
    }

    .rich-text :global(  h1),
    .rich-text :global(h2),
    .rich-text :global(h3),
    .rich-text :global(h4),
    .rich-text :global(h5),
    .rich-text :global(h6) {
        @apply font-display;
    }

    .rich-text :global(h1),
    .rich-text :global(h2) {
        @apply font-bold;
    }

    .rich-text :global(h3),
    .rich-text :global(h4) {
        @apply font-medium;
        @apply mt-6 mb-2;
    }

    .rich-text :global(h5),
    .rich-text :global(h6) {
        @apply font-normal;
    }

    .rich-text :global(hr) {
        @apply my-12;
    }
</style>
