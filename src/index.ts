// TS Imports
import './assets/locales/i18n';
import './global';
import './background-image';
import './time';
import './clock-color';
import './stopwatch';
import './countdown';
import './utils/kbd-shortcuts';
import './utils/debug-console';
import { applyURLParams } from './utils/url-params';
import { populateTimeZoneSelect } from './time';
import { Tooltip } from 'bootstrap';
import { initDebugConsole } from './utils/debug-console';

// Functions to run when DOM has loaded
window.addEventListener('DOMContentLoaded', () => {
    applyURLParams();
    populateTimeZoneSelect(); // This might be performance hungry...
    initDebugConsole();

    // Initialize Bootstrap tooltips
    const tooltipTriggerList = (document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipTriggerElArray = Array.from(tooltipTriggerList);
    const tooltipList = tooltipTriggerElArray.map(tooltipTriggerEl => {
        return new Tooltip(tooltipTriggerEl); 
    });
});
