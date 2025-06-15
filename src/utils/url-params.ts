import { menu, panel, weather } from './dom-elements';
import { presetLocalJSON } from '../importExport';
import { logConsole, setMenuTheme, showToast } from './dom-utils';
import { setDebug, setLockSettings, setTimeRefresh } from './debug';
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
    
    // Boolean params
    ['debugMode', 'fastRefresh', 'lockSettings', 'noUpdateNoti', 'panelVis', 'tabTitle'].forEach(key => {
        const value = getParamValue(key);
        if (value !== null) {
            (params as any)[key] = value === 'true';
            logConsole(`URL param "${key}" set to "${(params as any)[key]}". Is type ${typeof (params as any)[key]}`, 'debug', true);;
        } else {
            logConsole(`URL param "${key}" not found. Is type ${typeof (params as any)[key]}`, 'debug', true);
        }
    });

    // Number params
    ['autoRestart', 'clockMode', 'weatherLat', 'weatherLon', 'weatherWidgetPosX', 'weatherWidgetPosY'].forEach(key => {
        const value = getParamValue(key);
        if (value !== null) {
            (params as any)[key] = parseFloat(value);
            logConsole(`URL param "${key}" set to "${(params as any)[key]}". Is type ${typeof (params as any)[key]}`, 'debug', true);
        } else {
            logConsole(`URL param "${key}" not found. Is type ${typeof (params as any)[key]}`, 'debug', true);
        }
    });

    // String params
    ['language', 'menuTheme', 'preset', 'weatherApi', 'weatherUnits'].forEach(key => {
        const value = getParamValue(key);
        if (value !== null) {
            (params as any)[key] = value;
            logConsole(`URL param "${key}" set to "${(params as any)[key]}". Is type ${typeof (params as any)[key]}`, 'debug', true);
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
        .with('light', () => {
            setMenuTheme('light', true);
            menu.themeselect.value = 'lightthememode';
        })
        .with('dark', () => {
            setMenuTheme('dark', true);
            menu.themeselect.value = 'darkthememode';
        })
        .with('midnight', () => {
            setMenuTheme('midnight', true);
            menu.themeselect.value = 'midnightthememode';
        })
        .with('amoled', () => {
            setMenuTheme('amoled', true);
            menu.themeselect.value = 'amoledthememode';
        })
        .with(P.union(undefined, 'auto'), () => {
            setMenuTheme('auto', true);
        })
        .otherwise((invalidTheme) => {
            logConsole(`Invalid theme: ${invalidTheme}, defaulting to auto`, 'warning');
            setMenuTheme('auto', true);
        });

    // Clock mode
    match(params.clockMode)
        .with(12, () => {
            setClockMode(12);
        })
        .with(24, () => {
            setClockMode(24);
        })
        .otherwise(() => {
            setClockMode();
        });
    
    // Weather
    if (params.weatherApi !== undefined && params.weatherLat !== undefined && params.weatherLon !== undefined && (params.weatherUnits == 'imperial' || params.weatherUnits == 'metric')) {
        const weatherApi = params.weatherApi;
        const weatherLat = params.weatherLat;
        const weatherLon = params.weatherLon;
        const weatherUnits = params.weatherUnits;

        // Secondary check for valid numbers
        if (!isNaN(weatherLat) && !isNaN(weatherLon)) {
            submitWeatherSettings(weatherApi, weatherLat, weatherLon, weatherUnits);
        }
    }

    // Weather widget position
    if (params.weatherWidgetPosX !== undefined && params.weatherWidgetPosY !== undefined) {
        const posX = params.weatherWidgetPosX;
        const posY = params.weatherWidgetPosY;
        if (!isNaN(posX) && !isNaN(posY)) {
            weather.container.style.left = `${posX}px`;
            weather.container.style.top = `${posY}px`;
        }
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
