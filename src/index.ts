// IMPORTS WILL BE FRAGMENTED INTO THEIR OWN DIRECTORIES/INDEX.TS IN THE FUTURE

// TS
import './code.iconify.design_iconify-icon_1.0.7_iconify-icon.min';
import * as ieJSON from './importExportJSON';
import * as wcGlobal from './global';
import * as bgImg from './background-image';
import './background-color';
import './numberToWords.min';
import './clock-new';
import './clock-color';

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

// CSS
import './css/global.css';
import './css/fonts.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/bootstrap-social.css';

// Presets (JSON)
import './assets/usdonlineclock-amoled-preset.json';
import './assets/usdonlineclock-devfavorite-preset.json';
import './assets/usdonlineclock-digitsbinary-preset.json';
import './assets/usdonlineclock-minimallight-preset.json';
import './assets/usdonlineclock-preset.json';

// SVGs
import './icons/clock-time-1.svg';
import './icons/clock-time-2.svg';
import './icons/clock-time-3.svg';
import './icons/clock-time-4.svg';
import './icons/clock-time-5.svg';
import './icons/clock-time-6.svg';
import './icons/clock-time-7.svg';
import './icons/clock-time-8.svg';
import './icons/clock-time-9.svg';
import './icons/clock-time-10.svg';
import './icons/clock-time-11.svg';
import './icons/clock-time-12.svg';

