import Toastify from 'toastify-js';
import { menu } from '../global';
import { debugMode } from './debug';
import * as luxon from 'ts-luxon';

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
export function showToast(message: string, duration: 'default' | 'normal' | 'long' | 'verylong' = 'default', style: string = 'auto'): void {
    const theme = getThemeInfo(style);
    
    const durationMap = {
        'default': 3000,
        'normal': 5000,
        'long': 10000,
        'verylong': 30000
    };

    const durationMs = durationMap[duration];
    
    Toastify({
        text: message,
        escapeMarkup: false,
        duration: durationMs,
        close: durationMs > 5000 ? true : false,
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

// Function to create an overlay card element
export function makeCardOverlay(title: string, content: HTMLElement | string): void {
    // Create container
    const container = document.createElement('div');
    container.dataset.overlay = 'card-overlay';
    container.dataset.bsTheme = menu.container.dataset.bsTheme;
    Object.assign(container.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '10'
    });

    // Create card
    const card = document.createElement('div');
    Object.assign(card.style, {
        width: 'fit-content',
        maxWidth: '95vw',
        maxHeight: '90vh',
        overflow: 'auto'
    });
    card.className = 'card';

    // Create card body
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    // Create title
    const titleElement = document.createElement('h5');
    titleElement.className = 'card-title text-center';
    titleElement.textContent = title;

    // Create horizontal rule
    const hr = document.createElement('hr');

    // Create content container
    const contentContainer = document.createElement('div');
    if (typeof content === 'string') {
        contentContainer.textContent = content;
    } else {
        contentContainer.appendChild(content);
    }

    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'mt-3 d-flex gap-2 justify-content-center';

    // Create close button
    const closeButton = document.createElement('button');
    closeButton.className = 'btn btn-secondary';
    closeButton.textContent = 'Close';

    // Create escape key handler
    function escapeHandler(e: KeyboardEvent) {
        if (e.key === 'Escape') {
            document.body.removeChild(container);
            document.removeEventListener('keydown', escapeHandler);
            logConsole(`Overlay card container with settings (${title}, ${content}) removed`, 'info');
        }
    }

    closeButton.onclick = () => {
        document.body.removeChild(container);
        document.removeEventListener('keydown', escapeHandler);
        logConsole(`Overlay card container with settings (${title}, ${content}) removed`, 'info');
    };

    // Create download button if content is downloadable media
    if (content instanceof HTMLCanvasElement || content instanceof HTMLImageElement || content instanceof HTMLVideoElement) {
        const downloadButton = document.createElement('button');
        downloadButton.className = 'btn btn-primary';
        downloadButton.textContent = 'Download';
        downloadButton.onclick = () => {
            const dlTime = luxon.DateTime.now().toFormat('X');
            const link = document.createElement('a');
            // Set filename based on content type
            const extension = content instanceof HTMLVideoElement ? '.mp4' : '.png';
            link.download = `${title}_${dlTime}${extension}`;
            
            // Get appropriate data URL based on content type
            link.href = content instanceof HTMLCanvasElement ? 
                content.toDataURL('image/png') : 
                content.src;
                
            link.click();
        };
        buttonContainer.appendChild(downloadButton);
    }

    // Append buttons
    buttonContainer.appendChild(closeButton);

    // Append elements
    cardBody.appendChild(titleElement);
    cardBody.appendChild(hr);
    cardBody.appendChild(contentContainer);
    cardBody.appendChild(buttonContainer);
    card.appendChild(cardBody);
    container.appendChild(card);

    // Add to document
    document.body.appendChild(container);
    document.addEventListener('keydown', escapeHandler);

    logConsole(`Overlay card container created with settings: (${title}, ${content})`, 'info');
}