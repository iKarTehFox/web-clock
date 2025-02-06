import { getElement, getElements } from './dom-utils';

export const doc = {
    blurpanel: getElement<HTMLDivElement>('blur-panel'),
    favicon: getElement<HTMLLinkElement>('favicon'),
    themecolormeta: getElement<HTMLMetaElement>('theme-color-meta'),
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
    durationdisplay: getElement<HTMLParagraphElement>('time-duration'),
    fadegroup: getElement<HTMLDivElement>('fadeGroup'),
    faderesetbutton: getElement<HTMLButtonElement>('fadeTransitionResetBtn'),
    fadetransrange: getElement<HTMLInputElement>('fadeTransitionRange'),
    fadetransrangelabel: getElement<HTMLLabelElement>('fadeTransitionRangeLabel'),
    fullscreenbtn: getElement<HTMLButtonElement>('fs-toggle'),
    githubbtn: getElement<HTMLButtonElement>('github-btn'),
    imageblurrange: getElement<HTMLInputElement>('bgImgBlurRange'),
    imageblurlabel: getElement<HTMLLabelElement>('bgImgBlurRangeLabel'),
    imagegroup: getElement<HTMLDivElement>('bgImgGroup'),
    imageuploadbutton: getElement<HTMLButtonElement>('bgImageUploadBtn'),
    imagesizeselect: getElement<HTMLSelectElement>('bgImageSizeSelect'),
    jsonexportclipbtn: getElement<HTMLButtonElement>('jsonExportClipBtn'),
    jsonexportdownloadbtn: getElement<HTMLButtonElement>('jsonExportDlBtn'),
    jsonexportqrbtn: getElement<HTMLButtonElement>('jsonExportQrBtn'),
    jsonimportuploadbtn: getElement<HTMLButtonElement>('jsonImportUlBtn'),
    jsonimportqrbtn: getElement<HTMLButtonElement>('jsonImportQrBtn'),
    jsonmanualimportbtn: getElement<HTMLButtonElement>('jsonImportTxtBtn'),
    jsonpresetsgroup: getElement<HTMLDivElement>('jsonPresetsContainer'),
    legacyrefreshcheckbox: getElement<HTMLInputElement>('legacyRefreshMethod'),
    manualjsontextinput: getElement<HTMLInputElement>('jsonImportTextarea'),
    panelvischeckbox: getElement<HTMLInputElement>('panelVisible'),
    obutton: getElement<HTMLButtonElement>('open-button'),
    options: getElement<HTMLDivElement>('menu-options'),
    presetcolors: getElements<HTMLInputElement>('input[name="preset-color-radio"]'),
    presetgroup: getElement<HTMLDivElement>('presetColorGroup'),
    timebarselect: getElement<HTMLInputElement>('timeBarSelect'),
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
    weatherunitradio: getElements<HTMLInputElement>('input[name="weather-unit-radio"]'),
    weathermovetoggle: getElement<HTMLInputElement>('weatherMoveToggle'),
    weathermovereset: getElement<HTMLButtonElement>('weatherMoveReset'),
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
    timeBar: getElement<HTMLDivElement>('time-progress-bar'),
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
    resetbtn: getElement<HTMLButtonElement>('stopwatch-reset'),
    lapbtn: getElement<HTMLButtonElement>('stopwatch-lap'),
    lapfield: getElement<HTMLButtonElement>('stopwatch-lapfield')
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
    secinput: getElement<HTMLInputElement>('countdown-seconds'),
    notifcheckbox: getElement<HTMLInputElement>('countdown-notif-checkbox'),
};

export const debug = {
    cardoverlaybtns: getElements<HTMLButtonElement>('button[name="debugCard"]'),
    container: getElement<HTMLDivElement>('debuggingContainer'),
    devcolorscontainer: getElement<HTMLDivElement>('devColorsContainer'),
    getbgimgbtn: getElement<HTMLButtonElement>('debugGetBGBtn'),
    jsonexportcardbtn: getElement<HTMLButtonElement>('jsonExportCardBtn'),
    jsonexportconsolebtn:  getElement<HTMLButtonElement>('jsonExportConsoleBtn'),
    toastbtns: getElements<HTMLButtonElement>('button[name="debugToast"]'),
    uastring: getElement<HTMLParagraphElement>('debugUAString'),
    localstring: getElement<HTMLParagraphElement>('debugLocString'),
    rmclockbtn: getElement<HTMLButtonElement>('debugRmClock'),
};