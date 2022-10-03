import { CustomElement } from './CustomElement';
import { GeoMap, MapReadyEvent } from './GeoMap';
import style from './../styles/components/geo-map.pcss?inline';

export class MapMarker extends CustomElement {
    public marker: google.maps.Marker | null = null;

    public map: google.maps.Map | null = null;

    protected async render(shadow: ShadowRoot): Promise<void> {
        const parent = this.parentElement;

        parent.addEventListener('map:ready', (event: MapReadyEvent) =>
            this.ready(event.detail.map, event.target as GeoMap),
        );
    }

    private ready(map: google.maps.Map, element: GeoMap): void {
        this.map = map;
        this.marker = new google.maps.Marker({
            position: element.center,
            title: 'Hello World!',
            map,
        });

        this.dispatchEvent(
            new CustomEvent('map:marker-ready', {
                bubbles: true,
                detail: {
                    marker: this.marker,
                    map: this.map,
                },
            }),
        );
    }

    public static getTagName(): string {
        return 'map-marker';
    }

    protected styles(): string | Promise<string> {
        return style;
    }
}

export function setup(registry: CustomElementRegistry) {
    MapMarker.register(registry);
}

export type MarkerReadyEvent = CustomEvent<{
    map: google.maps.Map;
    marker: google.maps.Marker;
}>;
