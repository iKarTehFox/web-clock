import { menu, weather } from './dom-elements';
import { presetLocalJSON } from '../importExport';
import { logConsole, showToast } from './dom-utils';
import { setDebug, setLockSettings, setTimeRefresh } from './debug';
import { initializeDebugUI } from './debugUI';
import { submitWeatherSettings } from './weather-utils';
import { startColorFade } from '../background-color';

interface URLParamConfig {
    debugMode?: boolean;
    fastRefresh?: boolean;
    darkMode?: boolean;
    weatherApi?: string;
    weatherLat?: number;
    weatherLon?: number;
    weatherUnits?: 'imperial' | 'metric';
    weatherWidgetPosX?: number;
    weatherWidgetPosY?: number;
    panelVis?: boolean;
    tabTitle?: boolean;
    preset?: string;
    autoRestart?: number;
    lockSettings?: boolean;
}

function parseURLParams(urlSearchParams: URLSearchParams): Partial<URLParamConfig> {
    const params = {} as Partial<URLParamConfig>;
    
    // Boolean params
    ['debugMode', 'fastRefresh', 'darkMode', 'panelVis', 'tabTitle', 'lockSettings'].forEach(key => {
        const value = urlSearchParams.get(key);
        if (value !== null) {
            (params as any)[key] = value === 'true';
            logConsole(`URL param "${key}" set to "${(params as any)[key]}". Is type ${typeof (params as any)[key]}`, 'bypass');
        } else {
            logConsole(`URL param "${key}" not found. Is type ${typeof (params as any)[key]}`, 'bypass');
        }
    });

    // Number params
    ['weatherLat', 'weatherLon', 'weatherWidgetPosX', 'weatherWidgetPosY', 'autoRestart'].forEach(key => {
        const value = urlSearchParams.get(key);
        if (value !== null) {
            (params as any)[key] = parseFloat(value);
            logConsole(`URL param "${key}" set to "${(params as any)[key]}". Is type ${typeof (params as any)[key]}`, 'bypass');
        } else {
            logConsole(`URL param "${key}" not found. Is type ${typeof (params as any)[key]}`, 'bypass');
        }
    });

    // String params
    ['weatherApi', 'weatherUnits', 'preset'].forEach(key => {
        const value = urlSearchParams.get(key);
        if (value !== null) {
            (params as any)[key] = value;
            logConsole(`URL param "${key}" set to "${(params as any)[key]}". Is type ${typeof (params as any)[key]}`, 'bypass');
        } else {
            logConsole(`URL param "${key}" not found. Is type ${typeof (params as any)[key]}`, 'bypass');
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
    if (params.darkMode) {
        menu.themeradio[1].checked = true;
        menu.themeradio[1].dispatchEvent(new Event('change'));
    }

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
        try {
            await presetLocalJSON(preset, false);
        } catch {
            startColorFade();
        }
    } else {
        startColorFade();
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
