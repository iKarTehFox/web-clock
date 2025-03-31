import { loadIcons, iconExists } from 'iconify-icon';
import { logConsole } from './dom-utils';
import { countdown, menu, panel, stopwatch } from './dom-elements';
import i18next from 'i18next';

// Preload needed Iconify MDI icons
// Panel
const panelIcons = [
    'mdi:menu',
    'mdi:close',
    'mdi:timer',
    'mdi:timer-sand-complete',
    'mdi:github',
    'mdi:fullscreen'
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
                logConsole(`Preloaded ${loaded.length} Iconify icons`, 'debug');
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
        logConsole('mdi:menu exists. Loading icon...', 'info');
        panel.menubutton.innerHTML = `<iconify-icon inline icon="mdi:menu" width="15" height="15" style="height: 15px;"></iconify-icon> ${i18next.t('panel.menu.label')}`;
    } else {
        panel.menubutton.textContent = `☰ ${i18next.t('panel.menu.label')}`;
    }
    if (iconExists('mdi:github')) {
        logConsole('mdi:github exists. Loading icon...', 'info');
        menu.githubbtn.innerHTML = '<p style="margin-top: -1.5px;"><iconify-icon inline icon="mdi:github"></iconify-icon></p>';
    }
    if (iconExists('mdi:timer')) {
        logConsole('mdi:timer exists. Loading icon...', 'info');
        stopwatch.obutton.innerHTML = '<iconify-icon inline icon="mdi:timer"></iconify-icon>';
    }
    if (iconExists('mdi:timer-sand-complete')) {
        logConsole('mdi:timer-sand-complete exists. Loading icon...', 'info');
        countdown.obutton.innerHTML = '<iconify-icon inline icon="mdi:timer-sand-complete"></iconify-icon>';
    }
    if (iconExists('mdi:fullscreen')) {
        logConsole('mdi:fullscreen exists. Loading icon...', 'info');
        menu.fullscreenbtn.innerHTML = `<iconify-icon icon="mdi:fullscreen" width="19" height="19" style="height: 15px;"></iconify-icon> ${i18next.t('menu.section.displayoptions.setting.fullscreen.option.toggle')}`;
    } else {
        menu.fullscreenbtn.textContent = `⛶ ${i18next.t('menu.section.displayoptions.setting.fullscreen.option.toggle')}`;
    }
});

i18next.on('languageChanged', () => {
    if (iconExists('mdi:menu')) {
        logConsole('mdi:menu exists. Loading icon...', 'info');
        panel.menubutton.innerHTML = `<iconify-icon inline icon="mdi:menu" width="15" height="15" style="height: 15px;"></iconify-icon> ${i18next.t('panel.menu.label')}`;
    } else {
        panel.menubutton.textContent = `☰ ${i18next.t('panel.menu.label')}`;
    }
    if (iconExists('mdi:fullscreen')) {
        logConsole('mdi:fullscreen exists. Loading icon...', 'info');
        menu.fullscreenbtn.innerHTML = `<iconify-icon icon="mdi:fullscreen" width="19" height="19" style="height: 15px;"></iconify-icon> ${i18next.t('menu.section.displayoptions.setting.fullscreen.option.toggle')}`;
    } else {
        menu.fullscreenbtn.textContent = `⛶ ${i18next.t('menu.section.displayoptions.setting.fullscreen.option.toggle')}`;
    }
});