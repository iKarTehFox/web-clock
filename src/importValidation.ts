import { logConsole } from './utils/dom-utils';

// Value constraints
const valid = {
    CM: ['cmo12', 'cmo24'],
    CD: ['binary', 'octal', 'decimal', 'hexa', 'emoji', 'roman', 'words', 'unixmillis', 'unixsec', 'unixcountdown', 'se_valentines', 'se_christmas', 'se_newyears', 'ii_christmas', 'ii_weekend', 'ii_leapyear'],
    SV: ['sviD', 'sviN'],
    DF: ['D', 'DD', 'DDD', 'DDDD', ''],
    DA: ['dpoL', 'dpoC', 'dpoR'],
    BM: ['btyD', 'btyR', 'btyB'],
    BS: ['solid', 'dashed', 'dotted', 'double'],
    TB: ['tbarWkday', 'tbarDay', 'tbarHr', 'tbarSec', 'tbarNone'],
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
    Ver: [10]
};

// Error handling
type ErrorType = 'missing' | 'invalid' | 'incomp';

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
    alert(`Error loading settings from imported file.\n\n${errorMessage}\n\nIf this is a version error, please export a new settings file as settings may have been updated! If you need further assistance, please post an issue on GitHub.`);
}

// Main validation function
export function verifySettingsJSON(jsonData: { version: any; clockConfig: any; fontConfig: any; colorTheme: any; }) {
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
    const unexpectedKeys = keysInJson.filter(key => !requiredKeys.includes(key) && key !== 'exportTimestamp' && key !== 'displaySettings'); // displaySettings exception for version 5 files.

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
        { key: 'clockMode', validValues: valid.CM },
        { key: 'clockDisplay', validValues: valid.CD },
        { key: 'secondsVis', validValues: valid.SV },
        { key: 'dateFormat', validValues: valid.DF },
        { key: 'dateAlign', validValues: valid.DA },
        { key: 'borderMode', validValues: valid.BM },
        { key: 'borderStyle', validValues: valid.BS },
        { key: 'timeBar', validValues: valid.TB },
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

    if ((clockConfig.borderMode === 'btyB' || clockConfig.borderMode === 'btyR') && clockConfig.timeBar !== 'tbarNone') {
        return {
            type: 'incomp',
            subkey: 'borderMode, timeBar',
            value: `${clockConfig.borderMode}, ${clockConfig.timeBar}`
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

    if (colorTheme.bgImage) {
        const bgImageValidationError = validateBgImageType(colorTheme.bgImage);
        if (bgImageValidationError) {
            return bgImageValidationError;
        }
    }

    return null;
}
