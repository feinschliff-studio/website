import { Loader } from '@googlemaps/js-api-loader';

export type GeoMap=google.maps.Map;
export type GeoMapOptions = google.maps.MapOptions;
export type Coordinates = google.maps.LatLngLiteral;

export async function loadMap(
    element: HTMLElement,
    options: GeoMapOptions = {},
): Promise<GeoMap> {
    const loader = new Loader({
        apiKey: import.meta.env.VITE_MAPS_API_KEY,
        version: 'weekly',
        libraries: [],
    });

    const google = await loader.load();
    const mergedOptions: GeoMapOptions = {
        ...options,
        zoom: options.zoom || 4,
        center: {
            lat: Number(options.center?.lat || 48.0952351),
            lng: Number(options.center?.lng || 7.964631499999999),
        },
    };

    return new google.maps.Map(element, mergedOptions);
}
