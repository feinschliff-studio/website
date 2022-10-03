import { Coordinates, loadMap } from '../modules/map';
import { CustomElement } from './CustomElement';
import style from './../styles/components/geo-map.pcss?inline';
import { createElement as h } from '.';

export class GeoMap extends CustomElement {
    public map: google.maps.Map | null = null;

    public static getTagName(): string {
        return 'geo-map';
    }

    styles(): string {
        return style;
    }

    protected async render(shadow: ShadowRoot): Promise<void> {
        const wrapper = h('div', {
            class: 'geo-map',
            style: {
                width: this.mapWidth,
                height: this.mapHeight,
            },
        });
        shadow.appendChild(wrapper);

        this.map = await loadMap(wrapper, {
            center: this.center,
            mapId: this.mapId,
            zoom: this.zoom,
        });

        this.dispatchEvent(
            new CustomEvent('map:ready', {
                bubbles: true,
                detail: {
                    map: this.map,
                },
            }),
        );
    }

    public get mapWidth(): string {
        return this.getAttribute('map-width') || '100%';
    }

    public get mapHeight(): string {
        return this.getAttribute('map-height') || '300px';
    }

    public get zoom(): number | undefined {
        const zoom = this.getAttribute('map-zoom');

        return zoom ? Number(zoom) : undefined;
    }

    public get mapId(): string | undefined {
        return this.getAttribute('map-id');
    }

    public get center(): Coordinates | undefined {
        const center = this.getAttribute('map-center');

        if (!center) {
            return undefined;
        }

        const [latitude, longitude] = center
            .split(',')
            .map((part) => part.trim()) || [0, 0];

        return {
            lat: Number(latitude),
            lng: Number(longitude),
        };
    }
}

export function setup(registry: CustomElementRegistry) {
    GeoMap.register(registry);
}

export type MapReadyEvent = CustomEvent<{ map: google.maps.Map }>;
