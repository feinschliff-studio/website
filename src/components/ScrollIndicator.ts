import { CustomElement } from './CustomElement';
import style from '../styles/components/scroll-indicator.pcss?inline';
import { createElement as h } from '.';

export class ScrollIndicator extends CustomElement {
    protected render(shadow: ShadowRoot): void | Promise<void> {
        shadow.appendChild(
            h('div', {}, [
                h('span', {
                    style: {
                        '--scroll-indicator-size': this.indicatorSize,
                        '--scroll-indicator-effect-multiplier':
                            this.indicatorEffectMultiplier,
                    },
                }),
            ]),
        );
        return;
        const element = document.createElement('div');
        const inner = document.createElement('span');
        element.appendChild(inner);
        element.classList.add('scroll-indicator');
        element.style.setProperty(
            '--scroll-indicator-size',
            this.indicatorSize,
        );
        element.style.setProperty(
            '--scroll-indicator-effect-multiplier',
            this.indicatorEffectMultiplier,
        );

        shadow.appendChild(element);
    }

    protected styles(): string | Promise<string> {
        return style;
    }

    public static getTagName(): string {
        return 'scroll-indicator';
    }

    get indicatorSize(): string {
        return this.getAttribute('indicator-size') || '24px';
    }

    get indicatorEffectMultiplier(): string {
        return this.getAttribute('indicator-effect-multiplier') || '0.8';
    }
}

export function setup(registry: CustomElementRegistry) {
    ScrollIndicator.register(registry);
}
