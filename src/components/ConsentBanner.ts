import { createElement as h } from '.';
import { CustomElement } from './CustomElement';
import style from './../styles/components/consent-banner.pcss?inline';

interface Cookies extends Record<string, string> {
    consent?: string;
}

export class ConsentBanner extends CustomElement {
    private consentBanner: HTMLDivElement;

    public static getTagName(): string {
        return 'consent-banner';
    }

    public get acceptLabel(): string {
        return this.getAttribute('accept-label') || 'Accept';
    }

    public get declineLabel(): string {
        return this.getAttribute('decline-label') || 'Decline';
    }

    public get toggleAttributeName(): string {
        return this.getAttribute('toggle-attribute') || 'data-consent-toggle';
    }

    protected render(shadow: ShadowRoot): void | Promise<void> {
        this.initializeConsentToggles();

        const acceptButton = h(
            'button',
            {
                class: [
                    'consent-banner__action',
                    'consent-banner__action--accept',
                ],
            },
            [this.acceptLabel],
        );
        const declineButton = h(
            'button',
            {
                class: [
                    'consent-banner__action',
                    'consent-banner__action--decline',
                ],
            },
            [this.declineLabel],
        );
        acceptButton.addEventListener('click', this.handleAccept.bind(this));
        declineButton.addEventListener('click', this.handleDecline.bind(this));

        this.consentBanner = h(
            'div',
            {
                class: 'consent-banner',
            },
            [
                h(
                    'article',
                    {
                        class: 'consent-banner__content',
                    },
                    [
                        h(
                            'div',
                            {
                                class: 'consent-banner__text',
                            },
                            [
                                h('slot', {}, [
                                    'Consent info should appear here',
                                ]),
                            ],
                        ),
                        h(
                            'footer',
                            {
                                class: 'consent-banner__actions',
                            },
                            [acceptButton, declineButton],
                        ),
                    ],
                ),
            ],
        );

        shadow.appendChild(this.consentBanner);

        consent.addEventListener('change', ({ detail }: ConsentChangeEvent) => {
            switch (detail.level) {
                case 2:
                    this.consentBanner.classList.add(
                        'consent-banner--consent-given',
                    );
                    this.consentBanner.classList.remove(
                        'consent-banner--consent-denied',
                    );
                    break;

                case 1:
                    this.consentBanner.classList.add(
                        'consent-banner--consent-denied',
                    );
                    this.consentBanner.classList.remove(
                        'consent-banner--consent-given',
                    );
                    break;

                default:
                    this.consentBanner.classList.remove(
                        'consent-banner--consent-given',
                    );
                    this.consentBanner.classList.remove(
                        'consent-banner--consent-denied',
                    );
            }
        });

        consent.load();
    }

    private handleAccept(): void {
        consent.level = 2;
    }

    private handleDecline(): void {
        consent.level = 1;
    }

    private handleReset(): void {
        consent.level = 0;
    }

    private initializeConsentToggles(): void {
        const toggles = Array.from(
            document.querySelectorAll(`[${this.toggleAttributeName}]`),
        );

        for (const toggle of toggles) {
            toggle.addEventListener('click', this.handleReset.bind(this));
        }
    }

    protected styles(): string | Promise<string> {
        return style;
    }
}

export type ConsentChangeEvent = CustomEvent<{
    level: number;
}>;

class Consent extends EventTarget {
    private _level: number | undefined;

    get level(): number {
        if (!this._level) {
            this.load();
        }

        return this._level;
    }

    set level(level: number) {
        this._level = level;
        window.document.cookie = [
            `consent=${level || ''}`,
            `Max-Age=${level > 0 ? 31536000 : 0}`,
            'SameSite=strict',
        ].join('; ');

        this.dispatchEvent(
            new CustomEvent('change', {
                detail: { level },
            }) as ConsentChangeEvent,
        );
    }

    public load(): void {
        const cookies: Cookies = window.document.cookie
            .split(';')
            .map((value) => value.split('='))
            .reduce(
                (carry, [key, value]) => ({
                    ...carry,
                    [decodeURIComponent(key.trim())]: decodeURIComponent(
                        value?.trim(),
                    ),
                }),
                {},
            );

        this.level = Number(cookies.consent || 0);
    }
}

export const consent = new Consent();
