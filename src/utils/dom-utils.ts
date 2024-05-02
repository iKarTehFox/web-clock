// src/utils/dom-utils.ts
export function getElement<T extends HTMLElement>(id: string): T {
    const element = document.getElementById(id);
    if (!element) throw new Error(`Element with ID ${id} not found`);
    return element as T;
}

export function getElements<T extends Element>(selector: string): NodeListOf<T> {
    const elements = document.querySelectorAll(selector);
    return elements as NodeListOf<T>;
}

export function getFirstElement<T extends Element>(selector: string): T {
    const element = document.querySelector(selector);
    return element as T;
}
