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

function getThemeInfo(colorTheme: string = 'auto') {
    let theme;
    if (colorTheme === 'auto') {
        theme = menu.container.dataset.bsTheme;
    } else {
        theme = colorTheme;
    }

    if (theme == 'dark') {
        return {
            bgColor: '#313539',
            textColor: '#FFFFFF',
            outline: 'rgba(49, 43, 57, 0.5) solid 2px'
        };
    } else if (theme == 'light') {
        return {
            bgColor: '#FFFFFF',
            textColor: '#212529',
            outline: 'rgba(255, 255, 255, 0.5) solid 2px'
        };
    } else if (theme == 'danger') {
        return {
            bgColor: '#DC3545',
            textColor: '#FFFFFF',
            outline: 'rgba(220, 53, 69, 0.5) solid 2px'
        };
    } else {
        return {
            bgColor: '#FFFFFF',
            textColor: '#212529',
            outline: 'rgba(255, 255, 255, 0.5) solid 2px'
        };
    }
}

export function showToast(message: string, duration: number = 3000, style: string = 'auto'): void {
    const theme = getThemeInfo(style);
    
    Toastify({
        text: message,
        escapeMarkup: false,
        duration: duration,
        close: duration > 3000 ? true : false,
        style: {
            background: theme.bgColor,
            color: theme.textColor,
            outline: theme.outline
        },
        gravity: 'bottom',
        position: 'right',
        stopOnFocus: true
    }).showToast();
}
