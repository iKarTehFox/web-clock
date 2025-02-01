/* eslint-disable @typescript-eslint/no-explicit-any */
import { logConsole, showToast, makeCardOverlay, createScannerOverlay } from './utils/dom-utils';
import * as luxon from 'ts-luxon';
import { menu, debug } from './utils/dom-elements';
import { ErrorDetails, handleValidationFailure, verifySettingsJSON } from './importValidation';
import { getClockConfig, getFontConfig, getColorThemeConfig, setClockConfig, setFontConfig, setColorThemeConfig } from './utils/clock-settings';
import { getPresetByHotkey, presetList } from './assets/presets';
import axios from 'axios';
import QRCode from 'qrcode';
import { match } from 'ts-pattern';

function getSettings() {
    return {
        clockConfig: getClockConfig(),
        fontConfig: getFontConfig(),
        colorTheme: getColorThemeConfig(),
        exportTimestamp: luxon.DateTime.now().toFormat('FFFF'),
        version: 9
    };
}

function downloadSettingsFile(blob: Blob, startTime: luxon.DateTime) {
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `onlinewebclock-settings_${startTime.toFormat('X')}.json`;
    
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    URL.revokeObjectURL(url);
    
    showToast(`Settings exported! Took ${luxon.DateTime.now().toMillis() - startTime.toMillis()}ms`, 'long', 'success');
}

function handleExport(settings: any, type: 'clipboard' | 'download' | 'log' | 'qr' | 'card' , startTime: luxon.DateTime = luxon.DateTime.now()) {
    const settingsJSON = JSON.stringify(settings);

    match(type)
        .with('clipboard', () => {
            navigator.clipboard.writeText(settingsJSON);
            showToast(`Copied settings to clipboard! Took ${luxon.DateTime.now().toMillis() - startTime.toMillis()}ms`);
        })
        .with('log', () => {
            logConsole(`Settings JSON: ${settingsJSON}`, 'debug');
        })
        .with('card', () => {
            makeCardOverlay('Raw Settings JSON', settingsJSON);
            showToast(`Exported raw JSON. Took ${luxon.DateTime.now().toMillis() - startTime.toMillis()}ms`);
        })
        .with('qr', () => {
            if (settingsJSON.length > 2953) {
                logConsole(`Settings JSON too large. Max 2953, got ${settingsJSON.length}`, 'error');
                showToast('Settings too large for QR code. See console for details.', 'normal', 'danger');
                return;
            }
            QRCode.toCanvas(settingsJSON, {
                errorCorrectionLevel: 'L',
                margin: 2,
                scale: 4,
                width: 400
            }).then(canvas => {
                makeCardOverlay('QR Code', canvas);
            });
            showToast(`Exported settings to QR code! Took ${luxon.DateTime.now().toMillis() - startTime.toMillis()}ms`);
        })
        .with('download', () => {
            const blob = new Blob([settingsJSON], { type: 'application/json' });
            downloadSettingsFile(blob, startTime);
        })
        .exhaustive();
}

export function exportSettings(toType: 'clipboard' | 'download' | 'log' | 'qr' | 'card' = 'download') {
    const startTime = luxon.DateTime.now();
    showToast('Exporting settings...');

    try {
        const settings = getSettings();

        // Soft warning for exporting invalid settings
        if (!(verifySettingsJSON(settings) === true)) {
            logConsole('Settings JSON may be invalid and import verification will fail. If you have modified the settings manually, ignore this message.', 'warning');
        }

        handleExport(settings, toType, startTime);
    } catch (error) {
        logConsole(`Export failed: ${error}`, 'error');
        showToast('Error exporting settings! Check console for details.', 'normal', 'danger');
    }
}

// Helper function to process JSON settings
export function processJSONSettings(jsonText: string, alertConfirmation: boolean = true) {
    try {
        const importedSettings = JSON.parse(jsonText);

        const validation = verifySettingsJSON(importedSettings);
        if (validation !== true) {
            handleValidationFailure(validation as ErrorDetails);
            return;
        }

        updateClockSettings(importedSettings);
        logConsole('Settings successfully loaded!', 'info');
        if (alertConfirmation === true) {
            showToast(`Settings successfully imported!<hr><b>File timestamp:</b> ${(importedSettings.exportTimestamp ? importedSettings.exportTimestamp : 'Unknown or missing timestamp')}`, 'normal');
        }
    } catch (error) {
        logConsole(`Issue processing settings: ${error}`, 'error');
        showToast('Invalid settings file. Please make sure the file contains valid JSON.', 'normal', 'danger');
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
        logConsole('No settings were provided or the JSON data could not be read.', 'info');
    }
}

// Import settings from a local JSON file
export function presetLocalJSON(filename: string, alertConfirmation: boolean = true): Promise<void> {
    // Sanitize the filename
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9-]/g, '');

    // Reject sanitized filename if it doesn't match the original filename
    if (sanitizedFilename !== filename) {
        showToast('Could not fetch local settings file. Please check the filename and ensure the file exists.', 'normal', 'danger');
        return Promise.reject(new Error('Illegal characters in preset filename. Only alphanumeric characters are allowed.'));
    }

    // Make URL
    const url = `./assets/${sanitizedFilename}.json`;

    // Fetch file using Axios and return Promise
    return axios.get(url)
        .then(response => {
            logConsole(`Attempting to load settings from preset: '${sanitizedFilename}'...`, 'debug');
            processJSONSettings(JSON.stringify(response.data), alertConfirmation);
        })
        .catch(error => {
            logConsole(`Error fetching local settings file: ${error}`, 'error');
            showToast('Could not fetch local settings file. Please check the filename and ensure the file exists.', 'normal', 'danger');
            return Promise.reject(error);
        });
}

// Preset hotkey functionality
document.addEventListener('keydown', (e) => {
    // Skip if text input is focused
    if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
    }

    // Only handle number keys 1-9
    const key = parseInt(e.key);
    if (key >= 1 && key <= 9) {
        const preset = getPresetByHotkey(key);
        if (preset) {
            presetLocalJSON(preset.filename);
            logConsole(`Hotkey ${key} pressed - Loading preset: ${preset.displayName}`, 'debug');
        }
    }
});

function updateClockSettings(importedSettings: { clockConfig: any; fontConfig: any; colorTheme: any; }) {
    // Set clockConfig settings
    const clockConfig = importedSettings.clockConfig;
    setClockConfig(clockConfig, true);

    // Set fontConfig settings
    const fontConfig = importedSettings.fontConfig;
    setFontConfig(fontConfig, true);

    // Set colorTheme settings
    const colorTheme = importedSettings.colorTheme;
    setColorThemeConfig(colorTheme, true);
}

// Preset buttons
export function generatePresetButtons(): void {
    presetList.forEach(preset => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn btn-outline-info mb-1';
        button.setAttribute('data-bs-toggle', 'tooltip');
        button.setAttribute('data-bs-title', preset.description || '');
        button.addEventListener('click', () => {
            presetLocalJSON(preset.filename);
        });
        button.textContent = `[${preset.hotkey}] ${preset.displayName}`;
        menu.jsonpresetsgroup.appendChild(button);
    });
}

generatePresetButtons();

// Surprise! More event listeners!
menu.jsonexportclipbtn.addEventListener('click', () => {
    exportSettings('clipboard');
});

menu.jsonexportdownloadbtn.addEventListener('click', () => {
    exportSettings();
});

menu.jsonexportqrbtn.addEventListener('click', () => {
    exportSettings('qr');
});

menu.jsonmanualimportbtn.addEventListener('click', () => {
    manualJSONImport();
});

menu.jsonimportuploadbtn.addEventListener('click', () => {
    importSettingsFromJSON();
});

menu.jsonimportqrbtn.addEventListener('click', () => {
    createScannerOverlay();
});

debug.jsonexportconsolebtn.addEventListener('click', () => {
    exportSettings('log');
});

debug.jsonexportcardbtn.addEventListener('click', () => {
    exportSettings('card');
});

debug.getbgimgbtn.addEventListener('click', () => {
    const bgImageUrl = document.body.style.backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
    if (!bgImageUrl) {
        showToast('No background image to extract.');
        return;
    }
    const imgElement = document.createElement('img');
    imgElement.src = bgImageUrl;
    makeCardOverlay('Background Image', imgElement);
});
