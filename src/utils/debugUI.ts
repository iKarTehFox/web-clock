import i18next from 'i18next';
import randomstring from 'randomstring';
import { debug, dtdisplay, panel } from './dom-elements';
import { showToast } from './dom-utils';
import { on, AppEvents } from '../system/event-bus';
import { getElement } from './dom-selectors';
import { FloatingWindow } from '../system/FloatingWindow';

// Constants
const loadTime = new Date().toLocaleString();
const refreshPeriod = 60000; // 60 seconds

// Debug info entries with unique IDs
const debugEntries = {
    userAgent: randomstring.generate(8),
    locale: randomstring.generate(8),
    timezone: randomstring.generate(8),
    loadTime: randomstring.generate(8),
    resolution: randomstring.generate(8),
    colorDepth: randomstring.generate(8),
    onlineStatus: randomstring.generate(8)
};

// Debug info configuration
interface DebugInfoConfig {
    translationKey: string;
    getValue: () => string;
    isStatic?: boolean; // For values that don't change (like loadTime)
}

const debugInfoConfig: Record<keyof typeof debugEntries, DebugInfoConfig> = {
    userAgent: {
        translationKey: 'menu.section.debugging.setting.debuginfo.option.useragent',
        getValue: () => navigator.userAgent
    },
    locale: {
        translationKey: 'menu.section.debugging.setting.debuginfo.option.locale',
        getValue: () => navigator.language
    },
    timezone: {
        translationKey: 'menu.section.debugging.setting.debuginfo.option.timezone',
        getValue: () => Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    loadTime: {
        translationKey: 'menu.section.debugging.setting.debuginfo.option.loadtime',
        getValue: () => loadTime,
        isStatic: true
    },
    resolution: {
        translationKey: 'menu.section.debugging.setting.debuginfo.option.resolution',
        getValue: () => `${window.screen.width}x${window.screen.height}`,
        isStatic: true
    },
    colorDepth: {
        translationKey: 'menu.section.debugging.setting.debuginfo.option.colordepth',
        getValue: () => `${window.screen.colorDepth}-bit`,
        isStatic: true
    },
    onlineStatus: {
        translationKey: 'menu.section.debugging.setting.debuginfo.option.onlinestatus',
        getValue: () => navigator.onLine ? 'Online' : 'Offline'
    }
};

function createDebugEntry(key: keyof typeof debugEntries): HTMLParagraphElement {
    const p = document.createElement('p');
    p.className = 'mb-1';
    p.id = debugEntries[key];
    
    const config = debugInfoConfig[key];
    const label = i18next.t(config.translationKey);
    const value = config.getValue();
    p.textContent = `${label}: ${value}`;
    
    return p;
}

function updateDebugEntryValue(key: keyof typeof debugEntries): void {
    const element = getElement<HTMLParagraphElement>(debugEntries[key]);
    if (!element) return;
    
    const config = debugInfoConfig[key];
    const label = i18next.t(config.translationKey);
    const value = config.getValue();
    element.textContent = `${label}: ${value}`;
}

function updateDebugEntryLabel(key: keyof typeof debugEntries): void {
    const element = getElement<HTMLParagraphElement>(debugEntries[key]);
    if (!element) return;
    
    const config = debugInfoConfig[key];
    const currentText = element.textContent || '';
    const colonIndex = currentText.indexOf(':');
    
    if (colonIndex !== -1) {
        const value = currentText.substring(colonIndex);
        const newLabel = i18next.t(config.translationKey);
        element.textContent = `${newLabel}${value}`;
    }
}

function initializeAllDebugEntries(): void {
    // Clear existing entries
    debug.info.innerHTML = '';
    
    // Create all debug entries
    Object.keys(debugEntries).forEach(key => {
        const entry = createDebugEntry(key as keyof typeof debugEntries);
        debug.info.appendChild(entry);
    });
}

function updateAllDebugValues(): void {
    Object.keys(debugEntries).forEach(key => {
        const config = debugInfoConfig[key as keyof typeof debugEntries];
        if (!config.isStatic) {
            updateDebugEntryValue(key as keyof typeof debugEntries);
        }
    });
}

function updateAllDebugLabels(): void {
    Object.keys(debugEntries).forEach(key => {
        updateDebugEntryLabel(key as keyof typeof debugEntries);
    });
}

function initializeDebugUI(): void {
    // Enable debug container
    debug.container.classList.remove('d-none');

    // Initialize all debug entries
    initializeAllDebugEntries();

    // Dev Console
    panel.devconbutton.classList.remove('d-none');

    // Event listeners
    debug.toastbtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.dbgtoasttheme;
            const length = btn.dataset.dbgtoastlength as 'veryshort' | 'default' | 'normal' | 'long' | 'verylong' | undefined;
            if (!theme) {
                showToast(i18next.t('toasts.debugui.title'), i18next.t('toasts.debugui.testtoast2', { 0: length }), length);
                return;
            }
            showToast(i18next.t('toasts.debugui.title'), i18next.t('toasts.debugui.testtoast', { 0: theme }), length, theme);
        });
    });

    debug.rmclockbtn.addEventListener('click', () => {
        dtdisplay.ccontainer.remove();
    });

    debug.clearlsbtn.addEventListener('click', () => {
        localStorage.clear();
        showToast(i18next.t('toasts.debugui.title'), i18next.t('toasts.debugui.clearls'), undefined, 'warning');
    });

    debug.clearlsbtn.addEventListener('dblclick', () => {
        window.location.reload(); // Quick reload option
    });

    debug.floatingwindowbtn.addEventListener('click', () => {
        const devFloatingWindow = new FloatingWindow({
            title: 'FloatingWindow Demo',
            groupName: 'dev',
            content: '<p>This is a FloatingWindow.</p>',
            tabs: [
                {
                    id: 'tab1',
                    label: 'Tab 1',
                    content: '<p>Content for Tab 1</p>'
                },
                {
                    id: 'tab2',
                    label: 'Tab 2',
                    content: '<p>Content for Tab 2</p>'
                }
            ],
            position: {x: 100, y: 100},
            maxWindows: 1,
            closeAction: 'destroy'
        });
        devFloatingWindow.show();
    });

    // i18n langauage change listener
    i18next.on('languageChanged', () => {
        updateAllDebugLabels();
    });

    // Periodically update non-static values
    setInterval(() => {
        updateAllDebugValues();
    }, refreshPeriod);

    // Listen for online/offline events for immediate updates
    window.addEventListener('online', () => updateDebugEntryValue('onlineStatus'));
    window.addEventListener('offline', () => updateDebugEntryValue('onlineStatus'));
}

on(AppEvents.DEBUG_MODE_ENABLED, (state) => {
    if (state) {
        initializeDebugUI();
    }
});
