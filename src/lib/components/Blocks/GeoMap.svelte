<script lang="ts">
  import ContentSection from "$lib/components/ContentSection.svelte";
  import MapMarker from "$lib/components/Blocks/MapMarker.svelte";
  import GeoMap, { type Coordinates } from "$lib/components/GeoMap.svelte";
  import type { GeoMapStoryblok } from "$storyblok/components";
  import { storyblokEditable } from "@storyblok/svelte";
  import { getContext } from "svelte";
  import type { ConsentContext } from "../../../routes/+layout.svelte";

  export let blok: GeoMapStoryblok;
  let anchor = blok.anchor;
  let mapId = blok.mapId;
  let zoom = Number(blok.zoom);
  let center: Coordinates = {
    lat: Number(blok.latitude),
    lng: Number(blok.longitude),
  };
  let markers = blok.markers ?? [];
  let options: Partial<google.maps.MapOptions> = {
    tilt: blok.tilt ? 45 : 0,
    minZoom: Number(blok.minZoom ?? 1),
    maxZoom: Number(blok.maxZoom ?? 21),
    clickableIcons: blok.clickableIcons ?? true,
    scaleControl: blok.showScaleControl ?? false,
    rotateControl: blok.showRotateControl ?? false,
    streetViewControl: blok.showStreetViewControl ?? true,
    keyboardShortcuts: true,
    mapTypeControl: true,
    mapTypeControlOptions: {
      mapTypeIds: [
        "roadmap",
        "satellite",
        "hybrid",
      ],
    },
  };

  const { consent, show: showCookieSettings } = getContext<ConsentContext>("consent");
</script>

<section class="contents" use:storyblokEditable={blok}>
  <ContentSection id={anchor} bleed popOut recede>
    {#if $consent.tracking}
      <GeoMap {center} height="75vh" {mapId} {options} {zoom}>
        {#each markers as marker}
          <MapMarker blok={marker} />
        {/each}
      </GeoMap>
    {:else}
      <div style:height="75vh" class="p-8 flex flex-col justify-center items-center bg-secondary/10 select-none">
        <div
          class="mb-8 flex w-16 h-16 justify-center items-center rounded-full border-4 border-primary/50 text-primary bg-primary/10">
          <em class="leading-none font-serif text-5xl font-thin -translate-x-1 text-shadow-sm shadow-black/5">i</em>
        </div>

        <span class="block max-w-2xl text-center">
          Sie haben der Verwendung von Google Maps nicht zugestimmt. Bitte ändern Sie
          <button class="link" on:click={showCookieSettings}>Ihre Cookie-Einstellungen</button><!--
          -->, um die Karte zu sehen.
        </span>
      </div>
    {/if}
  </ContentSection>
</section>
