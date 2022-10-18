import { CustomElement, CustomElementInterface } from './components/CustomElement';
import { GeoMap } from './components/GeoMap';
import { MapMarker } from './components/MapMarker';
import { MapPopup } from './components/MapPopup';
import { ScrollIndicator } from './components/ScrollIndicator';
import './components'
import './style.pcss';
import { setup as configureTextAreaElements } from './modules/text-area';

/*
const elements: CustomElementInterface<CustomElement>[] = [
    GeoMap,
    MapMarker,
    MapPopup,
    ScrollIndicator,
];
elements.forEach(element => element.register(customElements));
*/

configureTextAreaElements();
