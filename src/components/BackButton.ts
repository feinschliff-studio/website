import { createElement as h } from '.';
import { CustomElement } from './CustomElement';
import style from './../styles/components/back-button.pcss?inline';

export class BackButton extends CustomElement {
    public static getTagName(): string {
        return 'back-button';
    }

    public get href(): string | undefined {
        return this.getAttribute('href');
    }

    private arrow(): HTMLElement {
        const svg = document.createElement('svg');
        svg.setAttribute('width', '24px');
        svg.setAttribute('height', '24px');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.style.transform = 'rotate(180deg)';
        const path = document.createElement('path');
        path.setAttribute(
            'd',
            'M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z',
        );
        svg.appendChild(path);

        return svg;
    }

    protected render(shadow: ShadowRoot): void | Promise<void> {
        const button = h(
            'button',
            {
                class: 'back-button',
            },
            [this.arrow()],
        );

        button.addEventListener('click', this.handleClick.bind(this));
        shadow.appendChild(button);
    }

    protected styles(): string | Promise<string> {
        return style;
    }

    private handleClick(): void {
        if (this.href) {
            window.location.href = new URL(
                this.href,
                window.location.origin,
            ).toString();

            return;
        }

        window.history.go(-1);
    }
}
