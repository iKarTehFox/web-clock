import { menu, panel, weather } from './dom-elements';
import { presetLocalJSON } from '../importExport';
import { logConsole, setMenuTheme, showToast } from './dom-utils';
import { setDebug, setLockSettings, setTimeRefresh, setToastPosition } from './debug';
import { submitWeatherSettings } from './weather-utils';
import { match, P } from 'ts-pattern';
import { setClockMode } from '../time-help';
import { showUpdateNotification } from './update-notify';
import i18next from 'i18next';
import { applyFallbackTranslations, updateTranslations } from '../assets/locales/i18n';
import { emit, AppEvents } from '../system/event-bus';

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
    'wUnit': 'weatherUnits'
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

    // Boolean params
    ['debugMode', 'fastRefresh', 'lockSettings', 'noUpdateNoti', 'panelVis', 'tabTitle'].forEach(key => {
        const value = getParamValue(key);
        if (value !== null) {
            if (value === 'true' || value === 'false') {
                (params as any)[key] = value === 'true';
                logConsole(`URL param "${key}" set to "${(params as any)[key]}". Is type ${typeof (params as any)[key]}`, 'debug', true);
            } else {
                logConsole(`Invalid boolean value for "${key}": "${value}". Must be "true" or "false".`, 'warning');
            }
        } else {
            logConsole(`URL param "${key}" not found. Is type ${typeof (params as any)[key]}`, 'debug', true);
        }
    });

    // Clock mode (special number param with specific validation)
    const clockModeValue = getParamValue('clockMode');
    if (clockModeValue !== null) {
        const parsed = parseFloat(clockModeValue);
        if (isValidClockMode(parsed)) {
            params.clockMode = parsed;
            logConsole(`URL param "clockMode" set to "${parsed}". Is type ${typeof parsed}`, 'debug', true);
        } else {
            logConsole(`Invalid clockMode value: "${clockModeValue}". Must be 12 or 24.`, 'warning');
        }
    } else {
        logConsole(`URL param "clockMode" not found. Is type ${typeof params.clockMode}`, 'debug', true);
    }

    // Auto restart (special number param with range validation)
    const autoRestartValue = getParamValue('autoRestart');
    if (autoRestartValue !== null) {
        const parsed = parseFloat(autoRestartValue);
        if (isValidAutoRestart(parsed)) {
            params.autoRestart = parsed;
            logConsole(`URL param "autoRestart" set to "${parsed}". Is type ${typeof parsed}`, 'debug', true);
        } else {
            logConsole(`Invalid autoRestart value: "${autoRestartValue}". Must be a number between 15 and 86400.`, 'warning');
        }
    } else {
        logConsole(`URL param "autoRestart" not found. Is type ${typeof params.autoRestart}`, 'debug', true);
    }

    // Weather coordinates (special number params with coordinate validation)
    const weatherLatValue = getParamValue('weatherLat');
    if (weatherLatValue !== null) {
        const parsed = parseFloat(weatherLatValue);
        if (isValidCoordinate(parsed, 'lat')) {
            params.weatherLat = parsed;
            logConsole(`URL param "weatherLat" set to "${parsed}". Is type ${typeof parsed}`, 'debug', true);
        } else {
            logConsole(`Invalid weatherLat value: "${weatherLatValue}". Must be a number between -90 and 90.`, 'warning');
        }
    } else {
        logConsole(`URL param "weatherLat" not found. Is type ${typeof params.weatherLat}`, 'debug', true);
    }

    const weatherLonValue = getParamValue('weatherLon');
    if (weatherLonValue !== null) {
        const parsed = parseFloat(weatherLonValue);
        if (isValidCoordinate(parsed, 'lon')) {
            params.weatherLon = parsed;
            logConsole(`URL param "weatherLon" set to "${parsed}". Is type ${typeof parsed}`, 'debug', true);
        } else {
            logConsole(`Invalid weatherLon value: "${weatherLonValue}". Must be a number between -180 and 180.`, 'warning');
        }
    } else {
        logConsole(`URL param "weatherLon" not found. Is type ${typeof params.weatherLon}`, 'debug', true);
    }

    // Weather widget position (regular number params - any number is valid)
    ['weatherWidgetPosX', 'weatherWidgetPosY'].forEach(key => {
        const value = getParamValue(key);
        if (value !== null) {
            const parsed = parseFloat(value);
            if (!isNaN(parsed)) {
                (params as any)[key] = parsed;
                logConsole(`URL param "${key}" set to "${parsed}". Is type ${typeof parsed}`, 'debug', true);
            } else {
                logConsole(`Invalid number value for "${key}": "${value}".`, 'warning');
            }
        } else {
            logConsole(`URL param "${key}" not found. Is type ${typeof (params as any)[key]}`, 'debug', true);
        }
    });

    // Menu theme (validated string param)
    const menuThemeValue = getParamValue('menuTheme');
    if (menuThemeValue !== null) {
        if (isValidMenuTheme(menuThemeValue)) {
            params.menuTheme = menuThemeValue;
            logConsole(`URL param "menuTheme" set to "${menuThemeValue}". Is type ${typeof menuThemeValue}`, 'debug', true);
        } else {
            logConsole(`Invalid menuTheme value: "${menuThemeValue}". Must be one of: light, dark, midnight, amoled, auto.`, 'warning');
        }
    } else {
        logConsole(`URL param "menuTheme" not found. Is type ${typeof params.menuTheme}`, 'debug', true);
    }

    // Toast position (validated string param)
    const toastPositionValue = getParamValue('toastPosition');
    if (toastPositionValue !== null) {
        if (isValidToastPosition(toastPositionValue)) {
            params.toastPosition = toastPositionValue;
            logConsole(`URL param "toastPosition" set to "${toastPositionValue}". Is type ${typeof toastPositionValue}`, 'debug', true);
        } else {
            logConsole(`Invalid toastPosition value: "${toastPositionValue}". Must be one of: topleft, topmiddle, bottomleft, bottommiddle, bottomright.`, 'warning');
        }
    } else {
        logConsole(`URL param "toastPosition" not found. Is type ${typeof params.toastPosition}`, 'debug', true);
    }

    // Weather units (validated string param)
    const weatherUnitsValue = getParamValue('weatherUnits');
    if (weatherUnitsValue !== null) {
        if (isValidWeatherUnits(weatherUnitsValue)) {
            params.weatherUnits = weatherUnitsValue;
            logConsole(`URL param "weatherUnits" set to "${weatherUnitsValue}". Is type ${typeof weatherUnitsValue}`, 'debug', true);
        } else {
            logConsole(`Invalid weatherUnits value: "${weatherUnitsValue}". Must be "imperial" or "metric".`, 'warning');
        }
    } else {
        logConsole(`URL param "weatherUnits" not found. Is type ${typeof params.weatherUnits}`, 'debug', true);
    }

    // Regular string params (no specific validation needed)
    ['language', 'preset', 'weatherApi'].forEach(key => {
        const value = getParamValue(key);
        if (value !== null) {
            (params as any)[key] = value;
            logConsole(`URL param "${key}" set to "${value}". Is type ${typeof value}`, 'debug', true);
        } else {
            logConsole(`URL param "${key}" not found. Is type ${typeof (params as any)[key]}`, 'debug', true);
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
        if (i18next.isInitialized) {
            i18next.changeLanguage(params.language);
            updateTranslations();
        } else {
            applyFallbackTranslations();
        }
    } else {
        if (i18next.isInitialized) {
            updateTranslations();
        } else {
            applyFallbackTranslations();
        }
    }

    // Toast position
    if (params.toastPosition !== undefined) {
        setToastPosition(params.toastPosition);
    }

    // Debug logging mode
    if (params.debugMode) {
        setDebug(true);
        showToast(i18next.t('toasts.urlparams.title'), i18next.t('toasts.urlparams.debugmode'), 'normal', 'warning');
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
            menu.autorestarttime.style.display = '';
            menu.autorestarttime.innerHTML = autoRestartTime + 's';
            setTimeout(() => {
                window.location.reload();
            }, autoRestartTime * 1000);
            showToast(i18next.t('toasts.urlparams.title'), i18next.t('toasts.urlparams.autorestart', { 0: autoRestartTime }), 'normal', 'warning');
        } else {
            logConsole('Invalid autoRestart value. It should be an integer between 15 and 86400 inclusive.', 'warning');
        }
    }
    
    // Prevent end-user options modification by removing menu container entirely
    if (params.lockSettings) {
        setLockSettings(true);
        menu.container.remove();
        panel.container.remove();
        emit(AppEvents.SETTINGS_LOCKED, { state: true });
        logConsole('Settings locked - Menu container removed...', 'info');
    }

    // Finalize
    emit(AppEvents.URL_PARAMS_LOADED, {timestamp: Date.now()});
}
