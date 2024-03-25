<script lang="ts">
  import { resolveLink } from "$lib/storyblok";
  import type { LinkStoryblok } from "$storyblok/components";
  import { storyblokEditable } from "@storyblok/svelte";

  export let blok: LinkStoryblok;
</script>

<div class="flex justify-center items-center" use:storyblokEditable={blok}>
  <a href={resolveLink(blok.target)}>{blok.label}</a>
</div>
