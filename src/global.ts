import { getElement, getElements, logConsole, showToast } from './utils/dom-utils';
import { getLocation, stopWeather, submitWeatherSettings } from './utils/weather-utils';
import * as bootstrap from 'bootstrap';

const tooltipTriggerList = (document.querySelectorAll('[data-bs-toggle="tooltip"]'));
const tooltipTriggerElArray = Array.from(tooltipTriggerList);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const tooltipList = tooltipTriggerElArray.map(tooltipTriggerEl => {
    return new bootstrap.Tooltip(tooltipTriggerEl); 
});

export const doc = {
    blurpanel: getElement<HTMLDivElement>('blur-panel'),
    favicon: getElement<HTMLLinkElement>('favicon')
};

export const menu = {
    autorestarttime: getElement<HTMLSpanElement>('autorestart-time'),
    bordertyperadio: getElements<HTMLInputElement>('input[name="border-type-radio"]'),
    borderstyleselect: getElement<HTMLSelectElement>('borderStyleSelect'),
    cbutton: getElement<HTMLButtonElement>('close-button'),
    clockmoderadio: getElements<HTMLInputElement>('input[name="clock-mode-radio"]'),
    colorbadge: getElement<HTMLParagraphElement>('currentColorBadge'),
    colorbadgelabel: getElement<HTMLDivElement>('currentColorLabel'),
    colormoderadio: getElements<HTMLInputElement>('input[name="color-mode-radio"]'),
    container: getElement<HTMLDivElement>('menu-container'),
    datealignradio: getElements<HTMLInputElement>('input[name="date-position-radio"]'),
    dateformselect: getElement<HTMLSelectElement>('dateFormatSelect'),
    debugcheckbox: getElement<HTMLInputElement>('debugMode'),
    durationdisplay: getElement<HTMLParagraphElement>('time-duration'),
    fadegroup: getElement<HTMLDivElement>('fadeGroup'),
    faderesetbutton: getElement<HTMLButtonElement>('fadeTransitionResetBtn'),
    fadetransrange: getElement<HTMLInputElement>('fadeTransitionRange'),
    fadetransrangelabel: getElement<HTMLLabelElement>('fadeTransitionRangeLabel'),
    imageblurrange: getElement<HTMLInputElement>('bgImgBlurRange'),
    imageblurlabel: getElement<HTMLLabelElement>('bgImgBlurRangeLabel'),
    imagegroup: getElement<HTMLDivElement>('bgImgGroup'),
    imageuploadbutton: getElement<HTMLButtonElement>('bgImageUploadBtn'),
    imagesizeselect: getElement<HTMLSelectElement>('bgImageSizeSelect'),
    legacyrefreshcheckbox: getElement<HTMLInputElement>('legacyRefreshMethod'),
    manualjsontextinput: getElement<HTMLInputElement>('jsonImportTextarea'),
    panelvischeckbox: getElement<HTMLInputElement>('panelVisible'),
    obutton: getElement<HTMLButtonElement>('open-button'),
    options: getElement<HTMLDivElement>('menu-options'),
    presetcolors: getElements<HTMLInputElement>('input[name="preset-color-radio"]'),
    presetgroup: getElement<HTMLDivElement>('presetColorGroup'),
    secondsbarradio: getElements<HTMLInputElement>('input[name="seconds-bar-radio"]'),
    secondsvisradio: getElements<HTMLInputElement>('input[name="seconds-vis-radio"]'),
    textcolorinput: getElement<HTMLInputElement>('textColorInput'),
    textcolorgroup: getElement<HTMLDivElement>('textColorGroup'),
    textcolorlabel: getElement<HTMLLabelElement>('textColorLabel'),
    textcoloroverrideradio: getElements<HTMLInputElement>('input[name="text-color-override-radio"]'),
    themeradio: getElements<HTMLInputElement>('input[name="menu-theme-radio"]'),
    timemethodselect: getElement<HTMLSelectElement>('timeMethodSelect'),
    timezoneselect: getElement<HTMLSelectElement>('timeZoneSelect'),
    titlevischeckbox: getElement<HTMLInputElement>('menuTabTitleVisible'),
    weatherapiinput: getElement<HTMLInputElement>('weatherAppIDTextArea'),
    weathergeobtn: getElement<HTMLButtonElement>('weatherGeoBtn'),
    weatherlatinput: getElement<HTMLInputElement>('weatherLatTextArea'),
    weatherloninput: getElement<HTMLInputElement>('weatherLonTextArea'),
    weathersubmitbtn: getElement<HTMLButtonElement>('weatherSubmitBtn'),
    weatherstopbtn: getElement<HTMLButtonElement>('weatherStopBtn'),
    weatherunitradio: getElements<HTMLInputElement>('input[name="weather-unit-radio"]')
};

export const font = {
    applyfontinput: getElement<HTMLButtonElement>('applyCustomFontButton'),
    customfontinput: getElement<HTMLInputElement>('customFontInputForm'),
    familysel: getElement<HTMLSelectElement>('fontFamilySelect'),
    shadowlabel: getElement<HTMLLabelElement>('dropShadowRangeLabel'),
    shadowrange: getElement<HTMLInputElement>('dropShadowRange'),
    sizesel: getElement<HTMLSelectElement>('sizeSelect'),
    styleradio: getElements<HTMLInputElement>('input[name="font-style-radio"]'),
    strokecolor: getElement<HTMLInputElement>('textStrokeColor'),
    strokecolorlabel: getElement<HTMLLabelElement>('textStrokeColorLabel'),
    strokerange: getElement<HTMLInputElement>('textStrokeRange'),
    strokerangelabel: getElement<HTMLLabelElement>('textStrokeRangeLabel'),
    weightradio: getElements<HTMLInputElement>('input[name="font-weight-radio"]')
};

export const dtdisplay = {
    ccontainer: getElement<HTMLDivElement>('clock-container'),
    colon1: getElement<HTMLSpanElement>('colon1'),
    colon2: getElement<HTMLSpanElement>('colon2'),
    date: getElement<HTMLParagraphElement>('date'),
    hourSlot: getElement<HTMLSpanElement>('hour-slot'),
    indicatorSlot: getElement<HTMLSpanElement>('indicator'),
    minuteSlot: getElement<HTMLSpanElement>('minute-slot'),
    secondSlot: getElement<HTMLSpanElement>('second-slot'),
    secondsBar: getElement<HTMLDivElement>('seconds-progress-bar'),
    tcontainer: getElement<HTMLDivElement>('time-container')
};

export const weather = {
    condition: getElement<HTMLParagraphElement>('weather-condition'),
    container: getElement<HTMLDivElement>('weather-widget'),
    feelslike: getElement<HTMLParagraphElement>('weather-feelslike'),
    icon: document.getElementById('weather-icon'),
    maxtemp: getElement<HTMLParagraphElement>('weather-max'),
    mintemp: getElement<HTMLParagraphElement>('weather-min'),
    name: getElement<HTMLParagraphElement>('weather-name'),
    temp: getElement<HTMLParagraphElement>('weather-temp'),
    wind: getElement<HTMLParagraphElement>('weather-wind')
};

export const stopwatch = {
    container: getElement<HTMLDivElement>('stopwatch-container'),
    obutton: getElement<HTMLButtonElement>('stopwatch-button'),
    display: getElement<HTMLHeadingElement>('stopwatch-display'),
    startbtn: getElement<HTMLButtonElement>('stopwatch-start'),
    pausebtn: getElement<HTMLButtonElement>('stopwatch-pause'),
    resetbtn: getElement<HTMLButtonElement>('stopwatch-reset')
};

export const countdown = {
    container: getElement<HTMLDivElement>('countdown-container'),
    obutton: getElement<HTMLButtonElement>('countdown-button'),
    display: getElement<HTMLHeadingElement>('countdown-display'),
    startbtn: getElement<HTMLButtonElement>('countdown-start'),
    pausebtn: getElement<HTMLButtonElement>('countdown-pause'),
    resetbtn: getElement<HTMLButtonElement>('countdown-reset'),
    hrsinput: getElement<HTMLInputElement>('countdown-hours'),
    mininput: getElement<HTMLInputElement>('countdown-minutes'),
    secinput: getElement<HTMLInputElement>('countdown-seconds')
};

// Fix menu button spacing
menu.obutton.innerHTML = '<iconify-icon inline icon="mdi:menu"></iconify-icon> Menu';
menu.cbutton.innerHTML = '<iconify-icon inline icon="mdi:close"></iconify-icon> Close';
stopwatch.obutton.innerHTML = '<iconify-icon inline icon="mdi:timer"></iconify-icon>';
countdown.obutton.innerHTML = '<iconify-icon inline icon="mdi:timer-sand-complete"></iconify-icon>';

// Define font sizes
type FontSizeKey = '6vw' | '8vw' | '10vw' | '12vw' | '14vw' | '18vw';

const fontSizeOptions: Record<FontSizeKey, string> = {
    '6vw': '1vw',
    '8vw': '1.25vw',
    '10vw': '1.5vw',
    '12vw': '2vw',
    '14vw': '2.25vw',
    '18vw': '3vw'
};

// Font style handler function
function modifyFontStyle(type: string, value: string) {
    const fontSize = value as FontSizeKey;
    switch (type) {
    case 'style':
        dtdisplay.ccontainer.style.fontStyle = value;
        stopwatch.display.style.fontStyle = value;
        countdown.display.style.fontStyle = value;
        logConsole(`Font style set to: ${value}`, 'info');
        break;
    case 'weight':
        dtdisplay.ccontainer.style.fontWeight = value;
        stopwatch.display.style.fontWeight = value;
        countdown.display.style.fontWeight = value;
        logConsole(`Font weight set to: ${value}`, 'info');
        break;
    case 'size':
        if (fontSize in fontSizeOptions) { // Check if the casted value is a valid key
            dtdisplay.ccontainer.style.fontSize = value;
            dtdisplay.indicatorSlot.style.fontSize = fontSizeOptions[fontSize];
            dtdisplay.date.style.fontSize = fontSizeOptions[fontSize];
            logConsole(`Font sizing set to: ${value}`, 'info');
        } else {
            logConsole(`Invalid font size: ${value}`, 'error');
        }
        break;
    case 'family':
        dtdisplay.ccontainer.style.fontFamily = value;
        stopwatch.display.style.fontFamily = value;
        countdown.display.style.fontFamily = value;
        logConsole(`Font family set to: ${value}`, 'info');
        break;
    case 'strokewidth':
        dtdisplay.ccontainer.style.webkitTextStrokeWidth = `${value}px`;
        font.strokerangelabel.textContent = `Stroke width: ${value}px`;
        logConsole(`Font stroke width set to: ${value}px`, 'info');
        break;
    case 'strokecolor':
        dtdisplay.ccontainer.style.webkitTextStrokeColor = value;
        font.strokecolorlabel.textContent = `Stroke color: ${value}`;
        logConsole(`Font stroke color set to: ${value}`, 'info');
        break;
    default:
        logConsole(`Invalid font modification type: ${type}`, 'error');
        break;
    }
}

// Seconds visibility listener
menu.secondsvisradio.forEach((radio) => {
    radio.addEventListener('change', () => {
        const value = radio.dataset.value;
        dtdisplay.colon2.style.display = value as string;
        dtdisplay.secondSlot.style.display = value as string;
        logConsole(`Seconds visibility set to: ${value == 'none' ? 'hidden' : 'visible'}`, 'info');
    });
});

// Seconds bar visibility listener
menu.secondsbarradio.forEach((radio) => {
    radio.addEventListener('change', () => {
        const value = radio.dataset.value;
        if (value === 'block') {
            menu.bordertyperadio.forEach((btn) => {
                btn.disabled = true;
                if (btn.id === 'btyD') {
                    btn.checked = true;
                    btn.dispatchEvent(new Event('change'));
                }
            });
        } else {
            menu.bordertyperadio.forEach((btn) => {
                btn.disabled = false;
            });
        }
        dtdisplay.secondsBar.style.display = value as string;
        logConsole(`Seconds bar visibility set to: ${value == 'none' ? 'hidden' : 'visible'}`, 'info');
    });
});

// Date alignment listener
menu.datealignradio.forEach((radio) => {
    radio.addEventListener('change', () => {
        const value = radio.dataset.value;
        dtdisplay.date.style.textAlign = value as string;
        logConsole(`Date alignment set to: ${value}`, 'info');
    });
});

// Font family listener
font.familysel.addEventListener('change', function() {
    const value = font.familysel.value;
    modifyFontStyle('family', value);
    font.customfontinput.value = '';
});

// Custom font input listeners and button status function
let fontButtonStatusID: NodeJS.Timeout;

font.applyfontinput.addEventListener('click', function() {
    const customFont = font.customfontinput.value;

    if (customFont.length > 0) {
        clearTimeout(fontButtonStatusID);
        font.familysel.value = '';
        modifyFontStyle('family', customFont);
        applyFontStatus('success', 'Applied!');
    }
});

function applyFontStatus(status: string, text: string) {
    font.applyfontinput.className = `btn btn-outline-${status}`;
    font.applyfontinput.textContent = text;

    fontButtonStatusID = setTimeout(function() {
        font.applyfontinput.className = ('btn btn-outline-primary');
        font.applyfontinput.textContent = 'Submit';
    }, 2500);
}

// Font style listener
font.styleradio.forEach((radio) => {
    radio.addEventListener('change', () => {
        const value = String(radio.dataset.value);
        modifyFontStyle('style',value);
    });
});

// Font weight listener
font.weightradio.forEach((radio) => {
    radio.addEventListener('change', () => {
        const value = String(radio.dataset.value);
        modifyFontStyle('weight',value);
    });
});

// Font size listener
font.sizesel.addEventListener('change', () => {
    const value = font.sizesel.value;
    modifyFontStyle('size', value);
});

// Font text shadow listener
font.shadowrange.addEventListener('input', function() {
    const value = Number(this.value);
    const opacity = value / 5;
    const strength = value * 3;
    const dropShadowValue = `5px 5px ${strength}px rgba(0, 0, 0, ${opacity})`;
    font.shadowlabel.textContent = `Drop shadow: ${strength}px`;

    dtdisplay.ccontainer.style.textShadow = value > 0 ? dropShadowValue : '';
    logConsole(`Font text shadow set to: ${dropShadowValue}`, 'info');
});

// Border type listener
menu.bordertyperadio.forEach((radio) => {
    radio.addEventListener('change', () => {
        const value = radio.dataset.value;
        menu.borderstyleselect.disabled = value === 'none';

        switch (value) {
        case 'none':
            menu.secondsbarradio.forEach((btn) => {
                btn.disabled = false;
            });
            dtdisplay.tcontainer.style.borderStyle = value;
            dtdisplay.tcontainer.style.borderBottomStyle = value;
            logConsole(`Border type set to: ${value}`, 'info');
            break;
        case 'regular':
            menu.secondsbarradio.forEach((btn) => {
                btn.disabled = true;
                if (btn.id === 'sbaN') {
                    btn.checked = true;
                    btn.dispatchEvent(new Event('change'));
                }
            });
            dtdisplay.tcontainer.style.borderBottomStyle = 'none';
            dtdisplay.tcontainer.style.borderStyle = menu.borderstyleselect.value;
            logConsole(`Border type set to: ${value}`, 'info');
            break;
        case 'bottom':
            menu.secondsbarradio.forEach((btn) => {
                btn.disabled = true;
                if (btn.id === 'sbaN') {
                    btn.checked = true;
                    btn.dispatchEvent(new Event('change'));
                }
            });
            dtdisplay.tcontainer.style.borderStyle = 'none';
            dtdisplay.tcontainer.style.borderBottomStyle = menu.borderstyleselect.value;
            logConsole(`Border type set to: ${value}`, 'info');
            break;
        default:
            logConsole(`Invalid border type: ${value}`, 'error');
            break;
        }
    });
});

// Border style listener
menu.borderstyleselect.addEventListener('change', () => {
    const value = menu.borderstyleselect.value;
    if (menu.bordertyperadio[1].checked) {
        dtdisplay.tcontainer.style.borderStyle = value;
        logConsole(`Border style set to: ${value}`, 'info');
    } else if (menu.bordertyperadio[2].checked) {
        dtdisplay.tcontainer.style.borderBottomStyle = value;
        logConsole(`Border style set to: ${value}`, 'info');
    }
});

// Text stroke range listener
font.strokerange.addEventListener('input', function() {
    const size = this.value;
    if (parseInt(size) > 0) {
        font.strokecolor.disabled = false;
    } else {
        font.strokecolor.disabled = true;
    }
    modifyFontStyle('strokewidth', size);
});

// Text stroke color listener
font.strokecolor.addEventListener('input', function() {
    const value = this.value;
    modifyFontStyle('strokecolor', value);
});

// Weather geo button listener
menu.weathergeobtn.addEventListener('click', async () => {
    try {
        const latlonArray = await getLocation();
        menu.weatherlatinput.value = latlonArray[0].toString();
        menu.weatherloninput.value = latlonArray[1].toString();
        logConsole(`Retrieved geolocation: ${latlonArray}`, 'info');
    } catch (error) {
        logConsole(`Failed to get location: ${error}`, 'error');
    }
});

// Weather submit button listener
menu.weathersubmitbtn.addEventListener('click', () => {
    submitWeatherSettings();
    menu.weatherstopbtn.disabled = false;
});

menu.weatherstopbtn.addEventListener('click', () => {
    stopWeather();
});

// Menu theme listener
menu.themeradio.forEach((radio) => {
    radio.addEventListener('change', () => {
        if (radio.id === 'lightthememode') {
            menu.container.dataset.bsTheme = 'light';
            menu.options.style.backgroundColor = '#ffffff';
            menu.options.style.color = '#212529';
            // Weather container
            weather.container.dataset.bsTheme = 'light';
            weather.container.style.color = '#212529';
            // Stopwatch container
            stopwatch.container.dataset.bsTheme = 'light';
            stopwatch.container.style.backgroundColor = '#ffffff';
            stopwatch.container.style.color = '#212529';
            // Countdown container
            countdown.container.dataset.bsTheme = 'light';
            countdown.container.style.backgroundColor = '#ffffff';
            countdown.container.style.color = '#212529';
            logConsole(`Menu theme set to: ${radio.id}`, 'info');
            showToast('Theme set to light mode ☀️');
        } else if (radio.id === 'darkthememode') {
            menu.container.dataset.bsTheme = 'dark';
            menu.options.style.backgroundColor = '#313539';
            menu.options.style.color = '#fff';
            // Weather container
            weather.container.dataset.bsTheme = 'dark';
            weather.container.style.color = '#fff';
            // Stopwatch container
            stopwatch.container.dataset.bsTheme = 'dark';
            stopwatch.container.style.backgroundColor = '#313539';
            stopwatch.container.style.color = '#fff';
            // Countdown container
            countdown.container.dataset.bsTheme = 'dark';
            countdown.container.style.backgroundColor = '#313539';
            countdown.container.style.color = '#fff';
            logConsole(`Menu theme set to: ${radio.id}`, 'info');
            showToast('Theme set to dark mode 🌙');
        }
    });
});

// Utility function for toggling element visibility
export function elementDisplay(htmlobj: HTMLElement, isVisible: boolean) {
    htmlobj.style.display = isVisible ? 'block' : 'none';
}

function toggleMenuVisibility(show: boolean) {
    if (show) {
        menu.options.className = 'menu-options-show';
        elementDisplay(menu.cbutton, true);
        elementDisplay(menu.obutton, false);
        logConsole('Menu panel opened', 'info');
    } else {
        menu.options.className = 'menu-options-fade';
        elementDisplay(menu.cbutton, false);
        if (menu.panelvischeckbox.checked) {
            elementDisplay(menu.obutton, true);
        } else {
            elementDisplay(menu.obutton, false);
        }
        logConsole('Menu panel closed', 'info');
    }
}

// Menu button listener
menu.obutton.addEventListener('click', function() {
    toggleMenuVisibility(true);
});

// Close button listener
menu.cbutton.addEventListener('click', function() {
    toggleMenuVisibility(false);
});

// Click outside to close menu
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(e) {
        const target = e.target as HTMLElement;
        const isTooltip = target.closest('.tooltip') !== null;

        if (!isTooltip && 
            !menu.options.contains(target as Node) && 
            !menu.obutton.contains(target as Node) && 
            !menu.cbutton.contains(target as Node) && 
            !stopwatch.obutton.contains(target as Node) && 
            !countdown.obutton.contains(target as Node) && 
            !menu.options.classList.contains('menu-options-fade') && 
            !menu.options.classList.contains('menu-options-initial')) {
            toggleMenuVisibility(false);
        }
    });
});

// Esc down to close menu
document.addEventListener('keydown', function(e) {
    const isMenuVisible = !menu.options.classList.contains('menu-options-fade') && 
                          !menu.options.classList.contains('menu-options-initial');

    if (e.key === 'Escape' && isMenuVisible) {
        toggleMenuVisibility(false);
    }
});

// Menu button visibility on double click
document.addEventListener('dblclick', function(e) {
    const target = e.target as HTMLElement;
    const isMenuRelated = menu.options.contains(target) || 
                          menu.obutton.contains(target) || 
                          menu.cbutton.contains(target);

    if (!isMenuRelated) {
        elementDisplay(menu.obutton, true);
        menu.panelvischeckbox.checked = true;
        elementDisplay(stopwatch.obutton, true);
        elementDisplay(countdown.obutton, true);
    }
});

// Fullscreen function
export function toggleFullscreen() {
    const element = document.documentElement as HTMLElement & {
        mozRequestFullScreen?: () => Promise<void>;
        webkitRequestFullscreen?: (input?: any) => Promise<void>;
        msRequestFullscreen?: () => Promise<void>;
    };

    if (!document.fullscreenElement && !(document as any).mozFullScreenElement && !(document as any).webkitFullscreenElement && !(document as any).msFullscreenElement) {
        // Enter fullscreen mode
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) { // Mozilla Firefox
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) { // Chrome, Safari and Opera
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) { // Internet Explorer and Edge
            element.msRequestFullscreen();
        }
    } else {
        // Exit fullscreen mode
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
            (document as any).mozCancelFullScreen();
        } else if ((document as any).webkitExitFullscreen) {
            (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
            (document as any).msExitFullscreen();
        }
    }
    logConsole('Toggled fullscreen mode', 'info');
    showToast('Toggled fullscreen mode');
}

menu.panelvischeckbox.addEventListener('change', function(e) {
    const target = e.target as HTMLElement;
    const isMenuRelated = menu.options.contains(target) || 
                          menu.obutton.contains(target) || 
                          menu.cbutton.contains(target);

    if (menu.panelvischeckbox.checked) {
        if (!isMenuRelated) {
            menu.obutton.style.display = 'block';
        }
        elementDisplay(stopwatch.obutton, true);
        elementDisplay(countdown.obutton, true);
    } else {
        menu.obutton.style.display = 'none';
        elementDisplay(stopwatch.obutton, false);
        elementDisplay(countdown.obutton, false);
    }
});
