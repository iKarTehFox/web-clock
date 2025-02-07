import Toastify from 'toastify-js';
import { doc, menu } from './dom-elements';
import { debugMode } from './debug';
import { Html5Qrcode } from 'html5-qrcode';
import { processJSONSettings } from '../importExport';
import { match } from 'ts-pattern';
import * as bs from 'bootstrap';
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
export function logConsole(message: string, type: 'debug' | 'error' | 'warning' | 'info' | 'bypass' = 'debug'):void {
    if (debugMode && type === 'debug') {
        console.log(`DEBUG - ${message}`);
    } else if (type === 'error') {
        console.error(`ERROR - ${message}`);
    } else if (type === 'warning') {
        console.warn(`WARNING - ${message}`);
    } else if ((debugMode && type === 'info') || type === 'bypass') { // Allow bypass without debug mode
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

interface ModalButton {
    label: string;
    className?: string;
    value?: any;
}

export function createBsModal(title: string, content: HTMLElement | string, buttons: ModalButton[] = []) {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.setAttribute('tabindex', '-1');
        modal.dataset.overlay = 'bs-modal-overlay';
        modal.style.wordBreak = 'break-word';
        modal.style.overflowWrap = 'anywhere';

        modal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header justify-content-center">
                        <h5 class="modal-title">${title}</h5>
                    </div>
                    <div class="modal-body">
                        ${content instanceof HTMLElement ? '' : `<p>${content}</p>`}
                    </div>
                    <div class="modal-footer">
                    </div>
                </div>
            </div>
        `;

        // Theme
        modal.dataset.bsTheme = menu.container.dataset.bsTheme;

        if (content instanceof HTMLElement) {
            content.style.maxWidth = '100%';
            content.style.height = 'auto';
            content.style.objectFit = 'contain';
            
            // For images specifically
            if (content instanceof HTMLImageElement) {
                content.style.width = '100%';
                content.className = 'img-fluid'; // Bootstrap's responsive image class
            }
            
            const modalBody = modal.querySelector('.modal-body') as HTMLElement;
            if (modalBody) {
                modalBody.className = 'modal-body d-flex justify-content-center align-items-center';
                modalBody.style.overflow = 'auto';
                modalBody.style.maxHeight = '80vh';
                modalBody.appendChild(content);
            }
        } else {
            modal.querySelector('.modal-body')!.innerHTML = `<p>${content}</p>`;
        }

        // Define buttons automatically
        if (buttons.length === 0) {
            if (content instanceof HTMLImageElement || 
                content instanceof HTMLCanvasElement || 
                content instanceof HTMLVideoElement) {
                buttons = [
                    { label: 'Download', className: 'btn btn-primary', value: 'download' },
                    { label: 'Close', className: 'btn btn-secondary', value: 'close' }
                ];
            } else if (typeof content === 'string') {
                buttons = [
                    { label: 'Copy', className: 'btn btn-primary', value: 'copy' },
                    { label: 'Close', className: 'btn btn-secondary', value: 'close' }
                ];
            } else {
                buttons = [
                    { label: 'Close', className: 'btn btn-secondary', value: 'close' }
                ];
            }
        }

        const footer = modal.querySelector('.modal-footer')!;
        const bootstrapModal = new bs.Modal(modal);

        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.className = btn.className || 'btn btn-secondary';
            button.textContent = btn.label;
            button.onclick = () => {
                if (btn.value === 'download') {
                    const dlTime = luxon.DateTime.now().toFormat('X');
                    const link = document.createElement('a');
                    // Set filename based on content type
                    const extension = content instanceof HTMLVideoElement ? '.mp4' : '.png';
                    link.download = `${title}_${dlTime}${extension}`;
                    
                    // Get appropriate data URL based on content type
                    link.href = content instanceof HTMLCanvasElement ? 
                        content.toDataURL('image/png') : 
                        (content as HTMLImageElement | HTMLVideoElement).src;
                        
                    link.click();
                } else if (btn.value === 'copy') {
                    navigator.clipboard.writeText(content as string);
                    showToast('Text copied to clipboard!', 'default', 'success');
                }
                bootstrapModal.hide();
                resolve(btn.value);
            };
            footer.appendChild(button);
        });

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
            resolve('Dismissed.');
        });

        document.body.appendChild(modal);
        bootstrapModal.show();
        bootstrapModal.handleUpdate();
    });
}

// Set browser theme color
export function setMetaColor(type: 'color' | 'theme', value: string): void {
    match(type)
        .with('color', () => {
            doc.themecolormeta.setAttribute('content', value);
            logConsole(`Meta color set to: ${value}`, 'debug');
        })
        .with('theme', () => {
            doc.themecolormeta.setAttribute('media', `(prefers-color-scheme: ${value})`);
            logConsole(`Meta theme set to: ${value}`, 'debug');
        });
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
        showToast('Notifications are not supported in this browser.', 'long', 'danger');
        return Promise.reject('Notifications not supported');
    }

    const permission = await Notification.requestPermission();
    logConsole(`Notification permission: ${permission}`, 'debug');
    return permission;
}

// Function to create an scanner overlay card element
export function createScannerOverlay() {
    // Create container
    const container = document.createElement('div');
    container.dataset.overlay = 'scanner-overlay';
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
        zIndex: '10',
        overflow: 'hidden'
    });

    // Create card
    const card = document.createElement('div');
    Object.assign(card.style, {
        width: 'clamp(300px, 80%, 600px)',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
    });
    card.className = 'card';

    // Create card body with padding
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body d-flex flex-column align-items-center gap-3';

    // Create QR reader container
    const qrVideo = document.createElement('div');
    qrVideo.id = 'qr-reader';
    qrVideo.style.width = '100%';

    // Add elements to DOM
    cardBody.appendChild(qrVideo);
    card.appendChild(cardBody);
    container.appendChild(card);
    document.body.appendChild(container);

    // Initialize QR scanner
    const html5QrCode = new Html5Qrcode('qr-reader');
    
    const qrCodeSuccessCallback = (decodedText: string) => {
        html5QrCode.stop();
        container.remove();
        processJSONSettings(decodedText);
    };

    html5QrCode.start(
        { facingMode: 'environment' },
        {
            fps: 5,
            qrbox: { width: 250, height: 250 }
        },
        qrCodeSuccessCallback,
        () => {
            /*        Ignore errors         */
            /* Very mindful, very demure... */
        }
    ).then(() => {
        const closeButton = document.createElement('button');
        closeButton.className = 'btn btn-secondary';
        closeButton.textContent = 'Close';
        closeButton.onclick = () => {
            html5QrCode.stop();
            container.remove();
        };
        cardBody.appendChild(closeButton);
    });
}
