import { logConsole, showToast, createBsModal, createScannerOverlay } from './utils/dom-utils';
import * as luxon from 'ts-luxon';
import { menu, panel } from './utils/dom-elements';
import { ErrorDetails, handleValidationFailure, verifySettingsJSON } from './importValidation';
import { getClockConfig, getFontConfig, getColorThemeConfig, setClockConfig, setFontConfig, setColorThemeConfig } from './utils/clock-settings';
import { presetList } from './assets/presets/presets';
import axios from 'axios';
import QRCode from 'qrcode';
import { match } from 'ts-pattern';
import i18next from 'i18next';

function getSettings() {
    return {
        clockConfig: getClockConfig(),
        fontConfig: getFontConfig(),
        colorTheme: getColorThemeConfig(),
        exportTimestamp: luxon.DateTime.now().toFormat('FFFF'),
        version: 11
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
    
    showToast(i18next.t('toasts.importexport.exportsuccess', { 0: luxon.DateTime.now().toMillis() - startTime.toMillis() }), 'normal', 'success');
}

type ExportType = 'clipboard' | 'download' | 'log' | 'qr' | 'card';

function getElapsedTime(startTime: luxon.DateTime): number {
    return luxon.DateTime.now().toMillis() - startTime.toMillis();
}

function handleExport(settings: any, type: ExportType, startTime: luxon.DateTime): void {
    const settingsJSON = JSON.stringify(settings);

    const exportActions = {
        clipboard: () => {
            navigator.clipboard.writeText(settingsJSON);
            showToast(i18next.t('toasts.importexport.exportcopysuccess', { 0: getElapsedTime(startTime) }), 'normal', 'success');
        },
        log: () => logConsole(`Settings JSON: ${settingsJSON}`, 'debug'),
        card: () => {
            createBsModal(i18next.t('bsmodal.importexport.rawsettingsjson'), settingsJSON);
            showToast(i18next.t('toasts.importexport.exportrawsuccess', { 0: getElapsedTime(startTime) }), 'normal', 'success');
        },
        qr: () => {
            const blob = new Blob([settingsJSON], { type: 'application/json' });
            if (blob.size > 2953) {
                logConsole(`Settings JSON too large. Max 2953 bytes, got ${blob.size} bytes`, 'error');
                showToast(i18next.t('toasts.importexport.exportqrtoolarge'), 'normal', 'danger');
                return;
            }
            QRCode.toCanvas(settingsJSON, {
                errorCorrectionLevel: 'L',
                margin: 2,
                scale: 4,
                width: 400
            }).then(canvas => createBsModal('QR Code', canvas));
            showToast(i18next.t('toasts.importexport.exportqrsuccess', { 0: getElapsedTime(startTime) }), 'normal', 'success');
        },
        download: () => {
            const blob = new Blob([settingsJSON], { type: 'application/json' });
            downloadSettingsFile(blob, startTime);
        }
    };

    exportActions[type]();
}

export function exportSettings(toType: ExportType = 'download'): void {
    const startTime = luxon.DateTime.now();
    showToast(i18next.t('toasts.importexport.exporting'), 'normal');

    try {
        const settings = getSettings();

        // Soft warning for exporting invalid settings
        if (!(verifySettingsJSON(settings) === true)) {
            logConsole('Settings JSON may be invalid and import verification will fail. If you have modified the settings manually, ignore this message.', 'warning');
        }

        handleExport(settings, toType, startTime);
    } catch (error) {
        logConsole(`Export failed: ${error}`, 'error');
        showToast(i18next.t('toasts.importexport.exporterror'), 'normal', 'danger');
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
            showToast(i18next.t('toasts.importexport.importsuccess', { 0: (importedSettings.exportTimestamp ? importedSettings.exportTimestamp : 'Unknown or missing timestamp') }), 'normal');
        }
    } catch (error) {
        logConsole(`Issue processing settings: ${error}`, 'error');
        showToast(i18next.t('toasts.importexport.importerror'), 'normal', 'danger');
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
        showToast(i18next.t('toasts.importexport.fetcherror'), 'normal', 'danger');
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
            showToast(i18next.t('toasts.importexport.fetcherror'), 'normal', 'danger');
            return Promise.reject(error);
        });
}

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
        button.className = 'btn btn-outline-info mb-1 d-block';
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

// Resetter function
export function resetSettings(): Promise<string> {
    return new Promise((resolve) => {
        if (window.confirm('Reset all clock settings to defaults?')) {
            // Perform the reset
            presetLocalJSON('onlinewebclock-defaults', false) // Clock settings
                .then(() => {
                    // Apply other resets
                    menu.themeradio[0].click(); // Light theme
                    menu.panelvischeckbox.checked = true;
                    menu.panelvischeckbox.dispatchEvent(new Event('change'));
                    if (menu.weatherstopbtn.disabled === false) menu.weatherstopbtn.click();
                    menu.titlevischeckbox.checked = true;
                    
                    // Resolve with true to indicate success
                    resolve('Settings reset successfully');
                })
                .catch(error => {
                    logConsole(`Error resetting settings: ${error}`, 'error');
                    resolve(`Error resetting settings: ${error}`);
                });
        } else {
            // User canceled the reset
            resolve('Reset canceled');
        }
    });
}

// IE listener
panel.section.ie.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON') {
        match(target.id)
            .with('jsonExportClipBtn', () => exportSettings('clipboard'))
            .with('jsonExportDlBtn', () => exportSettings())
            .with('jsonExportQrBtn', () => exportSettings('qr'))
            .with('jsonImportQrBtn', () => createScannerOverlay())
            .with('jsonImportTxtBtn', () => manualJSONImport())
            .with('jsonImportUlBtn', () => importSettingsFromJSON())
            .otherwise(() => {});
    }
});

// Dbg listener
panel.section.dbg.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON') {
        match(target.id)
            .with('jsonExportConsoleBtn', () => exportSettings('log'))
            .with('jsonExportCardBtn', () => exportSettings('card'))
            .with('debugGetBGBtn', () => {
                const bgImageUrl = document.body.style.backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
                if (!bgImageUrl) {
                    showToast(i18next.t('toasts.importexport.nobgimg'));
                    return;
                }
                const imgElement = document.createElement('img');
                imgElement.src = bgImageUrl;
                createBsModal(i18next.t('bsmodal.importexport.backgroundimage'), imgElement);
            })
            .otherwise(() => {});
    }
});
