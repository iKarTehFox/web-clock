// Define all your app events in one place for type safety
export const AppEvents = {
    URL_PARAMS_LOADED: 'urlParamsLoaded',
    DEBUG_MODE_ENABLED: 'debugModeEnabled',
    SETTINGS_LOCKED: 'settingsLocked',
    API_WIDGET_REMOVED: 'apiWidgetRemoved',
} as const;

// Type-safe event data interface
interface EventDataMap {
    [AppEvents.URL_PARAMS_LOADED]: { timestamp: number };
    [AppEvents.DEBUG_MODE_ENABLED]: { state: boolean };
    [AppEvents.SETTINGS_LOCKED]: { state: boolean };
    [AppEvents.API_WIDGET_REMOVED]: { widgetId: string };
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
