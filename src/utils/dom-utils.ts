import Toastify from 'toastify-js';
import { menu } from '../global';
import { debugMode } from './debug';

// Element finding functions
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

// Custom console logging function
export function logConsole(message: string, type: string = 'debug'):void {
    if (debugMode && type === 'debug') {
        console.log(`DEBUG - ${message}`);
    } else if (type === 'error') {
        console.error(`ERROR - ${message}`);
    } else if (type === 'warning') {
        console.warn(`WARNING - ${message}`);
    } else if (debugMode && type === 'info') {
        console.info(`INFO - ${message}`);
    }
}

// Function to set toast theme
function getThemeInfo(colorTheme: string = 'auto') {
    const theme = colorTheme === 'auto' ? menu.container.dataset.bsTheme : colorTheme;

    const themes = {
        dark: {
            bgColor: '#313539',
            textColor: '#FFFFFF',
            outline: 'rgba(49, 43, 57, 0.5) solid 2px'
        },
        light: {
            bgColor: '#FFFFFF',
            textColor: '#212529',
            outline: 'rgba(255, 255, 255, 0.5) solid 2px'
        },
        danger: {
            bgColor: '#DC3545',
            textColor: '#FFFFFF',
            outline: 'rgba(220, 53, 69, 0.5) solid 2px'
        },
        success: {
            bgColor: '#198754',
            textColor: '#FFFFFF',
            outline: 'rgba(25, 135, 84, 0.5) solid 2px'
        },
        warning: {
            bgColor: '#FFC107',
            textColor: '#212529',
            outline: 'rgba(255, 193, 7, 0.5) solid 2px'
        }
    };

    return themes[theme] || themes.light;
}

// Function to show a toast message
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

// At most one true value function
export function AMOne(...values: boolean[]) {
    const trueCount = values.filter(value => value === true).length;
    return trueCount === 1 || trueCount === 0;
}

// Function to create an overlay card element
export function makeCardOverlay(title: string, content: HTMLElement): void {
    // Create container
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    container.style.zIndex = '1050';

    // Create card
    const card = document.createElement('div');
    card.className = 'card';
    card.style.width = '90%';
    card.style.maxWidth = '600px';
    card.style.maxHeight = '90vh';
    card.style.overflow = 'auto';

    // Create card body
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    // Create title
    const titleElement = document.createElement('h5');
    titleElement.className = 'card-title';
    titleElement.textContent = title;

    // Create horizontal rule
    const hr = document.createElement('hr');

    // Create content container
    const contentContainer = document.createElement('div');
    contentContainer.appendChild(content);

    // Create close button
    const closeButton = document.createElement('button');
    closeButton.className = 'btn btn-secondary mt-3';
    closeButton.textContent = 'Close';
    closeButton.onclick = () => {
        document.body.removeChild(container);
    };

    // Append elements
    cardBody.appendChild(titleElement);
    cardBody.appendChild(hr);
    cardBody.appendChild(contentContainer);
    cardBody.appendChild(closeButton);
    card.appendChild(cardBody);
    container.appendChild(card);

    // Add to document
    document.body.appendChild(container);
}
