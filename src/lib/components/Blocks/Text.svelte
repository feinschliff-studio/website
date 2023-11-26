<script lang="ts">
  import type { TextStoryblok } from "$storyblok/components";
  import { storyblokEditable } from "@storyblok/svelte";

  export let blok: TextStoryblok;
</script>

<span use:storyblokEditable={blok}>
  {blok.text}
</span>
