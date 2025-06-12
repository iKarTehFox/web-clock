import i18next from 'i18next';
import { debug, dtdisplay, panel } from './dom-elements';
import { showToast } from './dom-utils';
import { on, AppEvents } from '../system/event-bus';

// Get load time
const loadTime = new Date().toLocaleString();

function addDbgInfo(text: string): void {
    const p = document.createElement('p');
    p.className = 'mb-1';
    p.textContent = text;
    debug.info.appendChild(p);
}

function initializeDebugUI(): void {
    // Enable debug container
    debug.container.classList.remove('d-none');

    // Fill debug info
    addDbgInfo(`${i18next.t('menu.section.debugging.setting.debuginfo.option.useragent')}: ${navigator.userAgent}`); // User agent
    addDbgInfo(`${i18next.t('menu.section.debugging.setting.debuginfo.option.locale')}: ${navigator.language}`); // Locale
    addDbgInfo(`${i18next.t('menu.section.debugging.setting.debuginfo.option.timezone')}: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`); // Timezone
    addDbgInfo(`${i18next.t('menu.section.debugging.setting.debuginfo.option.loadtime')}: ${loadTime}`); // Load time
    addDbgInfo(`${i18next.t('menu.section.debugging.setting.debuginfo.option.resolution')}: ${window.screen.width}x${window.screen.height}`); // Screen resolution
    addDbgInfo(`${i18next.t('menu.section.debugging.setting.debuginfo.option.colordepth')}: ${window.screen.colorDepth}-bit`); // Color depth
    addDbgInfo(`${i18next.t('menu.section.debugging.setting.debuginfo.option.onlinestatus')}: ${navigator.onLine ? 'Online' : 'Offline'}`); // Online status

    // Dev Console
    panel.devconbutton.classList.remove('d-none');

    // Event listeners
    debug.toastbtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.dbgtoasttheme;
            const length = btn.dataset.dbgtoastlength as 'default' | 'normal' | 'long' | 'verylong' | undefined;
            showToast(i18next.t('toasts.debugui.testtoast', { 0: theme }), length, theme);
        });
    });

    debug.rmclockbtn.addEventListener('click', () => {
        dtdisplay.ccontainer.remove();
    });

    debug.clearlsbtn.addEventListener('click', () => {
        localStorage.clear();
        showToast(i18next.t('toasts.debugui.clearls'), undefined, 'warning');
    });

    // Reinitialize if language changed
    i18next.on('languageChanged', (lng) => {
        debug.info.innerHTML = '';
        // Add debug info
        addDbgInfo(`${i18next.t('menu.section.debugging.setting.debuginfo.option.useragent')}: ${navigator.userAgent}`); // User agent
        addDbgInfo(`${i18next.t('menu.section.debugging.setting.debuginfo.option.locale')}: ${navigator.language}`); // Locale
        addDbgInfo(`${i18next.t('menu.section.debugging.setting.debuginfo.option.timezone')}: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`); // Timezone
        addDbgInfo(`${i18next.t('menu.section.debugging.setting.debuginfo.option.loadtime')}: ${loadTime}`); // Load time
        addDbgInfo(`${i18next.t('menu.section.debugging.setting.debuginfo.option.resolution')}: ${window.screen.width}x${window.screen.height}`); // Screen resolution
        addDbgInfo(`${i18next.t('menu.section.debugging.setting.debuginfo.option.colordepth')}: ${window.screen.colorDepth}-bit`); // Color depth
        addDbgInfo(`${i18next.t('menu.section.debugging.setting.debuginfo.option.onlinestatus')}: ${navigator.onLine ? 'Online' : 'Offline'}`); // Online status
    });
}

on(AppEvents.DEBUG_MODE_ENABLED, (state) => {
    if (state) {
        initializeDebugUI();
    }
});
