import * as luxon from 'ts-luxon';
import { logConsole } from './utils/dom-utils';
import { dtdisplay, menu } from './utils/dom-elements';
import { FloatingWindow } from './system/FloatingWindow';
import { match } from 'ts-pattern';
import i18next from 'i18next';
import { cMode } from './time';

// Floating timezone windows
interface TimezoneWindowData {
    window: FloatingWindow;
    timezone: string;
    timezoneDisplayName: string;
    elements: {
        hourSlot: HTMLElement;
        minuteSlot: HTMLElement;
        secondSlot: HTMLElement;
        indicatorSlot: HTMLElement;
        colon1: HTMLElement;
        colon2: HTMLElement;
        date: HTMLElement;
    };
    settings: {
        clockMode: string;
        dateFormat: string;
        fontFamily: string;
        fontStyle: string;
        fontWeight: string;
    };
    lastTime: string[];
    lastDate: string;
}

const timezoneWindows = new Map<string, TimezoneWindowData>();

// Timezone window functions
function formatTimezoneName(timezone: string): string {
    // Convert timezone identifier to display name
    // e.g., "America/New_York" -> "New York"
    const parts = timezone.split('/');
    if (parts.length > 1) {
        return parts[parts.length - 1].replace(/_/g, ' ');
    }
    return timezone.replace(/_/g, ' ');
}

function applyFontStyles(elements: TimezoneWindowData['elements'], settings: TimezoneWindowData['settings']): void {
    // Map font style values to CSS values
    const cssStyle = match(settings.fontStyle)
        .with('fstI', () => 'italic')
        .with('fstR', () => 'normal')
        .otherwise(() => 'normal');

    // Map font weight values to CSS values
    const cssWeight = match(settings.fontWeight)
        .with('fweL', () => 'lighter')
        .with('fweN', () => 'normal')
        .with('fweB', () => 'bold')
        .otherwise(() => 'normal');

    // Apply font styles to all time elements
    const timeElements = [
        elements.hourSlot,
        elements.minuteSlot,
        elements.secondSlot,
        elements.indicatorSlot,
        elements.colon1,
        elements.colon2
    ];

    timeElements.forEach(element => {
        if (element) {
            element.style.fontFamily = settings.fontFamily;
            element.style.fontStyle = cssStyle;
            element.style.fontWeight = cssWeight;
        }
    });

    // Apply to date element as well
    if (elements.date) {
        elements.date.style.fontFamily = settings.fontFamily;
        elements.date.style.fontStyle = cssStyle;
        elements.date.style.fontWeight = cssWeight === 'bold' ? 'normal' : cssWeight;
    }
}

export function updateTimezoneButton(): void {
    const maxWindows = 2;
    const currentCount = timezoneWindows.size;
    const canCreate = currentCount < maxWindows;
    
    const buttonText = i18next.t('menu.section.datetime.setting.timezonewindows.openbutton', { 0: currentCount, 1: maxWindows });
    menu.timezonewindowbtn.textContent = buttonText;
    menu.timezonewindowbtn.disabled = !canCreate;
}

// Interface for manual timezone window settings
interface TimezoneWindowSettings {
    timezone?: string;
    clockMode?: string;
    dateFormat?: string;
    fontFamily?: string;
    fontStyle?: string;
    fontWeight?: string;
    // Positioning
    x?: number;
    y?: number;
    width?: string;
    height?: string;
}

function getDefaultSettings(): Pick<TimezoneWindowData['settings'], 'clockMode' | 'dateFormat' | 'fontFamily' | 'fontStyle' | 'fontWeight'> {
    return {
        clockMode: cMode,
        dateFormat: menu.dateformselect.value,
        fontFamily: dtdisplay.ccontainer.style.fontFamily,
        fontStyle: dtdisplay.ccontainer.style.fontStyle,
        fontWeight: dtdisplay.ccontainer.style.fontWeight
    };
}

export function createTimezoneWindow(
    settingsOrCallback?: TimezoneWindowSettings | ((windowId: string) => void),
    onWindowCreated?: (windowId: string) => void
): void {
    // Handle overloaded parameters
    let manualSettings: TimezoneWindowSettings | undefined;
    let callback: ((windowId: string) => void) | undefined;
    
    if (typeof settingsOrCallback === 'function') {
        callback = settingsOrCallback;
    } else {
        manualSettings = settingsOrCallback;
        callback = onWindowCreated;
    }

    // Check if we can create more windows using our local map
    const maxWindows = 2;
    if (timezoneWindows.size >= maxWindows) {
        logConsole('Cannot create more timezone windows - maximum reached', 'warning');
        return;
    }

    // Determine timezone - use manual setting or fallback to main clock
    const currentTimezone = manualSettings?.timezone || menu.timezoneselect.value || luxon.DateTime.local().zoneName || 'UTC';
    const timezoneDisplayName = formatTimezoneName(currentTimezone);
    
    // Create clock display elements (no timezone selector)
    const clockContainer = document.createElement('div');
    clockContainer.className = 'text-center';
    clockContainer.innerHTML = `
        <div class="d-flex justify-content-center align-items-center mb-2" style="font-size: 2.5rem; font-weight: bold;">
            <span class="hour-slot">12</span>
            <span class="colon1">:</span>
            <span class="minute-slot">00</span>
            <span class="colon2">:</span>
            <span class="second-slot">00</span>
            <span class="indicator ms-2">AM</span>
        </div>
        <p class="date mt-2 mb-0" style="font-size: 1.1rem;"></p>
    `;

    // Create floating window with timezone name as title
    const windowConfig: any = {
        title: timezoneDisplayName,
        content: clockContainer,
        width: manualSettings?.width || '350px',
        height: manualSettings?.height || '200px',
        groupName: 'timezoneClocks',
        maxWindows: 2,
        resizable: true,
        closeAction: 'destroy'
    };

    // Add positioning if provided in manual settings
    if (manualSettings?.x !== undefined || manualSettings?.y !== undefined) {
        windowConfig.position = {
            x: manualSettings.x,
            y: manualSettings.y
        };
    }

    const floatingWindow = new FloatingWindow(windowConfig);

    if (!floatingWindow.isValidWindow()) {
        logConsole('Cannot create timezone window - maximum reached', 'warning');
        updateTimezoneButton();
        return;
    }

    // Get references to the clock elements
    const elements = {
        hourSlot: clockContainer.querySelector('.hour-slot') as HTMLElement,
        minuteSlot: clockContainer.querySelector('.minute-slot') as HTMLElement,
        secondSlot: clockContainer.querySelector('.second-slot') as HTMLElement,
        indicatorSlot: clockContainer.querySelector('.indicator') as HTMLElement,
        colon1: clockContainer.querySelector('.colon1') as HTMLElement,
        colon2: clockContainer.querySelector('.colon2') as HTMLElement,
        date: clockContainer.querySelector('.date') as HTMLElement
    };

    // Store window data with manual settings or defaults from main clock
    const defaultSettings = getDefaultSettings();
    const windowId = floatingWindow.getId();
    const windowData: TimezoneWindowData = {
        window: floatingWindow,
        timezone: currentTimezone,
        timezoneDisplayName,
        elements,
        settings: {
            clockMode: manualSettings?.clockMode ?? defaultSettings.clockMode,
            dateFormat: manualSettings?.dateFormat ?? defaultSettings.dateFormat,
            fontFamily: manualSettings?.fontFamily ?? defaultSettings.fontFamily,
            fontStyle: manualSettings?.fontStyle ?? defaultSettings.fontStyle,
            fontWeight: manualSettings?.fontWeight ?? defaultSettings.fontWeight
        },
        lastTime: ['', '', '', ''],
        lastDate: ''
    };

    // Apply initial font styles
    applyFontStyles(elements, windowData.settings);

    timezoneWindows.set(windowId, windowData);

    // Set up window close events to update button state
    const windowElement = floatingWindow.getElement();
    if (windowElement) {
        const handleWindowClose = (eventType: string) => {
            logConsole(`Timezone window close event received (${eventType}) for window ${windowId}`, 'debug');
            // Only process if we actually have this window in our map
            if (timezoneWindows.has(windowId)) {
                timezoneWindows.delete(windowId);
                updateTimezoneButton();
                logConsole(`Timezone window ${timezoneDisplayName} closed and removed (${eventType})`, 'info');
            }
        };
        
        // Listen for all possible close events
        windowElement.addEventListener('forceClose', () => handleWindowClose('force'));
        windowElement.addEventListener('windowDestroyed', () => handleWindowClose('destroy'));
        windowElement.addEventListener('windowHidden', () => handleWindowClose('hide'));
    }

    floatingWindow.show();
    updateTimezoneButton(); // Update button state
    logConsole(`Timezone window created for ${timezoneDisplayName} (${currentTimezone})`, 'info');
    
    // Notify caller if callback provided
    if (callback) {
        callback(windowId);
    }
}

export function updateTimezoneWindow(windowId: string): void {
    const windowData = timezoneWindows.get(windowId);
    if (!windowData) return;

    try {
        const time = luxon.DateTime.now().setZone(windowData.timezone);
        const { clockMode, dateFormat: currentDateFormat } = windowData.settings;
        
        // Simple time display - just show regular time with AM/PM based on window's clock mode
        const hrs = clockMode === '0' ? time.toFormat('h') : time.toFormat('HH');
        const min = time.toFormat('mm');
        const sec = time.toFormat('ss');
        const ind = clockMode === '0' ? time.toFormat('a') : '';

        // Update display if changed
        const newTime = [hrs, min, sec, ind];
        if (JSON.stringify(newTime) !== JSON.stringify(windowData.lastTime)) {
            windowData.elements.hourSlot.textContent = hrs;
            windowData.elements.minuteSlot.textContent = min;
            windowData.elements.secondSlot.textContent = sec;
            windowData.elements.indicatorSlot.textContent = ind;
            windowData.lastTime = newTime;
        }

        // Update date using window's date format
        const newDate = time.toFormat(currentDateFormat);
        if (newDate !== windowData.lastDate) {
            windowData.elements.date.textContent = newDate;
            windowData.lastDate = newDate;
        }

    } catch (error) {
        logConsole(`Error updating timezone window ${windowData.timezoneDisplayName}: ${error}`, 'error');
    }
}

export function updateAllTimezoneWindows(): void {
    timezoneWindows.forEach((_, windowId) => {
        updateTimezoneWindow(windowId);
    });
}

// Export timezone windows configuration for JSON settings
export interface TimezoneWindowExport {
    timezone: string;
    clockMode: string;
    dateFormat: string;
    fontFamily: string;
    fontStyle: string;
    fontWeight: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

export function getTimezoneWindowsConfig(): { tz1?: TimezoneWindowExport; tz2?: TimezoneWindowExport } | null {
    const windows = Array.from(timezoneWindows.entries());
    
    if (windows.length === 0) {
        return null;
    }

    const config: { tz1?: TimezoneWindowExport; tz2?: TimezoneWindowExport } = {};

    windows.forEach(([_, data], index) => {
        const windowElement = data.window.getElement();
        const windowKey = index === 0 ? 'tz1' : 'tz2';
        
        config[windowKey] = {
            timezone: data.timezone,
            clockMode: data.settings.clockMode,
            dateFormat: data.settings.dateFormat,
            fontFamily: data.settings.fontFamily,
            fontStyle: data.settings.fontStyle,
            fontWeight: data.settings.fontWeight,
            x: windowElement ? parseInt(windowElement.style.left) || 0 : 0,
            y: windowElement ? parseInt(windowElement.style.top) || 0 : 0,
            width: windowElement ? parseInt(windowElement.style.width) || 350 : 350,
            height: windowElement ? parseInt(windowElement.style.height) || 200 : 200
        };
    });

    return config;
}

// Import timezone windows from JSON config
export function setTimezoneWindowsConfig(config: { tz1?: TimezoneWindowExport; tz2?: TimezoneWindowExport }): void {
    // Close any existing windows first
    closeAllTimezoneWindows();

    // Create tz1 if exists
    if (config.tz1) {
        const tz1Settings: TimezoneWindowSettings = {
            timezone: config.tz1.timezone,
            clockMode: config.tz1.clockMode,
            dateFormat: config.tz1.dateFormat,
            fontFamily: config.tz1.fontFamily,
            fontStyle: config.tz1.fontStyle,
            fontWeight: config.tz1.fontWeight,
            x: config.tz1.x,
            y: config.tz1.y,
            width: `${config.tz1.width}px`,
            height: `${config.tz1.height}px`
        };

        createTimezoneWindow(tz1Settings, (windowId) => {
            updateTimezoneWindow(windowId);
        });
    }

    // Create tz2 if exists
    if (config.tz2) {
        const tz2Settings: TimezoneWindowSettings = {
            timezone: config.tz2.timezone,
            clockMode: config.tz2.clockMode,
            dateFormat: config.tz2.dateFormat,
            fontFamily: config.tz2.fontFamily,
            fontStyle: config.tz2.fontStyle,
            fontWeight: config.tz2.fontWeight,
            x: config.tz2.x,
            y: config.tz2.y,
            width: `${config.tz2.width}px`,
            height: `${config.tz2.height}px`
        };

        createTimezoneWindow(tz2Settings, (windowId) => {
            updateTimezoneWindow(windowId);
        });
    }
}

// Close all timezone windows
export function closeAllTimezoneWindows(): void {
    timezoneWindows.forEach((data, windowId) => {
        data.window.destroy();
        timezoneWindows.delete(windowId);
    });
    updateTimezoneButton();
}

// Initialize timezone window functionality
export function initializeTimezoneWindows(): void {
    // Timezone window button listener
    menu.timezonewindowbtn.addEventListener('click', () => {
        createTimezoneWindow((windowId) => {
            // Perform initial update with window's own settings
            updateTimezoneWindow(windowId);
        });
    });

    // Initialize button state
    updateTimezoneButton();
}
