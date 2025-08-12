import { getElement, getElements } from './dom-selectors';

export const doc = {
    blurpanel: getElement<HTMLDivElement>('blur-panel'),
    cnote: getElement<HTMLParagraphElement>('custom-note'),
    favicon: getElement<HTMLLinkElement>('favicon'),
    themecolormeta: getElement<HTMLMetaElement>('theme-color-meta')
};

export const panel = {
    container: getElement<HTMLDivElement>('panel-container'),
    devconbutton: getElement<HTMLDivElement>('devcon-button'),
    menubody: getElement<HTMLDivElement>('menu-body'),
    menubutton: getElement<HTMLButtonElement>('menu-button'),
    // Settings sections
    section: {
        bt: getElement<HTMLDivElement>('panel-section-bt'),
        dbg: getElement<HTMLDivElement>('panel-section-dbg'),
        do: getElement<HTMLDivElement>('panel-section-do'),
        dt: getElement<HTMLDivElement>('panel-section-dt'),
        fc: getElement<HTMLDivElement>('panel-section-fc'),
        ie: getElement<HTMLDivElement>('panel-section-ie'),
        we: getElement<HTMLDivElement>('panel-section-we')
    }
};

export const devcon = {
    closebtn: getElement<HTMLButtonElement>('dev-console-close'),
    container: getElement<HTMLDivElement>('dev-console-container'),
    header: getElement<HTMLDivElement>('dev-console-header'),
    input: getElement<HTMLInputElement>('dev-console-input'),
    logs: getElement<HTMLDivElement>('dev-console-logs'),
    output: getElement<HTMLDivElement>('dev-console-output'),
    submitbtn: getElement<HTMLButtonElement>('dev-console-submit'),
    debugfilterbtn: getElement<HTMLInputElement>('dev-console-logs-debug'),
    infofilterbtn: getElement<HTMLInputElement>('dev-console-logs-info'),
    warningfilterbtn: getElement<HTMLInputElement>('dev-console-logs-warning'),
    errorfilterbtn: getElement<HTMLInputElement>('dev-console-logs-error')
};

export const menu = {
    autorestartgroup: getElement<HTMLDivElement>('autorestart-group'),
    autorestarttime: getElement<HTMLSpanElement>('autorestart-time'),
    borderstyleselect: getElement<HTMLSelectElement>('borderStyleSelect'),
    bordertyperadio: getElements<HTMLInputElement>('input[name="border-type-radio"]'),
    clockmoderadio: getElements<HTMLInputElement>('input[name="clock-mode-radio"]'),
    cnotealignradio: getElements<HTMLInputElement>('input[name="note-alignment-radio"]'),
    cnoteinput: getElement<HTMLInputElement>('cnote-input'),
    colorbadge: getElement<HTMLParagraphElement>('currentColorBadge'),
    colorbadgelabel: getElement<HTMLDivElement>('currentColorLabel'),
    colormodeselect: getElement<HTMLSelectElement>('colorModeSelect'),
    container: getElement<HTMLDivElement>('menu-offcanvas'),
    datealignradio: getElements<HTMLInputElement>('input[name="date-position-radio"]'),
    dateformselect: getElement<HTMLSelectElement>('dateFormatSelect'),
    durationdisplay: getElement<HTMLParagraphElement>('time-duration'),
    fadegroup: getElement<HTMLDivElement>('fadeGroup'),
    faderesetbutton: getElement<HTMLButtonElement>('fadeTransitionResetBtn'),
    fadetransrange: getElement<HTMLInputElement>('fadeTransitionRange'),
    fadetransrangelabel: getElement<HTMLLabelElement>('fadeTransitionRangeLabel'),
    fullscreenbtn: getElement<HTMLButtonElement>('fs-toggle'),
    githubbtn: getElement<HTMLButtonElement>('github-btn'),
    imageblurlabel: getElement<HTMLLabelElement>('bgImgBlurRangeLabel'),
    imageblurrange: getElement<HTMLInputElement>('bgImgBlurRange'),
    imagegroup: getElement<HTMLDivElement>('bgImgGroup'),
    imagesizeselect: getElement<HTMLSelectElement>('bgImageSizeSelect'),
    imageuploadbutton: getElement<HTMLButtonElement>('bgImageUploadBtn'),
    jsonpresetsgroup: getElement<HTMLDivElement>('jsonPresetsContainer'),
    languageradio: getElements<HTMLInputElement>('input[name="language-radio"]'),
    legacyrefreshcheckbox: getElement<HTMLInputElement>('legacyRefreshMethod'),
    manualjsontextinput: getElement<HTMLInputElement>('jsonImportTextarea'),
    panelvischeckbox: getElement<HTMLInputElement>('panelVisible'),
    presetcolors: getElements<HTMLInputElement>('input[name="preset-color-radio"]'),
    presetgroup: getElement<HTMLDivElement>('presetColorGroup'),
    secondsvisradio: getElements<HTMLInputElement>('input[name="seconds-vis-radio"]'),
    textcolorgroup: getElement<HTMLDivElement>('textColorGroup'),
    textcolorinput: getElement<HTMLInputElement>('textColorInput'),
    textcolorlabel: getElement<HTMLLabelElement>('textColorLabel'),
    textcoloroverrideradio: getElements<HTMLInputElement>('input[name="text-color-override-radio"]'),
    themeselect: getElement<HTMLSelectElement>('menuThemeSelect'),
    timebarselect: getElement<HTMLInputElement>('timeBarSelect'),
    timemethodselect: getElement<HTMLSelectElement>('timeMethodSelect'),
    timezoneselect: getElement<HTMLSelectElement>('timeZoneSelect'),
    titlevischeckbox: getElement<HTMLInputElement>('menuTabTitleVisible'),
    versionlabelclk: getElement<HTMLDivElement>('versionLabelClk'),
    weatherapiinput: getElement<HTMLInputElement>('weatherAppIDTextArea'),
    weathergeobtn: getElement<HTMLButtonElement>('weatherGeoBtn'),
    weatherlatinput: getElement<HTMLInputElement>('weatherLatTextArea'),
    weatherloninput: getElement<HTMLInputElement>('weatherLonTextArea'),
    weathermovereset: getElement<HTMLButtonElement>('weatherMoveReset'),
    weathermovetoggle: getElement<HTMLInputElement>('weatherMoveToggle'),
    weatherposlabel: getElement<HTMLParagraphElement>('weatherPosLabel'),
    weatherstopbtn: getElement<HTMLButtonElement>('weatherStopBtn'),
    weathersubmitbtn: getElement<HTMLButtonElement>('weatherSubmitBtn'),
    weatherunitradio: getElements<HTMLInputElement>('input[name="weather-unit-radio"]')
};

export const font = {
    customfontinput: getElement<HTMLInputElement>('customFontInputForm'),
    familysel: getElement<HTMLSelectElement>('fontFamilySelect'),
    shadowlabel: getElement<HTMLLabelElement>('dropShadowRangeLabel'),
    shadowrange: getElement<HTMLInputElement>('dropShadowRange'),
    sizesel: getElement<HTMLSelectElement>('sizeSelect'),
    strokecolor: getElement<HTMLInputElement>('textStrokeColor'),
    strokecolorlabel: getElement<HTMLLabelElement>('textStrokeColorLabel'),
    strokerange: getElement<HTMLInputElement>('textStrokeRange'),
    strokerangelabel: getElement<HTMLLabelElement>('textStrokeRangeLabel')
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
    tcontainer: getElement<HTMLDivElement>('time-container'),
    timeBar: getElement<HTMLDivElement>('time-progress-bar')
};

export const weather = {
    condition: getElement<HTMLParagraphElement>('weather-condition'),
    container: getElement<HTMLDivElement>('weather-widget'),
    feelslike: getElement<HTMLParagraphElement>('weather-feelslike'),
    icon: getElement<HTMLElement>('weather-icon'),
    maxtemp: getElement<HTMLParagraphElement>('weather-max'),
    mintemp: getElement<HTMLParagraphElement>('weather-min'),
    name: getElement<HTMLParagraphElement>('weather-name'),
    temp: getElement<HTMLParagraphElement>('weather-temp'),
    wind: getElement<HTMLParagraphElement>('weather-wind')
};

export const stopwatch = {
    container: getElement<HTMLDivElement>('stopwatch-container'),
    display: getElement<HTMLHeadingElement>('stopwatch-display'),
    lapbtn: getElement<HTMLButtonElement>('stopwatch-lap'),
    lapfield: getElement<HTMLButtonElement>('stopwatch-lapfield'),
    obutton: getElement<HTMLButtonElement>('stopwatch-button'),
    pausebtn: getElement<HTMLButtonElement>('stopwatch-pause'),
    resetbtn: getElement<HTMLButtonElement>('stopwatch-reset'),
    startbtn: getElement<HTMLButtonElement>('stopwatch-start')
};

export const countdown = {
    container: getElement<HTMLDivElement>('countdown-container'),
    display: getElement<HTMLHeadingElement>('countdown-display'),
    hrsinput: getElement<HTMLInputElement>('countdown-hours'),
    mininput: getElement<HTMLInputElement>('countdown-minutes'),
    notifcheckbox: getElement<HTMLInputElement>('countdown-notif-checkbox'),
    obutton: getElement<HTMLButtonElement>('countdown-button'),
    pausebtn: getElement<HTMLButtonElement>('countdown-pause'),
    resetbtn: getElement<HTMLButtonElement>('countdown-reset'),
    secinput: getElement<HTMLInputElement>('countdown-seconds'),
    startbtn: getElement<HTMLButtonElement>('countdown-start')
};

export const debug = {
    clearlsbtn: getElement<HTMLButtonElement>('debugClearLS'),
    container: getElement<HTMLDivElement>('debuggingContainer'),
    devcolorscontainer: getElement<HTMLDivElement>('devColorsContainer'),
    info:  getElement<HTMLParagraphElement>('debugInfo'),
    rmclockbtn: getElement<HTMLButtonElement>('debugRmClock'),
    toastbtns: getElements<HTMLButtonElement>('button[name="debugToast"]')
};
