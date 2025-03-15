import { stopColorFade } from '../background-color';
import { menu, font } from './dom-elements';
import { getFirstElement, logConsole } from '../utils/dom-utils';

// Interfaces
interface ClockConfig {
    clockDisplay: string; 
    secondsVis: string;
    dateFormat: string;
    dateAlign: string;
    borderMode: string;
    borderStyle: string;
    timeBar: string;
    customNote: string;
    customNoteAlign: string;
}

interface FontConfig {
    fontFamily: string;
    fontStyle: string;
    fontWeight: string;
    fontSize: string;
    dropShadow: string;
    strokeWidth: string;
    strokeColor: string;
}

interface ColorThemeConfig {
    colorMode: string;
    solidColor: string;
    textColorMode: string;
    textColorValue: string;
    bgImage: string;
    bgImageSize: string;
    bgImageBlur: string;
}

// Getter functions
// Clock config
export function getClockConfig(): ClockConfig {
    return {
        clockDisplay: getClockDisplay(),
        secondsVis: getSecondsVis(),
        dateFormat: getDateFormat(),
        dateAlign: getDateAlign(),
        borderMode: getBorderMode(),
        borderStyle: getBorderStyle(),
        timeBar: getTimeBar(),
        customNote: getCustomNote(),
        customNoteAlign: getCustomNoteAlign()
    };
}

export function getClockDisplay(): string {
    return menu.timemethodselect.value;
}

export function getSecondsVis(): string {
    return getFirstElement<HTMLInputElement>('input[name="seconds-vis-radio"]:checked').id;
}

export function getDateFormat(): string {
    return menu.dateformselect.value;
}

export function getDateAlign(): string {
    return getFirstElement<HTMLInputElement>('input[name="date-position-radio"]:checked').id;
}

export function getBorderMode(): string {
    return getFirstElement<HTMLInputElement>('input[name="border-type-radio"]:checked').id;
}

export function getBorderStyle(): string {
    return menu.borderstyleselect.value;
}

export function getTimeBar(): string {
    return menu.timebarselect.value;
}

export function getCustomNote(): string {
    return menu.cnoteinput.value;
}

export function getCustomNoteAlign(): string {
    return getFirstElement<HTMLInputElement>('input[name="note-alignment-radio"]:checked').id;
}

// Font config
export function getFontConfig(): FontConfig {
    return {
        fontFamily: getFontFamily(),
        fontStyle: getFontStyle(),
        fontWeight: getFontWeight(),
        fontSize: getFontSize(),
        dropShadow: getDropShadow(),
        strokeWidth: getStrokeWidth(),
        strokeColor: parseInt(getStrokeWidth()) > 0 ? getStrokeColor() : ''
    };
}

export function getFontFamily(): string {
    return font.familysel.value;
}

export function getFontStyle(): string {
    return getFirstElement<HTMLInputElement>('input[name="font-style-radio"]:checked').id;
}

export function getFontWeight(): string {
    return getFirstElement<HTMLInputElement>('input[name="font-weight-radio"]:checked').id;
}

export function getFontSize(): string {
    return font.sizesel.value;
}

export function getDropShadow(): string {
    return font.shadowrange.value;
}

export function getStrokeWidth(): string {
    return font.strokerange.value;
}

export function getStrokeColor(): string {
    return font.strokecolor.value;
}

// Color theme config
export function getColorThemeConfig(): ColorThemeConfig {
    const colorMode = getColorMode();
    return {
        colorMode: colorMode,
        solidColor: colorMode === 'solidmode' ? getSolidColorValue() : '',
        textColorMode: getTextColorMode(),
        textColorValue: getTextColorMode() === 'tcovO' ? getTextColorValue() : '',
        bgImage: colorMode === 'imgmode' ? getBGImage() : '',
        bgImageSize: colorMode === 'imgmode' ? getBGImageSize() : '',
        bgImageBlur: colorMode === 'imgmode' ? getBGImageBlur() : ''
    };
}

export function getColorMode(): string {
    return getFirstElement<HTMLInputElement>('input[name="color-mode-radio"]:checked').id;
}

export function getSolidColorValue(): string {
    const checkedColorInput = getFirstElement<HTMLInputElement>('input[name="preset-color-radio"]:checked');
    if (checkedColorInput) {
        const colorValue = checkedColorInput.dataset.color;
        return colorValue!;
    } else {
        return '#FFFFFF';
    }
}

export function getTextColorMode(): string {
    return getFirstElement<HTMLInputElement>('input[name="text-color-override-radio"]:checked').id;
}

export function getTextColorValue(): string {
    return menu.textcolorinput.value;
}

export function getBGImage(): string {
    return document.body.style.backgroundImage;
}

export function getBGImageSize(): string {
    return menu.imagesizeselect.value;
}

export function getBGImageBlur(): string {
    return menu.imageblurrange.value;
}

// Setter functions
// Clock config
export function setClockConfig(config: ClockConfig, trigger: boolean = false): void {
    setClockDisplay(config.clockDisplay, trigger);
    setSecondsVis(config.secondsVis, trigger);
    setDateFormat(config.dateFormat, trigger);
    setDateAlign(config.dateAlign, trigger);
    setBorderMode(config.borderMode, trigger);
    setBorderStyle(config.borderStyle, trigger);
    setTimeBar(config.timeBar, trigger);
    setCustomNote(config.customNote, trigger);
    setCustomNoteAlign(config.customNoteAlign, trigger);
}

export function setClockDisplay(value: string, trigger = false): void {
    menu.timemethodselect.value = value;
    if (trigger) menu.timemethodselect.dispatchEvent(new Event('change', {bubbles: true}));
}

export function setSecondsVis(mode: string, trigger = false): void {
    const element = getFirstElement<HTMLInputElement>(`input[name="seconds-vis-radio"][id="${mode}"]`);
    element.checked = true;
    if (trigger) element.dispatchEvent(new Event('change', {bubbles: true}));
}

export function setDateFormat(format: string, trigger = false): void {
    menu.dateformselect.value = format;
    if (trigger) menu.dateformselect.dispatchEvent(new Event('change', {bubbles: true}));
}

export function setDateAlign(align: string, trigger = false): void {
    const element = getFirstElement<HTMLInputElement>(`input[name="date-position-radio"][id="${align}"]`);
    element.checked = true;
    if (trigger) element.dispatchEvent(new Event('change', {bubbles: true}));
}

export function setBorderMode(mode: string, trigger = false): void {
    const element = getFirstElement<HTMLInputElement>(`input[name="border-type-radio"][id="${mode}"]`);
    element.checked = true;
    if (trigger) element.dispatchEvent(new Event('change'));
}

export function setBorderStyle(style: string, trigger = false): void {
    menu.borderstyleselect.value = style;
    if (trigger) menu.borderstyleselect.dispatchEvent(new Event('change'));
}

export function setTimeBar(mode: string, trigger = false): void {
    menu.timebarselect.value = mode;
    if (trigger) menu.timebarselect.dispatchEvent(new Event('change', {bubbles: true}));
}

export function setCustomNote(note: string, trigger = false): void {
    if (note !== '' && note != undefined && note != null) {
        menu.cnoteinput.value = note;
        logConsole(`Note was set to ${note}`);
        if (trigger) menu.cnoteinput.dispatchEvent(new Event('input'));
    }
}

export function setCustomNoteAlign(align: string, trigger = false): void {
    const element = getFirstElement<HTMLInputElement>(`input[name="note-alignment-radio"][id="${align}"]`);
    element.checked = true;
    if (trigger) element.dispatchEvent(new Event('change'));
}

// Font config
export function setFontConfig(config: FontConfig, trigger: boolean = false): void {
    setFontFamily(config.fontFamily, trigger);
    setFontStyle(config.fontStyle, trigger);
    setFontWeight(config.fontWeight, trigger);
    setFontSize(config.fontSize, trigger);
    setStrokeWidth(config.strokeWidth, trigger);
    setStrokeColor(config.strokeColor, trigger);
}

export function setFontFamily(value: string, trigger = false): void {
    font.familysel.value = value;
    if (trigger) font.familysel.dispatchEvent(new Event('change', {bubbles: true}));
}

export function setFontStyle(style: string, trigger = false): void {
    const element = getFirstElement<HTMLInputElement>(`input[name="font-style-radio"][id="${style}"]`);
    element.checked = true;
    if (trigger) element.dispatchEvent(new Event('change', {bubbles: true}));
}

export function setFontWeight(weight: string, trigger = false): void {
    const element = getFirstElement<HTMLInputElement>(`input[name="font-weight-radio"][id="${weight}"]`);
    element.checked = true;
    if (trigger) element.dispatchEvent(new Event('change', {bubbles: true}));
}

export function setFontSize(size: string, trigger = false): void {
    font.sizesel.value = size;
    if (trigger) font.sizesel.dispatchEvent(new Event('change', {bubbles: true}));
}

export function setDropShadow(value: string, trigger = false): void {
    font.shadowrange.value = value;
    if (trigger) font.shadowrange.dispatchEvent(new Event('input', {bubbles: true}));
}

export function setStrokeWidth(width: string, trigger = false): void {
    font.strokerange.value = width;
    if (trigger) font.strokerange.dispatchEvent(new Event('input', {bubbles: true}));
}

export function setStrokeColor(color: string, trigger = false): void {
    font.strokecolor.value = color;
    if (trigger) font.strokecolor.dispatchEvent(new Event('input', {bubbles: true}));
}

// Color theme config
export function setColorThemeConfig(config: ColorThemeConfig, trigger: boolean = false): void {
    setColorMode(config.colorMode, trigger);
    if (config.colorMode === 'solidmode') {
        setSolidColor(config.solidColor, trigger);
        setTextColorMode(config.textColorMode, trigger);
    } else if (config.colorMode === 'imgmode') {
        setBackgroundImage(config.bgImage);
        setBackgroundImageSize(config.bgImageSize, trigger);
        setBackgroundImageBlur(config.bgImageBlur, trigger);
    }
    if (config.textColorMode === 'tcovO') {
        setTextColorValue(config.textColorValue, trigger);
    }
}

export function setColorMode(mode: string, trigger = false): void {
    stopColorFade();
    const element = getFirstElement<HTMLInputElement>(`input[name="color-mode-radio"][id="${mode}"]`);
    element.checked = true;
    if (trigger) element.dispatchEvent(new Event('change'));
}

export function setSolidColor(color: string, trigger = false): void {
    const element = getFirstElement<HTMLInputElement>(`input[name="preset-color-radio"][data-color="${color}"]`);
    element.checked = true;
    if (trigger) element.dispatchEvent(new Event('change'));
}

export function setTextColorMode(mode: string, trigger = false): void {
    const element = getFirstElement<HTMLInputElement>(`input[name="text-color-override-radio"][id="${mode}"]`);
    element.checked = true;
    if (trigger) element.dispatchEvent(new Event('change'));
}

export function setTextColorValue(color: string, trigger = false): void {
    menu.textcolorinput.value = color;
    if (trigger) menu.textcolorinput.dispatchEvent(new Event('input'));
}

export function setBackgroundImage(imageUrl: string): void {
    document.body.style.backgroundImage = imageUrl;
}

export function setBackgroundImageSize(size: string, trigger = false): void {
    menu.imagesizeselect.value = size;
    if (trigger) menu.imagesizeselect.dispatchEvent(new Event('change'));
}

export function setBackgroundImageBlur(blur: string, trigger = false): void {
    menu.imageblurrange.value = blur;
    if (trigger) menu.imageblurrange.dispatchEvent(new Event('input'));
}
