<script context="module" lang="ts">
  export type GeoMap = google.maps.Map;
  export type GeoMapOptions = google.maps.MapOptions;
  export type Coordinates = google.maps.LatLngLiteral;

  export type GetMapContext = {
    getMap: () => GeoMap | null,
  };
</script>

<script lang="ts">
  import { PUBLIC_MAPS_API_KEY } from "$env/static/public";
  import { Loader } from "@googlemaps/js-api-loader";
  import { setContext } from "svelte";

  export let mapId: string | undefined = undefined;
  export let center: Coordinates;
  export let height: string | number;
  $: cssHeight = typeof height === "number" ? `${height}px` : height;
  export let zoom: number = 4;
  export let options: Partial<GeoMapOptions> = {};
  $: mapParameters = {
    zoom,
    mapId,
    center,
    options,
  } satisfies MapParameters;

  let map: google.maps.Map | null;

  // noinspection JSUnusedGlobalSymbols -- not unused, see marker and popup
  setContext<GetMapContext>("map", {
    getMap: () => map,
  });

  async function initializeMapsLibrary(): Promise<typeof google.maps.Map> {
    const loader = new Loader({
      apiKey: PUBLIC_MAPS_API_KEY,
      version: "weekly",
      libraries: ["maps", "marker"],
    });

    const { Map } = await loader.importLibrary("maps");

    return Map;
  }

  async function loadMap(GoogleMap: typeof google.maps.Map, element: HTMLElement) {
    return new GoogleMap(element, {
      ...options,
      zoom,
      mapId,
      center: {
        lat: Number(center.lat),
        lng: Number(center.lng),
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function initialize(element: HTMLElement, _parameters: MapParameters) {
    initializeMapsLibrary()
      .then(GoogleMap => loadMap(GoogleMap, element))
      .then(mapInstance => map = mapInstance);

    return {
      update({ zoom, center, options }: MapParameters) {
        if (map) {
          map.setOptions(options);
          map.setCenter(center);
          map.setZoom(zoom);
        }
      },
      destroy() {
        map = null;
      },
    };
  }

  interface MapParameters {
    zoom: number;
    mapId: string | undefined;
    center: Coordinates;
    options: Partial<GeoMapOptions>;
  }
</script>

<div style:height={cssHeight} class="geo-map border-t w-full" use:initialize={mapParameters}>
  {#if map}
    <slot />
  {/if}
</div>
