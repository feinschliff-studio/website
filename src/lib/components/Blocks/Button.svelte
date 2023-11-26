<script lang="ts">
  import type { ButtonStoryblok } from "$storyblok/components";
  import { storyblokEditable } from "@storyblok/svelte";

  export let blok: ButtonStoryblok;
  let disabled = blok.disabled ?? false;
  let autofocus = blok.autofocus ?? false;
  let type = blok.type ?? "submit";
  let label = blok.label;
  let name = blok.name ?? undefined;
  let value = blok.value ?? undefined;
</script>

<div use:storyblokEditable={blok}>
  <!-- svelte-ignore a11y-autofocus -->
  <button
    {name}
    class="w-full pointer-events-auto cursor-pointer select-none bg-secondary/60 hover:bg-secondary focus:bg-secondary
    focus:outline-none text-white p-6 rounded-sm relative transition-all duration-300 ease-in-out ring-0 hover:ring-8
    focus:ring-8 ring-inset ring-primary z-10 before:absolute before:block before:top-0 before:left-0 before:w-full
    before:h-full before:border before:border-white before:opacity-0 hover:before:opacity-100 focus:before:opacity-100
    before:scale-95 hover:before:scale-100 focus:before:scale-100 before:[transition:transform_750ms,_opacity_250ms]
    hover:before:[transition:transform_250ms,opacity_200ms_25ms]
    focus:before:[transition:transform_250ms,opacity_200ms_25ms] group-invalid:pointer-events-none group-invalid:opacity-60"
    {autofocus}
    {disabled}
    {type}
    {value}
  >
    <span>{label}</span>
  </button>
</div>
