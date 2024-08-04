// TS Imports
import 'iconify-icon';
import * as ieJSON from './importExport';
import * as wcGlobal from './global';
import * as bgImg from './background-image';
import './background-color';
import './numberToWords.min';
import './clock-new';
import './clock-color';
import './stopwatch';
import './countdown';
import { applyURLParams } from './utils/url-params';
import { populateTimeZoneSelect } from './clock-new';

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
});
