import Glide, {
    Controls,
    Breakpoints,
    Swipe,
    Keyboard,
    // Autoplay,
    Images,
} from '@glidejs/glide/dist/glide.modular.esm';
import glideCoreStyles from '@glidejs/glide/dist/css/glide.core.min.css?inline';
import glideThemeStyles from '@glidejs/glide/dist/css/glide.theme.min.css?inline';
import styles from '../styles/components/media-gallery.pcss?inline';
import { createElement as h } from '.';

import { CustomElement } from './CustomElement';

export class MediaGallery extends CustomElement {
    public static getTagName(): string {
        return 'media-gallery';
    }

    protected render(shadow: ShadowRoot): void | Promise<void> {
        const children = Array.from(this.children)
            .filter(
                (child): child is HTMLImageElement =>
                    child instanceof HTMLImageElement,
            )
            .map((image) =>
                h(
                    'li',
                    {
                        class: 'glide__slide',
                    },
                    [image.cloneNode(true) as HTMLElement],
                ),
            );

        const root = h('div', {}, [
            h(
                'div',
                {
                    class: 'glide__track',
                    data: { glideEl: 'track' },
                },
                [
                    h('ul', { class: 'glide__slides' }, children),
                    h(
                        'div',
                        {
                            class: 'glide__arrows',
                            data: { glideEl: 'controls' },
                        },
                        [
                            h(
                                'button',
                                {
                                    class: [
                                        'glide__arrow',
                                        'glide__arrow--left',
                                    ],
                                    data: { glideDir: '<' },
                                },
                                ['←'],
                            ),
                            h(
                                'button',
                                {
                                    class: [
                                        'glide__arrow',
                                        'glide__arrow--right',
                                    ],
                                    data: { glideDir: '>' },
                                },
                                ['→'],
                            ),
                        ],
                    ),
                ],
            ),
        ]);
        shadow.appendChild(root);

        // @ts-ignore
        const glide = new Glide(root, {
            type: this.type,
            startAt: this.startAt,
            perView: this.perView,
            autoplay: this.autoplay,
            gap: this.gap,
            keyboard: this.keyboard,
            breakpoints: {
                800: {
                    perView: 1,
                },
            },
        });

        glide.mount({
            Controls,
            Breakpoints,
            Swipe,
            Keyboard,
            // Autoplay,
            Images,
        });
    }

    get type(): Glide.Type {
        return this.hasAttribute('type')
            ? (this.getAttribute('type') as Glide.Type)
            : 'carousel';
    }

    get startAt(): number | undefined {
        return this.hasAttribute('start-at')
            ? Number(this.getAttribute('start-at'))
            : undefined;
    }

    get perView(): number | undefined {
        return this.hasAttribute('per-view')
            ? Number(this.getAttribute('per-view'))
            : undefined;
    }

    get autoplay(): number | undefined {
        return this.hasAttribute('autoplay')
            ? Number(this.getAttribute('autoplay'))
            : undefined;
    }

    get gap(): number | undefined {
        return this.hasAttribute('gap')
            ? Number(this.getAttribute('gap'))
            : undefined;
    }

    get keyboard(): boolean {
        return this.hasAttribute('keyboard');
    }

    protected styles(): string | Promise<string> {
        return [glideCoreStyles, glideThemeStyles, styles].join('\n');
    }
}
