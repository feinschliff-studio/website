import { CustomElement } from './CustomElement';
import { GeoMap } from './GeoMap';
import { MapMarker, MarkerReadyEvent } from './MapMarker';

export class MapPopup extends CustomElement {
    public popup: google.maps.InfoWindow | null = null;

    protected async render(shadow: ShadowRoot): Promise<void> {
        this.parentElement.addEventListener(
            'map:marker-ready',
            (event: MarkerReadyEvent) =>
                this.ready(event.detail.map, event.detail.marker),
        );
    }

    private ready(map: google.maps.Map, marker: google.maps.Marker): void {
        this.popup = new google.maps.InfoWindow({
            content: this.htmlContent,
            maxWidth: this.maxWidth,
            minWidth: this.minWidth,
            pixelOffset: this.offset,
        });

        marker.addListener('click', () =>
            this.popup?.open({
                anchor: marker,
                shouldFocus: false,
                map,
            }),
        );

        map.addListener('idle', () =>
            this.popup?.open({
                anchor: marker,
                shouldFocus: false,
                map,
            }),
        );
    }

    public get htmlContent(): string{
        return `<div class="map-popup">${this.content}</div>`;
    }


    public get content(): string {
        return this.hasAttribute('content')
            ? this.getAttribute('content')
            : this.innerHTML;
    }

    public get maxWidth(): number | undefined {
        return this.hasAttribute('max-width')
            ? Number(this.getAttribute('max-width'))
            : undefined;
    }

    public get minWidth(): number | undefined {
        return this.hasAttribute('min-width')
            ? Number(this.getAttribute('min-width'))
            : undefined;
    }

    public get offset(): google.maps.Size | undefined {
        const xOffset = Number(this.getAttribute('x-offset') || 0);
        const yOffset = Number(this.getAttribute('y-offset') || 0);

        return new google.maps.Size(xOffset, yOffset);
    }

    public static getTagName(): string {
        return 'map-popup';
    }

    protected styles(): string | Promise<string> {
        return '* {color:black}';
    }
}

export function setup(registry: CustomElementRegistry) {
    MapPopup.register(registry);
}
