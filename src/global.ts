import { getElement, getElements } from './utils/dom-utils';
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
    container: getElement<HTMLDivElement>('menu-container'),
    clockmoderadio: getElements<HTMLInputElement>('input[name="clock-mode-radio"]'),
    timeMethodSelect: getElement<HTMLSelectElement>('timeMethodSelect'),
    secondsvisradio: getElements<HTMLInputElement>('input[name="seconds-vis-radio"]'),
    secondsbarradio: getElements<HTMLInputElement>('input[name="seconds-bar-radio"]'),
    datealignradio: getElements<HTMLInputElement>('input[name="date-position-radio"]'),
    themeradio: getElements<HTMLInputElement>('input[name="menu-theme-radio"]'),
    menubuttonvischeckbox: getElement<HTMLInputElement>('menuButtonVisible'),
    titlevischeckbox: getElement<HTMLInputElement>('menuTabTitleVisible'),
    debugcheckbox: getElement<HTMLInputElement>('debugMode'),
    options: getElement<HTMLDivElement>('menu-options'),
    obutton: getElement<HTMLButtonElement>('open-button'),
    cbutton: getElement<HTMLButtonElement>('close-button'),
    dateformselect: getElement<HTMLSelectElement>('dateFormatSelect'),
    colorbadge: getElement<HTMLParagraphElement>('current-color-badge'),
    colormoderadio: getElements<HTMLInputElement>('input[name="color-mode-radio"]'),
    presetgroup: getElement<HTMLDivElement>('presetColorGroup'),
    presetcolors: getElements<HTMLInputElement>('input[name="preset-color-radio"]'),
    textcolorgroup: getElement<HTMLDivElement>('textColorGroup'),
    textcoloroverrideradio: getElements<HTMLInputElement>('input[name="text-color-override-radio"]'),
    imagegroup: getElement<HTMLDivElement>('bgImgGroup'),
    imageuploadbutton: getElement<HTMLButtonElement>('bgImageUploadBtn'),
    imagesizeselect: getElement<HTMLSelectElement>('bgImageSizeSelect'),
    imageblurrange: getElement<HTMLInputElement>('bgImgBlurRange'),
    imageblurlabel: getElement<HTMLLabelElement>('bgImgBlurRangeLabel'),
    textcolorinput: getElement<HTMLInputElement>('textColorInput'),
    bordertyperadio: getElements<HTMLInputElement>('input[name="border-type-radio"]'),
    borderstyleselect: getElement<HTMLSelectElement>('borderStyleSelect'),
    manualjsontextinput: getElement<HTMLInputElement>('jsonImportTextarea'),
    durationdisplay: getElement<HTMLParagraphElement>('time-duration')
};

export const font = {
    familysel: getElement<HTMLSelectElement>('fontFamilySelect'),
    customfontinput: getElement<HTMLInputElement>('customFontInputForm'),
    applyfontinput: getElement<HTMLButtonElement>('applyCustomFontButton'),
    styleradio: getElements<HTMLInputElement>('input[name="font-style-radio"]'),
    weightradio: getElements<HTMLInputElement>('input[name="font-weight-radio"]'),
    sizesel: getElement<HTMLSelectElement>('sizeSelect'),
    shadowrange: getElement<HTMLInputElement>('dropShadowRange'),
    shadowlabel: getElement<HTMLLabelElement>('dropShadowRangeLabel')
};

export const dtdisplay = {
    ccontainer: getElement<HTMLDivElement>('clock-container'),
    tcontainer: getElement<HTMLDivElement>('time-container'),
    hourSlot: getElement<HTMLSpanElement>('hour-slot'),
    colon1: getElement<HTMLSpanElement>('colon1'),
    minuteSlot: getElement<HTMLSpanElement>('minute-slot'),
    colon2: getElement<HTMLSpanElement>('colon2'),
    secondSlot: getElement<HTMLSpanElement>('second-slot'),
    indicatorSlot: getElement<HTMLSpanElement>('indicator'),
    date: getElement<HTMLParagraphElement>('date'),
    secondsBar: getElement<HTMLDivElement>('seconds-progress-bar')
};

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
        break;
    case 'weight':
        dtdisplay.ccontainer.style.fontWeight = value;
        break;
    case 'size':
        if (fontSize in fontSizeOptions) { // Check if the casted value is a valid key
            dtdisplay.ccontainer.style.fontSize = value;
            dtdisplay.indicatorSlot.style.fontSize = fontSizeOptions[fontSize];
            dtdisplay.date.style.fontSize = fontSizeOptions[fontSize];
        } else {
            console.error(`ERROR - Invalid font size: ${value}`);
        }
        break;
    case 'family':
        dtdisplay.ccontainer.style.fontFamily = value;
        break;
    default:
        console.error(`ERROR - Invalid font modification type: ${type}`);
        break;
    }
}

// Seconds visibility listener
menu.secondsvisradio.forEach((radio) => {
    radio.addEventListener('change', () => {
        const value = radio.dataset.value;
        dtdisplay.colon2.style.display = value as string;
        dtdisplay.secondSlot.style.display = value as string;
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
    });
});

// Date alignment listener
menu.datealignradio.forEach((radio) => {
    radio.addEventListener('change', () => {
        const value = radio.dataset.value;
        dtdisplay.date.style.textAlign = value as string;
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
            break;
        default:
            console.error(`ERROR - Invalid border type: ${value}`);
            break;
        }
    });
});

// Border style listener
menu.borderstyleselect.addEventListener('change', () => {
    if (menu.bordertyperadio[1].checked) {
        dtdisplay.tcontainer.style.borderStyle = menu.borderstyleselect.value;
    } else if (menu.bordertyperadio[2].checked) {
        dtdisplay.tcontainer.style.borderBottomStyle = menu.borderstyleselect.value;
    }
});

// Border type listener
menu.themeradio.forEach((radio) => {
    radio.addEventListener('change', () => {
        if (radio.id === 'lightthememode') {
            menu.container.dataset.bsTheme = 'light';
            menu.options.style.backgroundColor = '#ffffff';
            menu.options.style.color = '#212529';
        } else if (radio.id === 'darkthememode') {
            menu.container.dataset.bsTheme = 'dark';
            menu.options.style.backgroundColor = '#313539';
            menu.options.style.color = '#fff';
        }
    });
});

// Utility function for toggling element visibility
export function elementDisplay(htmlobj: HTMLElement, isVisible: boolean) {
    htmlobj.style.display = isVisible ? 'block' : 'none';
}

function toggleMenuVisibility(show: boolean) {
    if (show) {
        menu.options.classList.add('menu-options-show');
        elementDisplay(menu.cbutton, true);
        elementDisplay(menu.obutton, false);
    } else {
        menu.options.classList.remove('menu-options-show');
        elementDisplay(menu.cbutton, false);
        if (menu.menubuttonvischeckbox.checked) {
            elementDisplay(menu.obutton, true);
        } else {
            elementDisplay(menu.obutton, false);
        }
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
        if (!menu.options.contains((e.target as Node)) && !menu.obutton.contains((e.target as Node)) && !menu.cbutton.contains((e.target as Node))) {
            toggleMenuVisibility(false);
        }
    });
});

// Menu button visibility on double click
document.addEventListener('dblclick', function(e) {
    if (!menu.options.contains(e.target as Node) && !menu.obutton.contains(e.target as Node) && !menu.cbutton.contains(e.target as Node)) {
        elementDisplay(menu.obutton, true);
        menu.menubuttonvischeckbox.checked = true;
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
}

menu.menubuttonvischeckbox.addEventListener('change', function(e) {
    if (menu.menubuttonvischeckbox.checked) {
        // Show the menu button
        if (!menu.options.contains(e.target as Node) && !menu.obutton.contains(e.target as Node) && !menu.cbutton.contains(e.target as Node)) {
            menu.obutton.style.display = 'block';
        }
    } else {
        // Hide the menu button
        menu.obutton.style.display = 'none';
    }
});
