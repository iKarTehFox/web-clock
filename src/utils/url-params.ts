import { menu } from '../global';
import { presetLocalJSON } from '../importExport';
import { getFirstElement } from './dom-utils';

export function applyURLParams() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    // Display settings
    // Debug logging mode
    if (urlParams.get('debug') === 'true') {
        menu.debugcheckbox.checked = true;
    }

    // Menu theme
    if (urlParams.get('darkMode') === 'true') {
        menu.themeradio[1].checked = true;
        menu.themeradio[1].dispatchEvent(new Event('change'));
    }

    // Weather
    if (urlParams.get('weatherApi') !== null && urlParams.get('weatherLat') !== null && urlParams.get('weatherLon') !== null && (urlParams.get('weatherUnits') == 'imperial' || urlParams.get('weatherUnits') == 'metric')) {
        menu.weatherapiinput.value = urlParams.get('weatherApi') as string;
        menu.weatherlatinput.value = urlParams.get('weatherLat') as string;
        menu.weatherloninput.value = urlParams.get('weatherLon') as string;
        getFirstElement<HTMLInputElement>(`input[name="weather-unit-radio"][id="${urlParams.get('weatherUnits')}"]`).checked = true;
        getFirstElement<HTMLInputElement>(`input[name="weather-unit-radio"][id="${urlParams.get('weatherUnits')}"]`).dispatchEvent(new Event('change'));
        menu.weathersubmitbtn.click();
    }

    // Menu visibility
    if (urlParams.get('menuVis') === 'false') {
        menu.menubuttonvischeckbox.checked = false;
        menu.menubuttonvischeckbox.dispatchEvent(new Event('change'));
    }

    // Tab title
    if (urlParams.get('tabTitle') === 'false') {
        menu.titlevischeckbox.checked = false;
        menu.titlevischeckbox.dispatchEvent(new Event('change'));
    }

    // Presets
    if (urlParams.get('preset') !== null) {
        const preset = urlParams.get('preset') as string;
        presetLocalJSON(preset, false);
    }
}
