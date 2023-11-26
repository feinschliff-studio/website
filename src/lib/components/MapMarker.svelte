<script context="module" lang="ts">
  export type GetMarkerContext = {
    getMarker: () => google.maps.Marker;
  };
</script>

<script lang="ts">
  import { getContext, setContext } from "svelte";
  import type { Coordinates, GetMapContext } from "$lib/components/GeoMap.svelte";

  export let coordinates: Coordinates | undefined = undefined;
  export let title: string | undefined = undefined;

  const { getMap } = getContext<GetMapContext>("map");
  const map = getMap();

  const markerOptions: google.maps.MarkerOptions = {
    position: coordinates || map?.getCenter(),
    map: map ?? undefined,
    title,
  };

  const marker = new google.maps.Marker(markerOptions);
  dispatchEvent(new CustomEvent("marker", { detail: marker }));
  setContext("marker", {
    getMarker: () => marker,
  });
</script>

{#if marker}
  <slot />
{/if}
