export abstract class CustomElement extends HTMLElement {
    constructor() {
        super();
        this.doRender();
    }

    private async doRender(): Promise<void> {
        const shadow = this.attachShadow({ mode: 'open' });
        const styleTag = document.createElement('style');
        styleTag.textContent = await this.styles();
        shadow.appendChild(styleTag);

        await this.render(shadow);
    }

    connectedCallback(): void {}

    disconnectedCallback(): void {}

    protected abstract render(shadow: ShadowRoot): void | Promise<void>;

    protected abstract styles(): string | Promise<string>;

    public static getTagName(): string {
        return this.name;
    }

    static register<T extends CustomElement = CustomElement>(
        this: CustomElementInterface<T>,
        registry: CustomElementRegistry,
    ): void {
        registry.define(this.getTagName(), this);
    }
}

export interface CustomElementInterface<T extends CustomElement = CustomElement> {
    new (): T;
    getTagName(): string;
    register(registry: CustomElementRegistry): void;
}
