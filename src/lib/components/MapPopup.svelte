<script lang="ts">
  import type { GetMapContext } from "$lib/components/GeoMap.svelte";
  import type { GetMarkerContext } from "$lib/components/MapMarker.svelte";
  import { getContext } from "svelte";

  const { getMap } = getContext<GetMapContext>("map");
  const { getMarker } = getContext<GetMarkerContext>("marker");
  const map = getMap();
  const marker = getMarker();
  const openOptions: google.maps.InfoWindowOpenOptions = {
    shouldFocus: false,
    anchor: marker,
    map,
  };

  let popup: google.maps.InfoWindow | undefined = undefined;
  let popupOpenListener: google.maps.MapsEventListener | undefined = undefined;
  let markerClickListener: google.maps.MapsEventListener | undefined = undefined;

  function createPopup(options: google.maps.InfoWindowOptions) {
    popup = new google.maps.InfoWindow(options);

    dispatchEvent(new CustomEvent("popup", { detail: popup }));
    popupOpenListener = map?.addListener("idle", () => popup?.open(openOptions));
    markerClickListener = marker.addListener("click", () => popup?.open(openOptions));
  }

  function initialize(element: HTMLElement) {
    createPopup({ content: element });

    return {
      update() {
        popupOpenListener?.remove();
        markerClickListener?.remove();
        popup?.close();
        createPopup({ content: element });
      },
      destroy() {
        popupOpenListener?.remove();
        markerClickListener?.remove();
        popup?.close();
        popup = undefined;
      },
    };
  }
</script>

<div class="text-base font-display text-black" use:initialize>
  <slot />
</div>
