<script context="module" lang="ts">
  import type { SerializedChoices } from "$lib/consent";
  import type { Readable } from "svelte/store";

  export interface ConsentChoices extends SerializedChoices {
    necessary: boolean;
    tracking: boolean;
    analytics: boolean;
    marketing: boolean;
  }

  export type ConsentContext = {
    consent: Readable<ConsentChoices>,
    show: () => void,
  }
</script>

<script lang="ts">
  import "../style.pcss";
  import "@fontsource-variable/jost";
  import "@fontsource-variable/source-sans-3";
  import "@fontsource-variable/source-sans-3/wght-italic.css";

  import ConfiguredCookieBanner from "$lib/components/ConfiguredCookieBanner.svelte";
  import { setContext } from "svelte";
  import { derived, writable } from "svelte/store";
  import type { LayoutData } from "./$types";
  import { serializeSchema } from "$lib/schema";

  export let data: LayoutData;
  let open: boolean = false;

  const consent = writable({
    necessary: true,
    tracking: false,
    analytics: false,
    marketing: false,
  } as ConsentChoices);

  setContext<ConsentContext>("consent", {
    consent: derived(consent, c => c),
    show: () => {
      open = true;
    },
  });
</script>

<svelte:head>
  {@html serializeSchema(data.schema)}
</svelte:head>

<article class="relative">
  <slot />

  <ConfiguredCookieBanner blok={data.cookieBanner} {consent} bind:open />
</article>
