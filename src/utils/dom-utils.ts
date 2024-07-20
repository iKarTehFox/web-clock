import Toastify from 'toastify-js';
import { menu } from '../global';

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

export function logDebug(debugMessage:string):void {
    if (menu.debugcheckbox.checked) {
        console.log(`DEBUG - ${debugMessage}`);
    }
}

function getCurrentTheme(): string {
    return menu.container.dataset.bsTheme;
}

export function showToast(message: string, duration: number = 3000): void {
    const theme = getCurrentTheme();
    const backgroundColor = theme == 'dark' ? '#313539' : '#ffffff';
    
    Toastify({
        text: message,
        escapeMarkup: false,
        duration: duration,
        close: duration > 3000 ? true : false,
        style: {
            background: backgroundColor,
            color: theme == 'dark' ? '#fff' : '#212529',
        },
        gravity: 'bottom',
        position: 'right',
        stopOnFocus: true
    }).showToast();
}
