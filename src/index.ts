// TS Imports
import './code.iconify.design_iconify-icon_1.0.7_iconify-icon.min';
import * as ieJSON from './importExport';
import * as wcGlobal from './global';
import * as bgImg from './background-image';
import './background-color';
import './numberToWords.min';
import './clock-new';
import './clock-color';
import { applyURLParams } from './utils/url-params';

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
});
