export function isWithinAny(target: HTMLElement, elements: HTMLElement[]): boolean {
    return elements.some((el) => el && el.contains(target));
}

export function isWithinTooltip(target: HTMLElement): boolean {
    return target.closest('.tooltip') !== null;
}

export function isWithinOverlay(target: HTMLElement): boolean {
    return (
        target.closest('[data-overlay="bs-modal-overlay"]') !== null ||
        target.closest('[data-overlay="scanner-overlay"]') !== null ||
        target.closest('[data-overlay="export-modal-overlay"]') !== null
    );
}

export function isOffcanvasBackdrop(target: HTMLElement): boolean {
    return target.closest('.offcanvas-backdrop') !== null;
}

export function isAnyOverlayVisible(): boolean {
    return (
        document.querySelector('[data-overlay="bs-modal-overlay"]') !== null ||
        document.querySelector('[data-overlay="scanner-overlay"]') !== null ||
        document.querySelector('[data-overlay="export-modal-overlay"]') !== null
    );
}

export function isOffcanvasOpen(): boolean {
    return document.querySelector('.offcanvas.show, .offcanvas.showing') !== null;
}

export function isTextInputFocused(): boolean {
    const activeElement = document.activeElement;
    return activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement;
}

export function isPanelVisible(container: HTMLElement): boolean {
    return !container.classList.contains('d-none');
}

export function shouldCloseOnClick(
    target: HTMLElement,
    panelContainer: HTMLElement,
    relatedElements: HTMLElement[],
    options?: { includeInputFocusBlock?: boolean }
): boolean {
    const panelVisible = isPanelVisible(panelContainer);
    const blockedByInput = options?.includeInputFocusBlock ? isTextInputFocused() : false;

    return (
        panelVisible &&
        !isWithinAny(target, relatedElements) &&
        !isWithinTooltip(target) &&
        !isWithinOverlay(target) &&
        !isOffcanvasBackdrop(target) &&
        !blockedByInput
    );
}

export function shouldCloseOnEscape(
    panelContainer: HTMLElement,
    options?: { includeInputFocusBlock?: boolean }
): boolean {
    const panelVisible = isPanelVisible(panelContainer);
    const overlaysVisible = isAnyOverlayVisible();
    const offcanvasVisible = isOffcanvasOpen();
    const blockedByInput = options?.includeInputFocusBlock ? isTextInputFocused() : false;

    return panelVisible && !overlaysVisible && !offcanvasVisible && !blockedByInput;
}
