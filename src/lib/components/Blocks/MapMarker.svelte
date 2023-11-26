<script lang="ts">
  import type { Coordinates } from "$lib/components/GeoMap.svelte";
  import MapMarker from "$lib/components/MapMarker.svelte";
  import MapPopup from "$lib/components/MapPopup.svelte";
  import RichText from "$lib/components/RichText.svelte";
  import type { MapMarkerStoryblok } from "$storyblok/components";
  import { storyblokEditable } from "@storyblok/svelte";

  export let blok: MapMarkerStoryblok;
  let coordinates: Coordinates = {
    lat: Number(blok.latitude),
    lng: Number(blok.longitude),
  };
</script>

<div class="contents group" use:storyblokEditable={blok}>
  <MapMarker coordinates={coordinates}>
    {#if blok.title || blok.content}
      <MapPopup>
        <span class="mb-2 font-medium">{blok.title}</span>
        {#if blok.content}
          <RichText class="text-gray-600 font-light" content={blok.content} dense />
        {/if}
      </MapPopup>
    {/if}
  </MapMarker>
</div>
