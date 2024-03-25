<script lang="ts">
  import { StoryblokComponent } from "@storyblok/svelte";
  import type { RichtextStoryblok } from "$storyblok/components";
  import { renderRichText } from "@storyblok/js";

  let className: string = "";
  // noinspection ReservedWordAsName
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
