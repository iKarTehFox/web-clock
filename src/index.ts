// TS Imports
import 'iconify-icon';
import './utils/iconify-preload';
import * as bootstrap from 'bootstrap';
import * as ieJSON from './importExport';
import * as wcGlobal from './global';
import * as bgImg from './background-image';
import './background-color';
import './numberToWords.min';
import './time';
import './clock-color';
import './stopwatch';
import './countdown';
import './utils/debugUI';
import { applyURLParams } from './utils/url-params';
import { populateTimeZoneSelect } from './time';
import { generatePresetButtons } from './assets/presets';

// Export some functions globally for HTML
declare global {
    interface Window {
        ieJSON: any;
        bgImg: any;
        wcGlobal: any;
    }
}

window.ieJSON = ieJSON;
window.bgImg = bgImg;
window.wcGlobal = wcGlobal;

// Functions to run when DOM has loaded
window.addEventListener('DOMContentLoaded', () => {
    applyURLParams();
    populateTimeZoneSelect(); // This might be performance hungry...
    generatePresetButtons();

    // Initialize Bootstrap tooltips
    const tooltipTriggerList = (document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipTriggerElArray = Array.from(tooltipTriggerList);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const tooltipList = tooltipTriggerElArray.map(tooltipTriggerEl => {
        return new bootstrap.Tooltip(tooltipTriggerEl); 
    });
});
