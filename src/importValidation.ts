function containsValue(array: string | any[], value: any) {
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
        { key: 'secondsBarVis', validValues: valid.SB },
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

    if ((clockConfig.borderMode === 'btyB' || clockConfig.borderMode === 'btyR') && clockConfig.secondsBarVis === 'sbaB') {
        return {
            type: 'invalid',
            subkey: 'borderMode, secondsBarVis',
            value: `${clockConfig.borderMode}, ${clockConfig.secondsBarVis}`
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
