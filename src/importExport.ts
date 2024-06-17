/* eslint-disable @typescript-eslint/no-explicit-any */
import { getFirstElement } from './utils/dom-utils';
import * as luxon from 'ts-luxon';
import { menu, font } from './global';
import { stopColorFade } from './background-color';
import {
    validateRequiredKeys,
    validateVersion,
    validateClockConfig,
    validateFontConfig,
    validateColorTheme
} from './importValidation';

function getSolidColorValue() {
    const checkedColorInput = getFirstElement<HTMLInputElement>('input[name="preset-color-radio"]:checked');
    if (checkedColorInput) {
        const colorValue = checkedColorInput.dataset.color;
        return colorValue;
    } else {
        return '#FFFFFF';
    }
}

export function exportSettingsToJSON() {
    // Get time and set export timestamp
    const time = luxon.DateTime.now();
    const timeExported = time.toFormat('FFFF');

    // Get all settings
    const usersettings = {
        clockConfig: {
            clockMode: getFirstElement<HTMLInputElement>('input[name="clock-mode-radio"]:checked').id,
            clockDisplay: menu.timeMethodSelect.value,
            secondsVis: getFirstElement<HTMLInputElement>('input[name="seconds-vis-radio"]:checked').id,
            dateFormat: menu.dateformselect.value,
            dateAlign: getFirstElement<HTMLInputElement>('input[name="date-position-radio"]:checked').id,
            borderMode: getFirstElement<HTMLInputElement>('input[name="border-type-radio"]:checked').id,
            borderStyle: menu.borderstyleselect.value,
            secondsBarVis: getFirstElement<HTMLInputElement>('input[name="seconds-bar-radio"]:checked').id
        },
        fontConfig: {
            fontFamily: font.familysel.value,
            fontStyle: getFirstElement<HTMLInputElement>('input[name="font-style-radio"]:checked').id,
            fontWeight: getFirstElement<HTMLInputElement>('input[name="font-weight-radio"]:checked').id,
            fontSize: font.sizesel.value,
            dropShadow: font.shadowrange.value
        },
        colorTheme: {
            colorMode: getFirstElement<HTMLInputElement>('input[name="color-mode-radio"]:checked').id,
            solidColor: (getFirstElement<HTMLInputElement>('input[name="color-mode-radio"]:checked').id) == 'solidmode' ? getSolidColorValue() : '',
            textColorMode: getFirstElement<HTMLInputElement>('input[name="text-color-override-radio"]:checked').id,
            textColorValue: (getFirstElement<HTMLInputElement>('input[name="text-color-override-radio"]:checked').id) == 'tcovO' ? menu.textcolorinput.value : '',
            bgImage: (getFirstElement<HTMLInputElement>('input[name="color-mode-radio"]:checked').id) == 'imgmode' ? document.body.style.backgroundImage : '',
            bgImageSize: (getFirstElement<HTMLInputElement>('input[name="color-mode-radio"]:checked').id) == 'imgmode' ? menu.imagesizeselect.value : '',
            bgImageBlur: (getFirstElement<HTMLInputElement>('input[name="color-mode-radio"]:checked').id) == 'imgmode' ? menu.imageblurrange.value : ''
        },
        exportTimestamp: timeExported,
        version: 6
    };

    const settingsJSON = JSON.stringify(usersettings);
    const blob = new Blob([settingsJSON], {
        type: 'application/json'
    });
    const url = URL.createObjectURL(blob);

    // Initiate download
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `usdonlineclock-settings_${time.toFormat('X')}.json`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

// Helper function to process JSON settings
function processJSONSettings(jsonText: string, alertConfirmation: boolean = true) {
    try {
        const importedSettings = JSON.parse(jsonText);

        const validation = verifySettingsJSON(importedSettings);
        if (validation !== true) {
            handleValidationFailure(validation as ErrorDetails);
            return;
        }

        updateClockSettings(importedSettings);
        if (menu.debugcheckbox.checked) {console.log('DEBUG - Settings successfully loaded!');}
        if (alertConfirmation === true) {alert(`Settings successfully imported!\nFile timestamp: ${(importedSettings.exportTimestamp ? importedSettings.exportTimestamp : 'Unknown or missing timestamp')}`);}
    } catch (error) {
        console.error('ERROR - Error processing settings:', error);
        alert('Invalid settings file. Please make sure the file contains valid JSON.');
    }
}

// Function to handle file import
export function importSettingsFromJSON() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    input.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement; // Cast to HTMLInputElement
        if (target.files && target.files.length > 0) {
            const file = target.files[0];
            const reader = new FileReader();
    
            reader.onload = (e) => {
                const readerTarget = e.target as FileReader; // Cast to FileReader
                if (typeof readerTarget.result === 'string') {
                    processJSONSettings(readerTarget.result);
                }
            };
            reader.readAsText(file);
        }
    });
    

    input.click();
}

// Function for manual JSON text input
export function manualJSONImport() {
    const jsontext = menu.manualjsontextinput.value;

    if (jsontext) {
        processJSONSettings(jsontext);
        // Clear text field after completion
        menu.manualjsontextinput.value = '';
    } else {
        if (menu.debugcheckbox.checked) {console.log('DEBUG - No settings were provided or the JSON data could not be read.');}
    }
}

// Import settings from a local JSON file
export function presetLocalJSON(filename: string, alertConfirmation: boolean = true) {
    const url = `./assets/${filename}.json`;

    fetch(url)
        .then(response => response.text())
        .then(json => {
            if (menu.debugcheckbox.checked) {console.log(`DEBUG - Attempting to load settings from preset '${filename}'...`);}
            processJSONSettings(json, alertConfirmation);
        })
        .catch(error => {
            console.error('ERROR - Error fetching local settings file:', error);
            alert('Could not fetch local settings file. Please check the filename and ensure the file exists.');
        });
  
}  

function updateClockSettings(importedSettings: { clockConfig: any; fontConfig: any; colorTheme: any; }) {
    // Update clockConfig settings
    const clockConfig = importedSettings.clockConfig;
    getFirstElement<HTMLInputElement>(`input[name="clock-mode-radio"][id="${clockConfig.clockMode}"]`).checked = true;
    menu.timeMethodSelect.value = clockConfig.clockDisplay;
    getFirstElement<HTMLInputElement>(`input[name="seconds-vis-radio"][id="${clockConfig.secondsVis}"]`).checked = true;
    menu.dateformselect.value = clockConfig.dateFormat;
    getFirstElement<HTMLInputElement>(`input[name="date-position-radio"][id="${clockConfig.dateAlign}"]`).checked = true;
    if (clockConfig.secondsBarVis === 'sbaN') {
        getFirstElement<HTMLInputElement>(`input[name="border-type-radio"][id="${clockConfig.borderMode}"]`).checked = true;
    }
    menu.borderstyleselect.value = clockConfig.borderStyle;
    if (clockConfig.borderMode === 'btyD') {
        getFirstElement<HTMLInputElement>(`input[name="seconds-bar-radio"][id="${clockConfig.secondsBarVis}"]`).checked = true;
    }

    // Update fontConfig settings
    const fontConfig = importedSettings.fontConfig;
    font.familysel.value = fontConfig.fontFamily;
    getFirstElement<HTMLInputElement>(`input[name="font-style-radio"][id="${fontConfig.fontStyle}"]`).checked = true;
    getFirstElement<HTMLInputElement>(`input[name="font-weight-radio"][id="${fontConfig.fontWeight}"]`).checked = true;
    font.sizesel.value = fontConfig.fontSize;
    font.shadowrange.value = fontConfig.dropShadow;

    // Update colorTheme settings
    const colorTheme = importedSettings.colorTheme;
    getFirstElement<HTMLInputElement>(`input[name="color-mode-radio"][id="${colorTheme.colorMode}"]`).checked = true;
    if (colorTheme.colorMode === 'solidmode') {
        getFirstElement<HTMLInputElement>(`input[name="preset-color-radio"][data-color="${colorTheme.solidColor}"]`).checked = true;
        getFirstElement<HTMLInputElement>(`input[name="text-color-override-radio"][id="${colorTheme.textColorMode}"]`).checked = true;
        if (colorTheme.textColorMode === 'tcovO') {
            menu.textcolorinput.value = colorTheme.textColorValue;
        }
    }
    if (colorTheme.colorMode === 'imgmode') {
        document.body.style.backgroundImage = colorTheme.bgImage;
        menu.textcolorinput.value = colorTheme.textColorValue; // Assuming textColorMode was already set to 'tcovO'
        menu.imagesizeselect.value = colorTheme.bgImageSize;
        menu.imageblurrange.value = colorTheme.bgImageBlur;
    }

    // Trigger change events for updated elements
    getFirstElement<HTMLInputElement>(`input[name="clock-mode-radio"][id="${clockConfig.clockMode}"]`).dispatchEvent(new Event('change'));
    menu.timeMethodSelect.dispatchEvent(new Event('change'));
    getFirstElement<HTMLInputElement>(`input[name="seconds-vis-radio"][id="${clockConfig.secondsVis}"]`).dispatchEvent(new Event('change'));
    menu.dateformselect.dispatchEvent(new Event('change'));
    getFirstElement<HTMLInputElement>(`input[name="date-position-radio"][id="${clockConfig.dateAlign}"]`).dispatchEvent(new Event('change'));
    getFirstElement<HTMLInputElement>(`input[name="border-type-radio"][id="${clockConfig.borderMode}"]`).dispatchEvent(new Event('change'));
    menu.borderstyleselect.dispatchEvent(new Event('change'));
    getFirstElement<HTMLInputElement>(`input[name="seconds-bar-radio"][id="${clockConfig.secondsBarVis}"]`).dispatchEvent(new Event('change'));

    font.familysel.dispatchEvent(new Event('change'));
    getFirstElement<HTMLInputElement>(`input[name="font-style-radio"][id="${fontConfig.fontStyle}"]`).dispatchEvent(new Event('change'));
    getFirstElement<HTMLInputElement>(`input[name="font-weight-radio"][id="${fontConfig.fontWeight}"]`).dispatchEvent(new Event('change'));
    font.sizesel.dispatchEvent(new Event('change'));
    font.shadowrange.dispatchEvent(new Event('input'));

    stopColorFade(); // Stop fade interval to avoid running interval twice if already running!!!
    getFirstElement<HTMLInputElement>(`input[name="color-mode-radio"][id="${colorTheme.colorMode}"]`).dispatchEvent(new Event('change'));
    if (colorTheme.colorMode === 'solidmode') {
        getFirstElement<HTMLInputElement>('input[name="preset-color-radio"]:checked').dispatchEvent(new Event('change'));
        getFirstElement<HTMLInputElement>('input[name="text-color-override-radio"]:checked').dispatchEvent(new Event('change'));
        if (colorTheme.textColorMode === 'tcovO') {
            menu.textcolorinput.dispatchEvent(new Event('input'));
        }
    }
    if (colorTheme.colorMode === 'imgmode') {
        menu.textcolorinput.dispatchEvent(new Event('input'));
        menu.imagesizeselect.dispatchEvent(new Event('change'));
        menu.imageblurrange.dispatchEvent(new Event('input'));
    }
}

type ErrorType = 'missing' | 'invalid' | 'incomp';

interface ErrorDetails {
    type: ErrorType;
    subkey: string;
    value: string;
    expected: string;
    unexpected: string;
}

function handleValidationFailure(errorDetails: ErrorDetails) {
    const errorMsg = {
        'missing': `Missing subkeys: ${errorDetails.subkey}`,
        'invalid': `Invalid value of ${errorDetails.subkey}: ${errorDetails.value}\nExpected: ${errorDetails.expected}`,
        'incomp': `Incompatible values of ${errorDetails.subkey}: ${errorDetails.value}`,
        'unexpected': `Unexpected keys: ${errorDetails.subkey}`
    };
    
    const errorMessage = errorMsg[`${errorDetails.type}`] || 'Unknown validation failure';
    console.error('ERROR - ' + errorMessage);
    alert(`Error loading settings from imported file.\n\n${errorMessage}\n\nIf this is a version error, please export a new settings file as settings may have been updated! If you need further assistance, please post an issue on GitHub.`);
}

// Value constraints
const valid = {
    CM: ['cmo12', 'cmo24'],
    CD: ['binary', 'octal', 'decimal', 'hexa', 'emoji', 'roman', 'words'],
    SV: ['sviD', 'sviN'],
    DF: ['D', 'DD', 'DDD', 'DDDD', ''],
    DA: ['dpoL', 'dpoC', 'dpoR'],
    BM: ['btyD', 'btyR', 'btyB'],
    BS: ['solid', 'dashed', 'dotted', 'double'],
    SB: ['', 'sbaB', 'sbaN'],
    FF: ['', 'Lato', 'Montserrat', 'Open Sans', 'Oswald', 'Poppins', 'Roboto', 'Tektur', 'Ubuntu', 'Ubuntu Mono', 'Dancing Script', 'Merriweather', 'Nanum Brush Script', 'Pangolin'],
    FS: ['fstR', 'fstI'],
    FW: ['fweL', 'fweN', 'fweB'],
    FZ: ['6vw', '8vw', '10vw', '12vw', '14vw', '18vw'],
    DS: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    CMo: ['fademode', 'solidmode', 'imgmode'],
    SC: ['#FF0000', '#FFA500', '#FFFF00', '#00FF00', '#0000FF', '#FF00FF', '#FFFFFF', '#808080', '#000000', '#F2B5D4', '#C2E0E9', '#E1D5E7', '#B0E0E6', '#F7D5AA', '#D5E8D4', '#92A8D1', '#E6AF75', '#D9B5A5', '#9AC1B7', '#D0B9C3', '#C4B7D9', '#D72C6F', '#227FBF', '#7E3F9D', '#367F89', '#FF713F', '#549F55', '#2B4771', '#C55324', '#954A3E', '#457E70', '#8B2C5A', '#7C5793'],
    TCM: ['tcovD', 'tcovO'],
    BIS: ['', 'auto', 'cover', 'stretch'],
    BIB: ['', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    Ver: [5, 6]
};

function verifySettingsJSON(jsonData: { version: any; clockConfig: any; fontConfig: any; colorTheme: any; }) {
    const requiredKeys = ['clockConfig', 'fontConfig', 'colorTheme', 'version'];

    const requiredKeysValidation = validateRequiredKeys(jsonData, requiredKeys);
    if (requiredKeysValidation) {
        return requiredKeysValidation;
    }

    const versionValidation = validateVersion(jsonData.version, valid.Ver);
    if (versionValidation) {
        return versionValidation;
    }

    const clockConfigValidation = validateClockConfig(jsonData.clockConfig, valid);
    if (clockConfigValidation) {
        return clockConfigValidation;
    }

    const fontConfigValidation = validateFontConfig(jsonData.fontConfig, valid);
    if (fontConfigValidation) {
        return fontConfigValidation;
    }

    const colorThemeValidation = validateColorTheme(jsonData.colorTheme, valid);
    if (colorThemeValidation) {
        return colorThemeValidation;
    }

    return true;
}
