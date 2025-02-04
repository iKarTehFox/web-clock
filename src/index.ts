// TS Imports
import 'iconify-icon';
import './utils/iconify-preload';
import * as bootstrap from 'bootstrap';
import './global';
import './background-image';
import './background-color';
import './numberToWords.min';
import './time';
import './clock-color';
import './stopwatch';
import './countdown';
import './utils/debugUI';
import './utils/kbd-shortcuts';
import { applyURLParams } from './utils/url-params';
import { populateTimeZoneSelect } from './time';

// Functions to run when DOM has loaded
window.addEventListener('DOMContentLoaded', () => {
    applyURLParams();
    populateTimeZoneSelect(); // This might be performance hungry...

    // Initialize Bootstrap tooltips
    const tooltipTriggerList = (document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipTriggerElArray = Array.from(tooltipTriggerList);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const tooltipList = tooltipTriggerElArray.map(tooltipTriggerEl => {
        return new bootstrap.Tooltip(tooltipTriggerEl); 
    });
});
