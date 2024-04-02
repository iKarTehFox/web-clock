function getSolidColorValue() {
    const checkedColorInput = document.querySelector('input[name="preset-color-radio"]:checked');
    if (checkedColorInput) {
        const colorValue = checkedColorInput.dataset.color;
        return colorValue;
    } else {
        return '#FFFFFF';
    }
}

function exportSettingsToJSON() {
    // Get time and set export timestamp
    var time = luxon.DateTime.now();
    const timeExported = time.toFormat('FFFF');

    // Get all settings
    const usersettings = {
        clockConfig: {
            clockMode: document.querySelector('input[name="clock-mode-radio"]:checked').id,
            clockDisplay: menu.timeMethodSelect.value,
            secondsVis: document.querySelector('input[name="seconds-vis-radio"]:checked').id,
            dateFormat: menu.dateformselect.value,
            dateAlign: document.querySelector('input[name="date-position-radio"]:checked').id,
            borderMode: document.querySelector('input[name="border-type-radio"]:checked').id,
            borderStyle: menu.borderstyleselect.value,
            secondsBarVis: document.querySelector('input[name="seconds-bar-radio"]:checked').id
        },
        fontConfig: {
            fontFamily: font.familysel.value,
            fontStyle: document.querySelector('input[name="font-style-radio"]:checked').id,
            fontWeight: document.querySelector('input[name="font-weight-radio"]:checked').id,
            fontSize: font.sizesel.value,
            dropShadow: font.shadowrange.value
        },
        colorTheme: {
            colorMode: document.querySelector('input[name="color-mode-radio"]:checked').id,
            solidColor: (document.querySelector('input[name="color-mode-radio"]:checked').id) == 'solidmode' ? getSolidColorValue() : '',
            textColorMode: document.querySelector('input[name="text-color-override-radio"]:checked').id,
            textColorValue: (document.querySelector('input[name="text-color-override-radio"]:checked').id) == 'tcovO' ? menu.textcolorinput.value : '',
            bgImage: (document.querySelector('input[name="color-mode-radio"]:checked').id) == 'imgmode' ? document.body.style.backgroundImage : '',
            bgImageSize: (document.querySelector('input[name="color-mode-radio"]:checked').id) == 'imgmode' ? menu.imagesizeselect.value : '',
            bgImageBlur: (document.querySelector('input[name="color-mode-radio"]:checked').id) == 'imgmode' ? menu.imageblurrange.value : ''
        },
        exportTimestamp: timeExported,
        version: 6
    }

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

// Function to handle the import process
function importSettingsFromJSON() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    // Listen for changes in the input file selection
    input.addEventListener('change', (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const importedSettings = JSON.parse(e.target.result);

                // File validation
                const validation = verifySettingsJSON(importedSettings);
                if (validation !== true) {
                    handleValidationFailure(validation);
                    return;
                }
                
                updateClockSettings(importedSettings);
                console.log('Settings successfully loaded!')
                alert(`Settings successfully imported!\nFile timestamp: ${(importedSettings.exportTimestamp ? importedSettings.exportTimestamp : 'Unknown or missing timestamp')}`);
            } catch (error) {
                console.error('Error importing settings:', error);
                alert('Invalid settings file. Please make sure the file contains valid JSON.');
            }
        };

        reader.readAsText(file);
    });

    input.click();
}

// Alternative function for text input
function manualJSONImport() {
    const jsontext = menu.manualjsontextinput.value;

    if (jsontext) {
        try {
            const importedSettings = JSON.parse(jsontext);

            const validation = verifySettingsJSON(importedSettings);
            if (validation !== true) {
                handleValidationFailure(validation);
                return;
            }
            
            updateClockSettings(importedSettings);
            console.log('Settings successfully loaded!')
            alert(`Settings successfully imported!\nFile timestamp: ${(importedSettings.exportTimestamp ? importedSettings.exportTimestamp : 'Unknown or missing timestamp')}`);

            // Clear text field after completion
            menu.manualjsontextinput.value = '';
        } catch (error) {
            console.error('Error importing settings:', error);
            alert('Invalid settings file. Please make sure the file contains valid JSON.');
        }
    }
}

function updateClockSettings(importedSettings) {
    // Update clockConfig settings
    const clockConfig = importedSettings.clockConfig;
    document.querySelector(`input[name="clock-mode-radio"][id="${clockConfig.clockMode}"]`).checked = true;
    menu.timeMethodSelect.value = clockConfig.clockDisplay;
    document.querySelector(`input[name="seconds-vis-radio"][id="${clockConfig.secondsVis}"]`).checked = true;
    menu.dateformselect.value = clockConfig.dateFormat;
    document.querySelector(`input[name="date-position-radio"][id="${clockConfig.dateAlign}"]`).checked = true;
    if (clockConfig.secondsBarVis === 'sbaN') {
        document.querySelector(`input[name="border-type-radio"][id="${clockConfig.borderMode}"]`).checked = true;
    }
    menu.borderstyleselect.value = clockConfig.borderStyle;
    if (clockConfig.borderMode === 'btyD') {
        document.querySelector(`input[name="seconds-bar-radio"][id="${clockConfig.secondsBarVis}"]`).checked = true;
    }

    // Update fontConfig settings
    const fontConfig = importedSettings.fontConfig;
    font.familysel.value = fontConfig.fontFamily;
    document.querySelector(`input[name="font-style-radio"][id="${fontConfig.fontStyle}"]`).checked = true;
    document.querySelector(`input[name="font-weight-radio"][id="${fontConfig.fontWeight}"]`).checked = true;
    font.sizesel.value = fontConfig.fontSize;
    font.shadowrange.value = fontConfig.dropShadow;

    // Update colorTheme settings
    const colorTheme = importedSettings.colorTheme;
    document.querySelector(`input[name="color-mode-radio"][id="${colorTheme.colorMode}"]`).checked = true;
    if (colorTheme.colorMode === 'solidmode') {
        document.querySelector(`input[name="preset-color-radio"][data-color="${colorTheme.solidColor}"]`).checked = true;
        document.querySelector(`input[name="text-color-override-radio"][id="${colorTheme.textColorMode}"]`).checked = true;
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
    document.querySelector(`input[name="clock-mode-radio"][id="${clockConfig.clockMode}"]`).dispatchEvent(new Event('change'));
    menu.timeMethodSelect.dispatchEvent(new Event('change'));
    document.querySelector(`input[name="seconds-vis-radio"][id="${clockConfig.secondsVis}"]`).dispatchEvent(new Event('change'));
    menu.dateformselect.dispatchEvent(new Event('change'));
    document.querySelector(`input[name="date-position-radio"][id="${clockConfig.dateAlign}"]`).dispatchEvent(new Event('change'));
    document.querySelector(`input[name="border-type-radio"][id="${clockConfig.borderMode}"]`).dispatchEvent(new Event('change'));
    menu.borderstyleselect.dispatchEvent(new Event('change'));
    document.querySelector(`input[name="seconds-bar-radio"][id="${clockConfig.secondsBarVis}"]`).dispatchEvent(new Event('change'));

    font.familysel.dispatchEvent(new Event('change'));
    document.querySelector(`input[name="font-style-radio"][id="${fontConfig.fontStyle}"]`).dispatchEvent(new Event('change'));
    document.querySelector(`input[name="font-weight-radio"][id="${fontConfig.fontWeight}"]`).dispatchEvent(new Event('change'));
    font.sizesel.dispatchEvent(new Event('change'));
    font.shadowrange.dispatchEvent(new Event('input'));

    document.querySelector(`input[name="color-mode-radio"][id="${colorTheme.colorMode}"]`).dispatchEvent(new Event('change'));
    if (colorTheme.colorMode === 'solidmode') {
        document.querySelector('input[name="preset-color-radio"]:checked').dispatchEvent(new Event('change'));
        document.querySelector('input[name="text-color-override-radio"]:checked').dispatchEvent(new Event('change'));
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

function handleValidationFailure(errorDetails) {
    const errorMsg = {
        "missing": `Missing subkeys: ${errorDetails.subkey}`,
        "invalid": `Invalid value of ${errorDetails.subkey}: ${errorDetails.value}`,
        "incomp": `Incompatible values of ${errorDetails.subkey}: ${errorDetails.value}`
    }
    
    const errorMessage = errorMsg[`${errorDetails.type}`] || "Unknown validation failure";
    console.error(errorMessage)
    alert(`Error loading settings from imported file.\n\n${errorMessage}\n\nIf this is a version error, please export a new settings file as settings may have been updated! If you need help, please contact me on Twitter @iKarTehFox`);
}

// Value constraints
const validCM = ['cmo12', 'cmo24'];
const validCD = ['binary', 'octal', 'decimal', 'hexa', 'emoji', 'roman', 'words'];
const validSV = ['sviD', 'sviN'];
const validDF = ['D', 'DD', 'DDD', 'DDDD', ''];
const validDA = ['dpoL', 'dpoC', 'dpoR'];
const validBM = ['btyD', 'btyR', 'btyB'];
const validBS = ['solid', 'dashed', 'dotted', 'double'];
const validSB = ['', 'sbaB', 'sbaN']
const validFF = ['', 'Lato', 'Montserrat', 'Open Sans', 'Oswald', 'Poppins', 'Roboto', 'Tektur', 'Ubuntu', 'Ubuntu Mono', 'Dancing Script', 'Merriweather', 'Nanum Brush Script', 'Pangolin'];
const validFS = ['fstR', 'fstI'];
const validFW = ['fweL', 'fweN', 'fweB'];
const validFZ = ['6vw', '8vw', '10vw', '12vw', '14vw', '18vw'];
const validDS = ['0', '1', '2', '3', '4'];
const validCMo = ['fademode', 'solidmode', 'imgmode'];
const validSC = ['#FF0000', '#FFA500', '#FFFF00', '#00FF00', '#0000FF', '#FF00FF', '#FFFFFF', '#808080', '#000000', '#F2B5D4', '#C2E0E9', '#E1D5E7', '#B0E0E6', '#F7D5AA', '#D5E8D4', '#92A8D1', '#E6AF75', '#D9B5A5', '#9AC1B7', '#D0B9C3', '#C4B7D9', '#D72C6F', '#227FBF', '#7E3F9D', '#367F89', '#FF713F', '#549F55', '#2B4771', '#C55324', '#954A3E', '#457E70', '#8B2C5A', '#7C5793'];
const validTCM = ['tcovD', 'tcovO']
const validBIS = ['', 'auto', 'cover', 'stretch'];
const validBIB = ['', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
const validVer = [5, 6];

function containsValue(array, value) {
    return array.includes(value);
}

function verifySettingsJSON(jsonData) {
    const requiredKeys = ["clockConfig", "fontConfig", "colorTheme", "version"];

    // Check if all required keys are present in the JSON object
    const missingKeys = requiredKeys.filter(key => !(key in jsonData));
    if (missingKeys.length > 0) {
        return {
            type: 'missing',
            subkey: missingKeys.join(", "),
            value: ''
        };
    }
    
    // Perform validation for the "version" key
    const version = jsonData.version;

    if (!containsValue(validVer, version)) {
        return {
            type: 'invalid',
            subkey: 'version',
            value: version
        };
    }

    // Perform validation for the "clockConfig" subkeys
    const clockConfig = jsonData.clockConfig;

    if (!containsValue(validCM, clockConfig.clockMode)) {
        return {
            type: 'invalid',
            subkey: 'clockMode',
            value: clockConfig.clockMode
        };
    }

    if (!containsValue(validCD, clockConfig.clockDisplay)) {
        return {
            type: 'invalid',
            subkey: 'clockDisplay',
            value: clockConfig.clockDisplay
        };
    }

    if (!containsValue(validSV, clockConfig.secondsVis)) {
        return {
            type: 'invalid',
            subkey: 'secondsVis',
            value: clockConfig.secondsVis
        };
    }

    if (!containsValue(validDF, clockConfig.dateFormat)) {
        return {
            type: 'invalid',
            subkey: 'dateFormat',
            value: clockConfig.dateFormat
        };
    }

    if (!containsValue(validDA, clockConfig.dateAlign)) {
        return {
            type: 'invalid',
            subkey: 'dateAlign',
            value: clockConfig.dateAlign
        };
    }

    if (!containsValue(validBM, clockConfig.borderMode)) {
        return {
            type: 'invalid',
            subkey: 'borderMode',
            value: clockConfig.borderMode
        };
    }

    if (!containsValue(validBS, clockConfig.borderStyle)) {
        return {
            type: 'invalid',
            subkey: 'borderStyle',
            value: clockConfig.borderStyle
        };
    }

    if (!containsValue(validSB, clockConfig.secondsBarVis)) {
        return {
            type: 'invalid',
            subkey: 'secondsBarVis',
            value: clockConfig.secondsBarVis
        };
    }

    if ((clockConfig.borderMode === 'btyB' || clockConfig.borderMode === 'btyR') && clockConfig.secondsBarVis === 'sbaB') {
        return {
            type: 'invalid',
            subkey: 'borderMode, secondsBarVis',
            value: `${clockConfig.borderMode}, ${clockConfig.secondsBarVis}`
        };
    }

    // Perform validation for the "fontConfig" subkeys
    const fontConfig = jsonData.fontConfig;

    if (!containsValue(validFF, fontConfig.fontFamily)) {
        return {
            type: 'invalid',
            subkey: 'fontFamily',
            value: fontConfig.fontFamily
        };
    }

    if (!containsValue(validFS, fontConfig.fontStyle)) {
        return {
            type: 'invalid',
            subkey: 'fontStyle',
            value: fontConfig.fontStyle
        };
    }

    if (!containsValue(validFW, fontConfig.fontWeight)) {
        return {
            type: 'invalid',
            subkey: 'fontWeight',
            value: fontConfig.fontWeight
        };
    }

    if (!containsValue(validFZ, fontConfig.fontSize)) {
        return {
            type: 'invalid',
            subkey: 'fontSize',
            value: fontConfig.fontSize
        };
    }

    if (!containsValue(validDS, fontConfig.dropShadow)) {
        return {
            type: 'invalid',
            subkey: 'dropShadow',
            value: fontConfig.dropShadow
        };
    }

    // Perform validation for the "colorTheme" subkeys
    const colorTheme = jsonData.colorTheme;

    if (!containsValue(validCMo, colorTheme.colorMode)) {
        return {
            type: 'invalid',
            subkey: 'colorMode',
            value: colorTheme.colorMode
        };
    }

    if (colorTheme.colorMode === 'solidmode' && !containsValue(validSC, colorTheme.solidColor)) {
        return {
            type: 'invalid',
            subkey: 'solidColor',
            value: colorTheme.solidColor
        };
    }

    if (!containsValue(validTCM, colorTheme.textColorMode)) {
        return {
            type: 'invalid',
            subkey: 'textColorMode',
            value: colorTheme.textColorMode
        };
    }

    if ((colorTheme.colorMode === 'fademode' && colorTheme.textColorMode === 'tcovO') || (colorTheme.colorMode === 'imgmode' && colorTheme.textColorMode === 'tcovD')) {
        return {
            type: 'incomp',
            subkey: 'colorMode, textColorMode',
            value: `${colorTheme.colorMode}, ${colorTheme.textColorMode}`
        };
    }
    
    if (!containsValue(validBIS, colorTheme.bgImageSize)) {
        return {
            type: 'invalid',
            subkey: 'bgImageSize',
            value: colorTheme.bgImageSize
        };
    }
    
    if (!containsValue(validBIB, colorTheme.bgImageBlur)) {
        return {
            type: 'invalid',
            subkey: 'bgImageBlur',
            value: colorTheme.bgImageBlur
        };
    }
    
    if (colorTheme.bgImage && !colorTheme.bgImage.startsWith('url(\"data:image')) {
    return {
            type: 'invalid',
            subkey: 'bgImage',
            value: 'Value must be type "data:image/*"'
        };
    }

    return true;
}
