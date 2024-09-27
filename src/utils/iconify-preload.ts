import { loadIcons, iconExists } from 'iconify-icon';
import { logConsole } from './dom-utils';
import { countdown, menu, stopwatch } from '../global';

// Preload needed Iconify MDI icons
// Panel
const panelIcons = [
    'mdi:menu',
    'mdi:close',
    'mdi:timer',
    'mdi:timer-sand-complete',
    'mdi:github'
];

// Weather widget
const weatherIcons = [
    'mdi:weather-sunny',
    'mdi:weather-partly-cloudy',
    'mdi:weather-cloudy',
    'mdi:weather-partly-rainy',
    'mdi:weather-pouring',
    'mdi:weather-lightning',
    'mdi:weather-snowy',
    'mdi:weather-fog'
];

export function preloadIcons(): Promise<void> {
    return new Promise((resolve) => {
        loadIcons(panelIcons.concat(weatherIcons), (loaded, missing) => {
            if (loaded.length > 0) {
                logConsole(`Successfully preloaded ${loaded.length} Iconify icons`, 'info');
            }
            if (missing.length > 0 && missing.length < panelIcons.length) {
                logConsole(`Missing ${missing.length} Iconify icons. Unstable internet?`, 'warning');
            } else if (missing.length == panelIcons.length) {
                logConsole(`Failed to preload all ${missing.length} Iconify icons. No internet?`, 'error');
            }
            resolve();
        });
    });
}

// Load Iconify icons properly
preloadIcons().then(() => {
    if (iconExists('mdi:menu')) {
        menu.obutton.innerHTML = '<iconify-icon inline icon="mdi:menu"></iconify-icon> Menu';
    }
    if (iconExists('mdi:close')) {
        menu.cbutton.innerHTML = '<iconify-icon inline icon="mdi:close"></iconify-icon> Close';
    }
    if (iconExists('mdi:github')) {
        menu.githubbtn.innerHTML = '<p style="margin-top: -1.5px;"><iconify-icon inline icon="mdi:github"></iconify-icon></p>';
    }
    if (iconExists('mdi:timer')) {
        stopwatch.obutton.innerHTML = '<iconify-icon inline icon="mdi:timer"></iconify-icon>';
    }
    if (iconExists('mdi:timer-sand-complete')) {
        countdown.obutton.innerHTML = '<iconify-icon inline icon="mdi:timer-sand-complete"></iconify-icon>';
    }
});