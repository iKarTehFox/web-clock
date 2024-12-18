import { menu, weather } from '../global';
import { presetLocalJSON } from '../importExport';
import { logConsole, showToast } from './dom-utils';
import { setDebug, setTimeRefresh } from './debug';
import { initializeDebugUI } from './debugUI';
import { submitWeatherSettings } from './weather-utils';

export async function applyURLParams() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    // Debug logging mode
    if (urlParams.get('debugMode') === 'true') {
        setDebug(true);
        initializeDebugUI();
        showToast('Debug mode enabled. DevTools memory will increase over time.', 5000, 'warning');
    }

    // Fast time refresh
    if (urlParams.get('fastRefresh') === 'true') {
        setTimeRefresh(1);
    }

    // Menu theme
    if (urlParams.get('darkMode') === 'true') {
        menu.themeradio[1].checked = true;
        menu.themeradio[1].dispatchEvent(new Event('change'));
    }

    // Weather
    if (urlParams.get('weatherApi') !== null && urlParams.get('weatherLat') !== null && urlParams.get('weatherLon') !== null && (urlParams.get('weatherUnits') == 'imperial' || urlParams.get('weatherUnits') == 'metric')) {
        const weatherApi = urlParams.get('weatherApi') as string;
        const weatherLat = parseFloat(urlParams.get('weatherLat') as string);
        const weatherLon = parseFloat(urlParams.get('weatherLon') as string);
        const weatherUnits = urlParams.get('weatherUnits') as string;

        // Secondary check for valid numbers
        if (!isNaN(weatherLat) && !isNaN(weatherLon)) {
            submitWeatherSettings(weatherApi, weatherLat, weatherLon, weatherUnits);
        }
    }

    // Weather widget position
    if (urlParams.get('weatherWidgetPosX') !== null && urlParams.get('weatherWidgetPosY') !== null) {
        const posX = parseInt(urlParams.get('weatherWidgetPosX') as string);
        const posY = parseInt(urlParams.get('weatherWidgetPosY') as string);
        if (!isNaN(posX) && !isNaN(posY)) {
            weather.container.style.left = `${posX}px`;
            weather.container.style.top = `${posY}px`;
        }
    }

    // Panel visibility
    if (urlParams.get('panelVis') === 'false') {
        menu.panelvischeckbox.checked = false;
        menu.panelvischeckbox.dispatchEvent(new Event('change'));
    }

    // Tab title
    if (urlParams.get('tabTitle') === 'false') {
        menu.titlevischeckbox.checked = false;
        menu.titlevischeckbox.dispatchEvent(new Event('change'));
    }

    // Presets
    if (urlParams.get('preset') !== null) {
        const preset = urlParams.get('preset') as string;
        await presetLocalJSON(preset, false);
    }

    // Auto-restart
    if (urlParams.get('autoRestart') !== null) {
        const autoRestartTime = parseInt(urlParams.get('autoRestart') as string);
        if (!isNaN(autoRestartTime) && autoRestartTime >= 15 && autoRestartTime <= 86400) {
            logConsole(`Set auto restart time for: ${autoRestartTime} seconds...`, 'info');
            menu.autorestarttime.innerHTML = `Auto restart: <b>${autoRestartTime} sec</b>`;
            setTimeout(() => {
                window.location.reload();
            }, autoRestartTime * 1000);
        } else {
            console.warn('Invalid autoRestart value. It should be an integer between 15 and 86400 inclusive.');
        }
    }
    
    // Prevent end-user options modification by removing menu container entirely
    if (urlParams.get('lockSettings') === 'true') {
        menu.container.remove();
        logConsole('Settings locked - Menu container removed...', 'info');
    }
}
