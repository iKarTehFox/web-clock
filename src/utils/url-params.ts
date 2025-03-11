import { menu, weather } from './dom-elements';
import { presetLocalJSON } from '../importExport';
import { logConsole, showToast } from './dom-utils';
import { setDebug, setLockSettings, setTimeRefresh } from './debug';
import { initializeDebugUI } from './debugUI';
import { submitWeatherSettings } from './weather-utils';
import { match } from 'ts-pattern';

interface URLParamConfig {
    // Booleans
    debugMode?: boolean;
    fastRefresh?: boolean;
    lockSettings?: boolean;
    panelVis?: boolean;
    tabTitle?: boolean;
    // Numbers
    autoRestart?: number;
    weatherLat?: number;
    weatherLon?: number;
    weatherWidgetPosX?: number;
    weatherWidgetPosY?: number;
    // Strings
    menuTheme?: 'light' | 'dark';
    preset?: string;
    weatherApi?: string;
    weatherUnits?: 'imperial' | 'metric';
}

function parseURLParams(urlSearchParams: URLSearchParams): Partial<URLParamConfig> {
    const params = {} as Partial<URLParamConfig>;
    
    // Boolean params
    ['debugMode', 'fastRefresh', 'lockSettings', 'panelVis', 'tabTitle'].forEach(key => {
        const value = urlSearchParams.get(key);
        if (value !== null) {
            (params as any)[key] = value === 'true';
            logConsole(`URL param "${key}" set to "${(params as any)[key]}". Is type ${typeof (params as any)[key]}`, 'debug', true);;
        } else {
            logConsole(`URL param "${key}" not found. Is type ${typeof (params as any)[key]}`, 'debug', true);
        }
    });

    // Number params
    ['autoRestart', 'weatherLat', 'weatherLon', 'weatherWidgetPosX', 'weatherWidgetPosY'].forEach(key => {
        const value = urlSearchParams.get(key);
        if (value !== null) {
            (params as any)[key] = parseFloat(value);
            logConsole(`URL param "${key}" set to "${(params as any)[key]}". Is type ${typeof (params as any)[key]}`, 'debug', true);
        } else {
            logConsole(`URL param "${key}" not found. Is type ${typeof (params as any)[key]}`, 'debug', true);
        }
    });

    // String params
    ['menuTheme', 'preset', 'weatherApi', 'weatherUnits'].forEach(key => {
        const value = urlSearchParams.get(key);
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

    // Debug logging mode
    if (params.debugMode) {
        setDebug(true);
        initializeDebugUI();
        showToast('Debug mode enabled. DevTools memory will increase over time.', 'normal', 'warning');
    }

    // Fast time refresh
    if (params.fastRefresh) {
        setTimeRefresh(1);
    }

    // Menu theme
    match(params.menuTheme)
        .with('light', () => {
            menu.themeradio[0].checked = true;
            menu.themeradio[0].dispatchEvent(new Event('change', { bubbles: true }));
        })
        .with('dark', () => {
            menu.themeradio[1].checked = true;
            menu.themeradio[1].dispatchEvent(new Event('change', { bubbles: true }));
        })
        .with(undefined, () => {
            const index = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 1 : 0;
            menu.themeradio[index].checked = true;
            menu.themeradio[index].dispatchEvent(new Event('change', { bubbles: true }));
        })
        .exhaustive();
    
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

    // Auto-restart
    if (params.autoRestart !== undefined) {
        const autoRestartTime = params.autoRestart;
        if (!isNaN(autoRestartTime) && autoRestartTime >= 15 && autoRestartTime <= 86400) {
            logConsole(`Set auto restart time for: ${autoRestartTime} seconds...`, 'debug');
            menu.autorestarttime.innerHTML = `Auto restart: <b>${autoRestartTime} sec</b>`;
            setTimeout(() => {
                window.location.reload();
            }, autoRestartTime * 1000);
            showToast(`Auto restart set to ${autoRestartTime} seconds.`, 'normal', 'warning');
        } else {
            logConsole('Invalid autoRestart value. It should be an integer between 15 and 86400 inclusive.', 'warning');
        }
    }
    
    // Prevent end-user options modification by removing menu container entirely
    if (params.lockSettings) {
        setLockSettings(true);
        menu.container.remove();
        logConsole('Settings locked - Menu container removed...', 'info');
    }
}
