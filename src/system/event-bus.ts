// List of App Events
export const AppEvents = {
    URL_PARAMS_LOADED: 'urlParamsLoaded',
    DEBUG_MODE_ENABLED: 'debugModeEnabled',
    SETTINGS_LOCKED: 'settingsLocked',
    API_WIDGET_REMOVED: 'apiWidgetRemoved',
    TOAST_POSITION_CHANGED: 'toastPositionChanged',
    I18N_FINISHED_UPDATE: 'i18nFinishedUpdate',
    DOM_LOADED: 'domLoaded',
    STOP_CLOCK: 'stopClock',
    START_CLOCK: 'startClock',
    CLOCK_UPDATED: 'clockUpdated'
} as const;

// Type-safe event data interface
interface EventDataMap {
    [AppEvents.URL_PARAMS_LOADED]: { timestamp: number };
    [AppEvents.DEBUG_MODE_ENABLED]: { state: boolean };
    [AppEvents.SETTINGS_LOCKED]: { state: boolean };
    [AppEvents.API_WIDGET_REMOVED]: { widgetId: string };
    [AppEvents.TOAST_POSITION_CHANGED]: { position: 'topleft' | 'topmiddle' | 'bottomleft' | 'bottommiddle' | 'bottomright' };
    [AppEvents.I18N_FINISHED_UPDATE]: { language: string };
    [AppEvents.DOM_LOADED]: { timestamp: number };
    [AppEvents.STOP_CLOCK]: { sourcereason: string };
    [AppEvents.START_CLOCK]: { sourcereason: string };
    [AppEvents.CLOCK_UPDATED]: { time: any };
}

// Dispatch event function
export function emit<T extends keyof EventDataMap>(
    eventType: T, 
    data?: EventDataMap[T]
): void {
    window.dispatchEvent(new CustomEvent(eventType, { detail: data }));
}

// Listener function
export function on<T extends keyof EventDataMap>(
    eventType: T, 
    handler: (data?: EventDataMap[T]) => void
): void {
    window.addEventListener(eventType, (event: Event) => {
        const customEvent = event as CustomEvent<EventDataMap[T]>;
        handler(customEvent.detail);
    });
}

// One-time listener
export function once<T extends keyof EventDataMap>(
    eventType: T, 
    handler: (data?: EventDataMap[T]) => void
): void {
    const wrappedHandler = (event: Event) => {
        const customEvent = event as CustomEvent<EventDataMap[T]>;
        handler(customEvent.detail);
        window.removeEventListener(eventType, wrappedHandler);
    };
    window.addEventListener(eventType, wrappedHandler);
}

// Remove listener
export function off(eventType: string, handler: EventListener): void {
    window.removeEventListener(eventType, handler);
}

// DOM has now loaded :)
document.addEventListener('DOMContentLoaded', () => {
    emit(AppEvents.DOM_LOADED, { timestamp: Date.now() });
});
