import i18next from 'i18next';
import { debug, dtdisplay } from './dom-elements';
import { showToast } from './dom-utils';

function addDbgInfo(text: string): void {
    const p = document.createElement('p');
    p.className = 'mb-1';
    p.textContent = text;
    debug.info.appendChild(p);
}

export function initializeDebugUI(): void {
    // Enable debug container
    debug.container.style.display = '';

    // Fill debug info
    addDbgInfo(`${i18next.t('menu.section.debugging.setting.debuginfo.option.useragent')}: ${navigator.userAgent}`); // User agent
    addDbgInfo(`${i18next.t('menu.section.debugging.setting.debuginfo.option.locale')}: ${navigator.language}`); // Locale
    addDbgInfo(`${i18next.t('menu.section.debugging.setting.debuginfo.option.timezone')}: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`); // Timezone
    addDbgInfo(`${i18next.t('menu.section.debugging.setting.debuginfo.option.loadtime')}: ${new Date().toLocaleString()}`); // Load time
    addDbgInfo(`${i18next.t('menu.section.debugging.setting.debuginfo.option.resolution')}: ${window.screen.width}x${window.screen.height}`); // Screen resolution
    addDbgInfo(`${i18next.t('menu.section.debugging.setting.debuginfo.option.colordepth')}: ${window.screen.colorDepth}-bit`); // Color depth
    addDbgInfo(`${i18next.t('menu.section.debugging.setting.debuginfo.option.onlinestatus')}: ${navigator.onLine ? 'Online' : 'Offline'}`); // Online status

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
}