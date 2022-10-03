import { CustomElementInterface } from './CustomElement';

const modules = import.meta.glob<CustomElementModule>([
    './*.ts',
    '!./index.ts',
    '!./CustomElement.ts',
]);

interface CustomElementModule {
    [key: string]: CustomElementInterface;
}

for (const path in modules) {
    modules[path]().then((module: CustomElementModule) => {
        // Take the first exported symbol, as we know it must be a component
        // instance exposing a register method
        const component = Object.values(module)[0] || null;

        if (!component || !component.register) {
            return;
        }

        component.register(customElements);
    });
}

type Attributes<K extends keyof HTMLElementTagNameMap> = Partial<
    Record<
        keyof HTMLElementTagNameMap[K],
        HTMLElementTagNameMap[K][Extract<
            keyof HTMLElementTagNameMap[K],
            string
        >]
    >
> &
    Partial<{
        class: string | string[];
    }>;

export function createElement<K extends keyof HTMLElementTagNameMap>(
    type: K,
    attributes: Attributes<K> = {} as Attributes<K>,
    children: HTMLElement[] = [],
): HTMLElementTagNameMap[K] {
    const element = document.createElement(type);

    if (children.length > 0) {
        element.appendChild.apply(element, children);
    }

    return Object.entries(attributes).reduce((element, [attribute, value]) => {
        switch (attribute) {
            case 'class':
                const classes: string = Array.isArray(value)
                    ? value.join(' ')
                    : value as string;
                element.classList.add(classes);
                break;

            case 'style':
                for (let [property, styleValue] of Object.entries(value)) {
                    element.style.setProperty(property, styleValue);
                }
                break;

            default:
                element[attribute] = value;
        }

        return element;
    }, element);
}
