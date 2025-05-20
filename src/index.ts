// TS Imports
import './assets/locales/i18n';
import 'iconify-icon';
import './utils/iconify-preload';
import './global';
import './background-image';
import './time';
import './clock-color';
import './stopwatch';
import './countdown';
import './utils/kbd-shortcuts';
import { applyURLParams } from './utils/url-params';
import { populateTimeZoneSelect } from './time';
import { Tooltip } from 'bootstrap';

// Functions to run when DOM has loaded
window.addEventListener('DOMContentLoaded', () => {
    applyURLParams();
    populateTimeZoneSelect(); // This might be performance hungry...

    // Initialize Bootstrap tooltips
    const tooltipTriggerList = (document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipTriggerElArray = Array.from(tooltipTriggerList);
    const tooltipList = tooltipTriggerElArray.map(tooltipTriggerEl => {
        return new Tooltip(tooltipTriggerEl); 
    });
});
