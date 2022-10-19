import './style.pcss';
import { setup as configureCustomElements } from './components';
import { setup as configureTextAreaElements } from './modules/text-area';

document.addEventListener('DOMContentLoaded', () => {
    configureCustomElements();
    configureTextAreaElements();
});
