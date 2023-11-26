<script lang="ts">
  import { resolveLink } from "$lib/storyblok";
  import type { MenuLinkStoryblok } from "$storyblok/components";
  import { storyblokEditable } from "@storyblok/svelte";

  export let blok: MenuLinkStoryblok;
  let label = blok.label ?? blok.target.story?.name;
  let url = resolveLink(blok.target);
</script>

<div use:storyblokEditable={blok}>
  <a href={url}>{label}</a>
</div>
