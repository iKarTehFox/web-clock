import { match } from 'ts-pattern';
import { createBsModal, logConsole } from './utils/dom-utils';
import i18next from 'i18next';
import { versionNumberString } from './utils/update-notify';

// Value constraints
export const valid = {
    CD: ['binary', 'octal', 'decimal', 'hexa', 'emoji', 'roman', 'words', 'unixmillis', 'unixsec', 'unixcountdown', 'se_valentines', 'se_christmas', 'se_newyears', 'ii_christmas', 'ii_weekend', 'ii_leapyear'],
    SV: ['sviD', 'sviN'],
    DF: ['dfLocNumDate', 'dfLocAbbMon', 'dfLocFullMon', 'dfLocFullDate', 'dfStaFullMonthDay', 'dfStaAbbMonthDay', 'dfStaDayFullMonth', 'dfStaDayAbbMonth', 'dfStaFullMonthYear', 'dfStaYear', 'dfStaQuarterYear', 'dfStaDayOfYear', 'dfStaWeekDay', 'dfOff'],
    DA: ['dpoL', 'dpoC', 'dpoR'],
    BM: ['btyD', 'btyR', 'btyB'],
    BS: ['solid', 'dashed', 'dotted', 'double'],
    TB: ['tbarWeekday', 'tbarMonth','tbarDay', 'tbarHour', 'tbarSec', 'tbarNone'],
    CNA: ['nalT', 'nalB'],
    FF: ['', 'Lato', 'Montserrat', 'Open Sans', 'Oswald', 'Poppins', 'Roboto', 'Tektur', 'Ubuntu', 'Ubuntu Mono', 'Dancing Script', 'Merriweather', 'Nanum Brush Script', 'Pangolin'],
    FS: ['fstR', 'fstI'],
    FW: ['fweL', 'fweN', 'fweB'],
    FZ: ['6vw', '8vw', '10vw', '12vw', '14vw', '18vw'],
    DS: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    FStW: ['0', '1', '2', '3', '4', '5'],
    CMo: ['fademode', 'solidmode', 'imgmode'],
    SC: ['#FF0000', '#FFA500', '#FFFF00', '#00FF00', '#0000FF', '#FF00FF', '#FFFFFF', '#808080', '#000000', '#F2B5D4', '#C2E0E9', '#E1D5E7', '#B0E0E6', '#F7D5AA', '#D5E8D4', '#92A8D1', '#E6AF75', '#D9B5A5', '#9AC1B7', '#D0B9C3', '#C4B7D9', '#D72C6F', '#227FBF', '#7E3F9D', '#367F89', '#FF713F', '#549F55', '#2B4771', '#C55324', '#954A3E', '#457E70', '#8B2C5A', '#7C5793'],
    TCM: ['tcovD', 'tcovO'],
    BIS: ['', 'auto', 'cover', 'stretch'],
    BIB: ['', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    Ver: [versionNumberString],
    // Timezone window clock modes
    TZCM: ['0', '1'],
    // Timezone window font styles (CSS values, not internal IDs)
    TZFS: ['normal', 'italic'],
    // Timezone window font weights (CSS values, not internal IDs)
    TZFW: ['normal', 'lighter', 'bold']
};

// Error handling
type ErrorType = 'missing' | 'invalid' | 'incomp' | 'unexpected';

export interface ErrorDetails {
    type: ErrorType;
    subkey: string;
    value: string;
    expected: string;
    unexpected: string;
}

export function handleValidationFailure(errorDetails: ErrorDetails) {
    const errorMsg = {
        'missing': `Missing subkeys: ${errorDetails.subkey}`,
        'invalid': `Invalid value of ${errorDetails.subkey}: ${errorDetails.value}\nExpected: ${errorDetails.expected}`,
        'incomp': `Incompatible values of ${errorDetails.subkey}: ${errorDetails.value}`,
        'unexpected': `Unexpected keys: ${errorDetails.subkey}`
    };
    
    const errorMessage = errorMsg[`${errorDetails.type}`] || 'Unknown validation failure';
    logConsole(`${errorMessage}`, 'error');
    createBsModal({
        title: i18next.t('bsmodal.importexport.importerror'),
        content: errorMessage,
        buttons: [{label: i18next.t('bsmodal.button.gethelp'), className: 'btn btn-primary', value: 'get_help'}, {label: i18next.t('bsmodal.button.close'), value: 'close'}],
        timeoutDelay: 60
    })
        .then(result => {
            match(result)
                .with('get_help', () => {
                    window.open('https://online-clock-docs.pages.dev/troubleshooting/', '_blank');
                });
        });
}

// Main validation function
export function verifySettingsJSON(jsonData: { version: any; clockConfig: any; fontConfig: any; colorTheme: any; timezoneWindows?: any; }) {
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

    // Validate timezone windows if present (optional)
    if (jsonData.timezoneWindows) {
        const timezoneWindowsValidation = validateTimezoneWindows(jsonData.timezoneWindows, valid);
        if (timezoneWindowsValidation) {
            return timezoneWindowsValidation;
        }
    }

    return true;
}

// Validation helper functions
function containsValue(array: string | any[], value: any) {
    logConsole(`Checking if array ${array} contains value: ${value}`, 'debug');
    return array.includes(value);
}

function validateBgImageType(bgImage: string) {
    const dataImagePattern = /^url\("data:image\/.*"\)$/;
    if (!dataImagePattern.test(bgImage)) {
        return {
            type: 'invalid',
            subkey: 'bgImage',
            value: 'Invalid data type',
            expected: ['url("data:image/*")']
        };
    }
    return null;
}

export function validateRequiredKeys(jsonData: { [key: string]: any }, requiredKeys: string[]) {
    const missingKeys = requiredKeys.filter(key => !(key in jsonData));
    if (missingKeys.length > 0) {
        return {
            type: 'missing',
            subkey: missingKeys.join(', ')
        };
    }

    const keysInJson = Object.keys(jsonData);
    const unexpectedKeys = keysInJson.filter(key => !requiredKeys.includes(key) && key !== 'exportTimestamp' && key !== 'timezoneWindows');

    if (unexpectedKeys.length > 0) {
        return {
            type: 'unexpected',
            subkey: unexpectedKeys.join(', ')
        };
    }

    return null;
}

export function validateVersion(version: any, validVersions: any[]) {
    if (!containsValue(validVersions, version)) {
        return {
            type: 'invalid',
            subkey: 'version',
            value: version,
            expected: validVersions
        };
    }
    return null;
}

export function validateClockConfig(clockConfig: any, valid: any) {
    const keys = [
        { key: 'clockDisplay', validValues: valid.CD },
        { key: 'secondsVis', validValues: valid.SV },
        { key: 'dateFormat', validValues: valid.DF },
        { key: 'dateAlign', validValues: valid.DA },
        { key: 'borderMode', validValues: valid.BM },
        { key: 'borderStyle', validValues: valid.BS },
        { key: 'timeBar', validValues: valid.TB },
        { key: 'customNoteAlign', validValues: valid.CNA },
    ];

    for (const { key, validValues } of keys) {
        if (!containsValue(validValues, clockConfig[key])) {
            return {
                type: 'invalid',
                subkey: key,
                value: clockConfig[key],
                expected: validValues
            };
        }
    }

    // Check for timeDisplay and secondsVis compatibility
    if (['unixmillis', 'unixsec', 'ii_christmas', 'ii_weekend', 'ii_leapyear'].includes(clockConfig.clockDisplay) && clockConfig.secondsVis === 'sviD') {
        return {
            type: 'incomp',
            subkey: 'clockDisplay, secondsVis',
            value: `${clockConfig.clockDisplay}, ${clockConfig.secondsVis}`
        };
    }
    

    // Check borderMode and timeBar incompatibility
    if (['btyB', 'btyR'].includes(clockConfig.borderMode) && clockConfig.timeBar !== 'tbarNone') {
        return {
            type: 'incomp',
            subkey: 'borderMode, timeBar',
            value: `${clockConfig.borderMode}, ${clockConfig.timeBar}`
        };
    }

    // Check customNote length
    if (clockConfig.customNote && clockConfig.customNote.length > 75) {
        return {
            type: 'invalid',
            subkey: 'customNote',
            value: `${clockConfig.customNote.length} characters`,
            expected: 'Maximum 75 characters'
        };
    }

    return null;
}

export function validateFontConfig(fontConfig: any, valid: any) {
    const keys = [
        { key: 'fontFamily', validValues: valid.FF },
        { key: 'fontStyle', validValues: valid.FS },
        { key: 'fontWeight', validValues: valid.FW },
        { key: 'fontSize', validValues: valid.FZ },
        { key: 'dropShadow', validValues: valid.DS },
        { key: 'strokeWidth', validValues: valid.FStW }
    ];

    for (const { key, validValues } of keys) {
        if (!containsValue(validValues, fontConfig[key])) {
            return {
                type: 'invalid',
                subkey: key,
                value: fontConfig[key],
                expected: validValues
            };
        }
    }

    return null;
} 

export function validateColorTheme(colorTheme: any, valid: any) {
    if (!containsValue(valid.CMo, colorTheme.colorMode)) {
        return {
            type: 'invalid',
            subkey: 'colorMode',
            value: colorTheme.colorMode,
            expected: valid.CMo
        };
    }

    // Check colorMode and solidColor incompatibility
    if (colorTheme.colorMode === 'solidmode' && !containsValue(valid.SC, colorTheme.solidColor)) {
        return {
            type: 'invalid',
            subkey: 'solidColor',
            value: colorTheme.solidColor,
            expected: valid.SC
        };
    }

    if (!containsValue(valid.TCM, colorTheme.textColorMode)) {
        return {
            type: 'invalid',
            subkey: 'textColorMode',
            value: colorTheme.textColorMode,
            expected: valid.TCM
        };
    }

    // Check colorMode and textColorMode incompatibility
    if ((colorTheme.colorMode === 'fademode' && colorTheme.textColorMode === 'tcovO') ||
        (colorTheme.colorMode === 'imgmode' && colorTheme.textColorMode === 'tcovD')) {
        return {
            type: 'incomp',
            subkey: 'colorMode, textColorMode',
            value: `${colorTheme.colorMode}, ${colorTheme.textColorMode}`
        };
    }

    const keys = [
        { key: 'bgImageSize', validValues: valid.BIS },
        { key: 'bgImageBlur', validValues: valid.BIB },
    ];

    for (const { key, validValues } of keys) {
        if (!containsValue(validValues, colorTheme[key])) {
            return {
                type: 'invalid',
                subkey: key,
                value: colorTheme[key],
                expected: validValues
            };
        }
    }

    // Check bgImage safety
    if (colorTheme.bgImage) {
        const bgImageValidationError = validateBgImageType(colorTheme.bgImage);
        if (bgImageValidationError) {
            return bgImageValidationError;
        }
    }

    return null;
}

export function validateTimezoneWindows(timezoneWindows: any, valid: any) {
    // Validate that only tz1 and/or tz2 exist
    const allowedKeys = ['tz1', 'tz2'];
    const timezoneWindowKeys = Object.keys(timezoneWindows);
    const invalidKeys = timezoneWindowKeys.filter(key => !allowedKeys.includes(key));
    
    if (invalidKeys.length > 0) {
        return {
            type: 'unexpected',
            subkey: `timezoneWindows.${invalidKeys.join(', timezoneWindows.')}`
        };
    }

    // Validate each timezone window
    for (const windowKey of timezoneWindowKeys) {
        const window = timezoneWindows[windowKey];
        
        // Required fields
        const requiredFields = ['timezone', 'clockMode', 'dateFormat', 'fontFamily', 'fontStyle', 'fontWeight', 'x', 'y', 'width', 'height'];
        const missingFields = requiredFields.filter(field => !(field in window));
        
        if (missingFields.length > 0) {
            return {
                type: 'missing',
                subkey: `timezoneWindows.${windowKey}.${missingFields.join(`, timezoneWindows.${windowKey}.`)}`
            };
        }

        // Validate timezone (should be a non-empty string)
        if (typeof window.timezone !== 'string' || window.timezone.trim() === '') {
            return {
                type: 'invalid',
                subkey: `timezoneWindows.${windowKey}.timezone`,
                value: window.timezone,
                expected: 'Non-empty string (valid IANA timezone identifier)'
            };
        }

        // Validate clockMode
        if (!containsValue(valid.TZCM, window.clockMode)) {
            return {
                type: 'invalid',
                subkey: `timezoneWindows.${windowKey}.clockMode`,
                value: window.clockMode,
                expected: valid.TZCM
            };
        }

        // Validate dateFormat (should be a string, can be empty)
        if (typeof window.dateFormat !== 'string') {
            return {
                type: 'invalid',
                subkey: `timezoneWindows.${windowKey}.dateFormat`,
                value: window.dateFormat,
                expected: 'String (Luxon date format or empty string)'
            };
        }

        // Validate fontFamily
        if (!containsValue(valid.FF, window.fontFamily)) {
            return {
                type: 'invalid',
                subkey: `timezoneWindows.${windowKey}.fontFamily`,
                value: window.fontFamily,
                expected: valid.FF
            };
        }

        // Validate fontStyle (CSS values)
        if (!containsValue(valid.TZFS, window.fontStyle)) {
            return {
                type: 'invalid',
                subkey: `timezoneWindows.${windowKey}.fontStyle`,
                value: window.fontStyle,
                expected: valid.TZFS
            };
        }

        // Validate fontWeight (CSS values)
        if (!containsValue(valid.TZFW, window.fontWeight)) {
            return {
                type: 'invalid',
                subkey: `timezoneWindows.${windowKey}.fontWeight`,
                value: window.fontWeight,
                expected: valid.TZFW
            };
        }

        // Validate position and size (should be numbers)
        const numericFields = ['x', 'y', 'width', 'height'];
        for (const field of numericFields) {
            if (typeof window[field] !== 'number' || isNaN(window[field])) {
                return {
                    type: 'invalid',
                    subkey: `timezoneWindows.${windowKey}.${field}`,
                    value: window[field],
                    expected: 'Number'
                };
            }
        }

        // Validate width and height are positive
        if (window.width <= 0 || window.height <= 0) {
            return {
                type: 'invalid',
                subkey: `timezoneWindows.${windowKey}.width/height`,
                value: `${window.width}/${window.height}`,
                expected: 'Positive numbers'
            };
        }
    }

    return null;
}
