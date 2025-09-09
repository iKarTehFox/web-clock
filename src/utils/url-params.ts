import { menu, panel, weather } from './dom-elements';
import { presetLocalJSON } from '../importExport';
import { logConsole, setMenuTheme, showToast } from './dom-utils';
import { setDebug, setLockSettings, setTimeRefresh, setToastPosition } from './debug';
import { submitWeatherSettings } from './weather-utils';
import { match, P } from 'ts-pattern';
import { setClockMode } from '../time-help';
import { showUpdateNotification } from './update-notify';
import i18next from 'i18next';
import i18n, { applyFallbackTranslations, updateTranslations } from '../assets/locales/i18n';
import { emit, AppEvents } from '../system/event-bus';
import { createTimezoneWindowFromURL, type TimezoneWindowURLParams } from '../timezone-windows';

// Check debug mode early - before any other processing
const earlyUrlParams = new URLSearchParams(window.location.search);
const debugValue = earlyUrlParams.get('debug') || earlyUrlParams.get('debugMode');
if (debugValue === 'true') {
    setDebug(true);
}

// Define parameter interface
interface URLParamConfig {
    // Booleans
    debugMode?: boolean;
    fastRefresh?: boolean;
    lockSettings?: boolean;
    noUpdateNoti?: boolean;
    panelVis?: boolean;
    tabTitle?: boolean;
    // Numbers
    autoRestart?: number;
    clockMode? : 12 | 24;
    weatherLat?: number;
    weatherLon?: number;
    weatherWidgetPosX?: number;
    weatherWidgetPosY?: number;
    // Strings
    language?: string;
    menuTheme?: 'light' | 'dark' | 'midnight' | 'amoled' | 'auto';
    preset?: string;
    toastPosition?: 'topleft' | 'topmiddle' | 'bottomleft' | 'bottommiddle' | 'bottomright';
    weatherApi?: string;
    weatherUnits?: 'imperial' | 'metric';
    // Timezone Windows (up to 2 windows)
    tz1?: string;
    tz1ClockMode?: 12 | 24;
    tz1DateFormat?: string;
    tz1FontFamily?: string;
    tz1FontStyle?: 'italic' | 'normal';
    tz1FontWeight?: 'lighter' | 'normal' | 'bold';
    tz1PosX?: number;
    tz1PosY?: number;
    tz1Width?: number;
    tz1Height?: number;

    tz2?: string;
    tz2ClockMode?: 12 | 24;
    tz2DateFormat?: string;
    tz2FontFamily?: string;
    tz2FontStyle?: 'italic' | 'normal';
    tz2FontWeight?: 'lighter' | 'normal' | 'bold';
    tz2PosX?: number;
    tz2PosY?: number;
    tz2Width?: number;
    tz2Height?: number;
}

// Define aliases
const paramAliases: Record<string, keyof URLParamConfig> = {
    // Boolean aliases
    'debug': 'debugMode',
    'fRef': 'fastRefresh',
    'lock': 'lockSettings',
    'noNoti': 'noUpdateNoti',
    'panel': 'panelVis',
    'tab': 'tabTitle',
    
    // Number aliases
    'auto': 'autoRestart',
    'cMode': 'clockMode',
    'wLat': 'weatherLat',
    'wLon': 'weatherLon',
    'wX': 'weatherWidgetPosX',
    'wY': 'weatherWidgetPosY',
    
    // String aliases
    'lang': 'language',
    'theme': 'menuTheme',
    'pre': 'preset',
    'toastPos': 'toastPosition',
    'wApi': 'weatherApi',
    'wUnit': 'weatherUnits',
    
    // Timezone window aliases
    'tz1CM': 'tz1ClockMode',
    'tz1DF': 'tz1DateFormat',
    'tz1FF': 'tz1FontFamily',
    'tz1FS': 'tz1FontStyle',
    'tz1FW': 'tz1FontWeight',
    'tz1X': 'tz1PosX',
    'tz1Y': 'tz1PosY',
    'tz1W': 'tz1Width',
    'tz1H': 'tz1Height',

    'tz2CM': 'tz2ClockMode',
    'tz2DF': 'tz2DateFormat',
    'tz2FF': 'tz2FontFamily',
    'tz2FS': 'tz2FontStyle',
    'tz2FW': 'tz2FontWeight',
    'tz2X': 'tz2PosX',
    'tz2Y': 'tz2PosY',
    'tz2W': 'tz2Width',
    'tz2H': 'tz2Height'
};  

function parseURLParams(urlSearchParams: URLSearchParams): Partial<URLParamConfig> {
    const params = {} as Partial<URLParamConfig>;

    // Helper function to get parameter value checking both the key and its alias
    const getParamValue = (key: string): string | null => {
        let value = urlSearchParams.get(key);
        if (value === null) {
            // Find all aliases that map to this key
            const aliases = Object.entries(paramAliases)
                .filter(([_, canonicalKey]) => canonicalKey === key)
                .map(([alias, _]) => alias);
                    
            // Check each alias
            for (const alias of aliases) {
                value = urlSearchParams.get(alias);
                if (value !== null) break;
            }
        }
        return value;
    };

    // Validation functions
    const isValidToastPosition = (value: string): value is URLParamConfig['toastPosition'] => {
        return ['topleft', 'topmiddle', 'bottomleft', 'bottommiddle', 'bottomright'].includes(value);
    };

    const isValidMenuTheme = (value: string): value is URLParamConfig['menuTheme'] => {
        return ['light', 'dark', 'midnight', 'amoled', 'auto'].includes(value);
    };

    const isValidWeatherUnits = (value: string): value is URLParamConfig['weatherUnits'] => {
        return ['imperial', 'metric'].includes(value);
    };

    const isValidClockMode = (value: number): value is URLParamConfig['clockMode'] => {
        return value === 12 || value === 24;
    };

    const isValidAutoRestart = (value: number): boolean => {
        return !isNaN(value) && value >= 15 && value <= 86400;
    };

    const isValidCoordinate = (value: number, type: 'lat' | 'lon'): boolean => {
        if (isNaN(value)) return false;
        if (type === 'lat') return value >= -90 && value <= 90;
        if (type === 'lon') return value >= -180 && value <= 180;
        return false;
    };

    const isValidFontStyle = (value: string): value is 'italic' | 'normal' => {
        return ['italic', 'normal'].includes(value);
    };

    const isValidFontWeight = (value: string): value is 'lighter' | 'normal' | 'bold' => {
        return ['lighter', 'normal', 'bold'].includes(value);
    };

    // Boolean params
    ['debugMode', 'fastRefresh', 'lockSettings', 'noUpdateNoti', 'panelVis', 'tabTitle'].forEach(key => {
        const value = getParamValue(key);
        if (value !== null) {
            if (value === 'true' || value === 'false') {
                (params as any)[key] = value === 'true';
                logConsole(`URL param "${key}" set to "${(params as any)[key]}". Is type ${typeof (params as any)[key]}`, 'debug');
            } else {
                logConsole(`Invalid boolean value for "${key}": "${value}". Must be "true" or "false".`, 'warning');
            }
        } else {
            logConsole(`URL param "${key}" not found. Is type ${typeof (params as any)[key]}`, 'debug');
        }
    });

    // Clock mode
    const clockModeValue = getParamValue('clockMode');
    if (clockModeValue !== null) {
        const parsed = parseFloat(clockModeValue);
        if (isValidClockMode(parsed)) {
            params.clockMode = parsed;
            logConsole(`URL param "clockMode" set to "${parsed}". Is type ${typeof parsed}`, 'debug');
        } else {
            logConsole(`Invalid clockMode value: "${clockModeValue}". Must be 12 or 24.`, 'warning');
        }
    } else {
        logConsole(`URL param "clockMode" not found. Is type ${typeof params.clockMode}`, 'debug');
    }

    // Auto restart
    const autoRestartValue = getParamValue('autoRestart');
    if (autoRestartValue !== null) {
        const parsed = parseFloat(autoRestartValue);
        if (isValidAutoRestart(parsed)) {
            params.autoRestart = parsed;
            logConsole(`URL param "autoRestart" set to "${parsed}". Is type ${typeof parsed}`, 'debug');
        } else {
            logConsole(`Invalid autoRestart value: "${autoRestartValue}". Must be a number between 15 and 86400.`, 'warning');
        }
    } else {
        logConsole(`URL param "autoRestart" not found. Is type ${typeof params.autoRestart}`, 'debug');
    }

    // Weather coordinates
    const weatherLatValue = getParamValue('weatherLat');
    if (weatherLatValue !== null) {
        const parsed = parseFloat(weatherLatValue);
        if (isValidCoordinate(parsed, 'lat')) {
            params.weatherLat = parsed;
            logConsole(`URL param "weatherLat" set to "${parsed}". Is type ${typeof parsed}`, 'debug');
        } else {
            logConsole(`Invalid weatherLat value: "${weatherLatValue}". Must be a number between -90 and 90.`, 'warning');
        }
    } else {
        logConsole(`URL param "weatherLat" not found. Is type ${typeof params.weatherLat}`, 'debug');
    }

    const weatherLonValue = getParamValue('weatherLon');
    if (weatherLonValue !== null) {
        const parsed = parseFloat(weatherLonValue);
        if (isValidCoordinate(parsed, 'lon')) {
            params.weatherLon = parsed;
            logConsole(`URL param "weatherLon" set to "${parsed}". Is type ${typeof parsed}`, 'debug');
        } else {
            logConsole(`Invalid weatherLon value: "${weatherLonValue}". Must be a number between -180 and 180.`, 'warning');
        }
    } else {
        logConsole(`URL param "weatherLon" not found. Is type ${typeof params.weatherLon}`, 'debug');
    }

    // Weather widget position (regular number params - any number is valid)
    ['weatherWidgetPosX', 'weatherWidgetPosY'].forEach(key => {
        const value = getParamValue(key);
        if (value !== null) {
            const parsed = parseFloat(value);
            if (!isNaN(parsed)) {
                (params as any)[key] = parsed;
                logConsole(`URL param "${key}" set to "${parsed}". Is type ${typeof parsed}`, 'debug');
            } else {
                logConsole(`Invalid number value for "${key}": "${value}".`, 'warning');
            }
        } else {
            logConsole(`URL param "${key}" not found. Is type ${typeof (params as any)[key]}`, 'debug');
        }
    });

    // Menu theme (validated string param)
    const menuThemeValue = getParamValue('menuTheme');
    if (menuThemeValue !== null) {
        if (isValidMenuTheme(menuThemeValue)) {
            params.menuTheme = menuThemeValue;
            logConsole(`URL param "menuTheme" set to "${menuThemeValue}". Is type ${typeof menuThemeValue}`, 'debug');
        } else {
            logConsole(`Invalid menuTheme value: "${menuThemeValue}". Must be one of: light, dark, midnight, amoled, auto.`, 'warning');
        }
    } else {
        logConsole(`URL param "menuTheme" not found. Is type ${typeof params.menuTheme}`, 'debug');
    }

    // Toast position (validated string param)
    const toastPositionValue = getParamValue('toastPosition');
    if (toastPositionValue !== null) {
        if (isValidToastPosition(toastPositionValue)) {
            params.toastPosition = toastPositionValue;
            logConsole(`URL param "toastPosition" set to "${toastPositionValue}". Is type ${typeof toastPositionValue}`, 'debug');
        } else {
            logConsole(`Invalid toastPosition value: "${toastPositionValue}". Must be one of: topleft, topmiddle, bottomleft, bottommiddle, bottomright.`, 'warning');
        }
    } else {
        logConsole(`URL param "toastPosition" not found. Is type ${typeof params.toastPosition}`, 'debug');
    }

    // Weather units (validated string param)
    const weatherUnitsValue = getParamValue('weatherUnits');
    if (weatherUnitsValue !== null) {
        if (isValidWeatherUnits(weatherUnitsValue)) {
            params.weatherUnits = weatherUnitsValue;
            logConsole(`URL param "weatherUnits" set to "${weatherUnitsValue}". Is type ${typeof weatherUnitsValue}`, 'debug');
        } else {
            logConsole(`Invalid weatherUnits value: "${weatherUnitsValue}". Must be "imperial" or "metric".`, 'warning');
        }
    } else {
        logConsole(`URL param "weatherUnits" not found. Is type ${typeof params.weatherUnits}`, 'debug');
    }

    // Regular string params (no specific validation needed)
    ['language', 'preset', 'weatherApi'].forEach(key => {
        const value = getParamValue(key);
        if (value !== null) {
            (params as any)[key] = value;
            logConsole(`URL param "${key}" set to "${value}". Is type ${typeof value}`, 'debug');
        } else {
            logConsole(`URL param "${key}" not found. Is type ${typeof (params as any)[key]}`, 'debug');
        }
    });

    // Timezone window string params (timezone and dateFormat)
    ['tz1', 'tz1DateFormat', 'tz1Font', 'tz2', 'tz2DateFormat', 'tz2Font'].forEach(key => {
        const value = getParamValue(key);
        if (value !== null) {
            (params as any)[key] = value;
            logConsole(`URL param "${key}" set to "${value}". Is type ${typeof value}`, 'debug');
        } else {
            logConsole(`URL param "${key}" not found. Is type ${typeof (params as any)[key]}`, 'debug');
        }
    });

    // Timezone window clock modes (12/24)
    ['tz1ClockMode', 'tz2ClockMode'].forEach(key => {
        const value = getParamValue(key);
        if (value !== null) {
            const parsed = parseFloat(value);
            if (isValidClockMode(parsed)) {
                (params as any)[key] = parsed;
                logConsole(`URL param "${key}" set to "${parsed}". Is type ${typeof parsed}`, 'debug');
            } else {
                logConsole(`Invalid ${key} value: "${value}". Must be 12 or 24.`, 'warning');
            }
        } else {
            logConsole(`URL param "${key}" not found. Is type ${typeof (params as any)[key]}`, 'debug');
        }
    });

    // Timezone window font styles
    ['tz1FontStyle', 'tz2FontStyle'].forEach(key => {
        const value = getParamValue(key);
        if (value !== null) {
            if (isValidFontStyle(value)) {
                (params as any)[key] = value;
                logConsole(`URL param "${key}" set to "${value}". Is type ${typeof value}`, 'debug');
            } else {
                logConsole(`Invalid ${key} value: "${value}". Must be "italic" or "normal".`, 'warning');
            }
        } else {
            logConsole(`URL param "${key}" not found. Is type ${typeof (params as any)[key]}`, 'debug');
        }
    });

    // Timezone window font weights
    ['tz1FontWeight', 'tz2FontWeight'].forEach(key => {
        const value = getParamValue(key);
        if (value !== null) {
            if (isValidFontWeight(value)) {
                (params as any)[key] = value;
                logConsole(`URL param "${key}" set to "${value}". Is type ${typeof value}`, 'debug');
            } else {
                logConsole(`Invalid ${key} value: "${value}". Must be "lighter", "normal", or "bold".`, 'warning');
            }
        } else {
            logConsole(`URL param "${key}" not found. Is type ${typeof (params as any)[key]}`, 'debug');
        }
    });

    // Timezone window positioning (regular number params - any number is valid)
    ['tz1PosX', 'tz1PosY', 'tz1Width', 'tz1Height', 'tz2PosX', 'tz2PosY', 'tz2Width', 'tz2Height'].forEach(key => {
        const value = getParamValue(key);
        if (value !== null) {
            const parsed = parseFloat(value);
            if (!isNaN(parsed)) {
                (params as any)[key] = parsed;
                logConsole(`URL param "${key}" set to "${parsed}". Is type ${typeof parsed}`, 'debug');
            } else {
                logConsole(`Invalid number value for "${key}": "${value}".`, 'warning');
            }
        } else {
            logConsole(`URL param "${key}" not found. Is type ${typeof (params as any)[key]}`, 'debug');
        }
    });

    return params;
}

export async function applyURLParams() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const params = parseURLParams(urlParams);

    // Language
    if (params.language !== undefined) {
        if (i18n.isReady()) {
            i18n.changeLanguage(params.language).catch(error => {
                logConsole(`Failed to change language via URL param: ${error}`, 'warning');
                applyFallbackTranslations();
            });
        } else {
            applyFallbackTranslations();
        }
    } else {
        if (i18n.isReady()) {
            updateTranslations();
        } else {
            applyFallbackTranslations();
        }
    }

    // Toast position
    if (params.toastPosition !== undefined) {
        setToastPosition(params.toastPosition);
    }

    // Debug logging mode (show toast notification)
    if (params.debugMode) {
        showToast({
            title: i18next.t('toasts.urlparams.title'),
            message: i18next.t('toasts.urlparams.debugmode'),
            style: 'warning',
            icon: 'bi-exclamation-triangle-fill'
        });
    }

    // Fast time refresh
    if (params.fastRefresh) {
        setTimeRefresh(1);
    }

    // Menu theme
    match(params.menuTheme)
        .with(P.union('light', 'dark', 'midnight', 'amoled'), (theme) => {
            setMenuTheme(theme, true);
            menu.themeselect.value = `${theme}thememode`;
        })
        .with(P.union(undefined, 'auto'), () => {
            setMenuTheme('auto', true);
        })
        .otherwise((invalidTheme) => {
            logConsole(`Invalid theme: ${invalidTheme}, defaulting to auto`, 'warning');
            setMenuTheme('auto', true);
        });

    // Clock mode
    if (params.clockMode !== undefined) {
        setClockMode(params.clockMode);
    } else {
        setClockMode();
    }
    
    // Weather
    if (params.weatherApi !== undefined && 
        params.weatherLat !== undefined && 
        params.weatherLon !== undefined && 
        params.weatherUnits !== undefined) {
        submitWeatherSettings(params.weatherApi, params.weatherLat, params.weatherLon, params.weatherUnits);
    }

    // Weather widget position
    if (params.weatherWidgetPosX !== undefined && params.weatherWidgetPosY !== undefined) {
        weather.container.style.left = `${params.weatherWidgetPosX}px`;
        weather.container.style.top = `${params.weatherWidgetPosY}px`;
    }

    // Panel visibility
    if (params.panelVis === false) {
        menu.panelvischeckbox.checked = false;
        menu.panelvischeckbox.dispatchEvent(new Event('change'));
    }

    // Tab title
    if (params.tabTitle === false) {
        menu.titlevischeckbox.checked = false;
        menu.titlevischeckbox.dispatchEvent(new Event('change'));
    }

    // Presets
    if (params.preset !== undefined) {
        const preset = params.preset;
        await presetLocalJSON(preset, false);
    }

    // New update notification
    if (!params.noUpdateNoti) {
        showUpdateNotification();
    }

    // Auto-restart
    if (params.autoRestart !== undefined) {
        const autoRestartTime = params.autoRestart;
        if (!isNaN(autoRestartTime) && autoRestartTime >= 15 && autoRestartTime <= 86400) {
            logConsole(`Set auto restart time for: ${autoRestartTime} seconds...`, 'debug');
            menu.autorestartgroup.classList.remove('d-none');
            menu.autorestarttime.innerHTML = autoRestartTime + 's';
            setTimeout(() => {
                window.location.reload();
            }, autoRestartTime * 1000);
            showToast({
                title: i18next.t('toasts.urlparams.title'),
                message: i18next.t('toasts.urlparams.autorestart', { 0: autoRestartTime }),
                duration: 'normal',
                style: 'warning',
                icon: 'bi-exclamation-triangle-fill'
            });
        } else {
            logConsole('Invalid autoRestart value. It should be an integer between 15 and 86400 inclusive.', 'warning');
        }
    }
    
    // Prevent end-user options modification by removing menu container entirely
    if (params.lockSettings && params.debugMode) {
        logConsole('lockSettings and debugMode are incompatible. Settings will not be locked.', 'error');
        showToast({
            message: i18next.t('toasts.urlparams.incompatible'),
            title: i18next.t('toasts.urlparams.title'),
            style: 'danger',
            icon: 'bi-exclamation-triangle-fill'
        });
    } else if (params.lockSettings && !params.debugMode) {
        setLockSettings(true);
        menu.container.remove();
        panel.container.remove();
        emit(AppEvents.SETTINGS_LOCKED, { state: true });
        logConsole('Settings locked - Menu container removed...', 'info');
    }

    // Timezone Windows
    // Helper function to create timezone window from params
    const createTimezoneWindowFromParams = (windowNum: 1 | 2) => {
        const prefix = `tz${windowNum}` as const;
        const timezone = (params as any)[prefix];
        
        if (timezone) {
            const tzParams: TimezoneWindowURLParams = {
                timezone,
                clockMode: (params as any)[`${prefix}ClockMode`],
                dateFormat: (params as any)[`${prefix}DateFormat`],
                fontFamily: (params as any)[`${prefix}FontFamily`],
                fontStyle: (params as any)[`${prefix}FontStyle`],
                fontWeight: (params as any)[`${prefix}FontWeight`],
                x: (params as any)[`${prefix}PosX`],
                y: (params as any)[`${prefix}PosY`],
                width: (params as any)[`${prefix}Width`],
                height: (params as any)[`${prefix}Height`]
            };
            
            const windowId = createTimezoneWindowFromURL(tzParams);
            if (windowId) {
                logConsole(`Created timezone window ${windowNum} for ${timezone} (ID: ${windowId})`, 'info');
            } else {
                logConsole(`Failed to create timezone window ${windowNum} for ${timezone}`, 'warning');
            }
        }
    };

    // Create timezone windows (lockSettings has already been processed above)
    createTimezoneWindowFromParams(1);
    createTimezoneWindowFromParams(2);

    // Finalize
    emit(AppEvents.URL_PARAMS_LOADED, {timestamp: Date.now()});
}
