import Toastify from 'toastify-js';
import { countdown, doc, menu, stopwatch, weather } from './dom-elements';
import { debugMode } from './debug';
import { Html5Qrcode } from 'html5-qrcode';
import { processJSONSettings } from '../importExport';
import { match } from 'ts-pattern';
import * as bs from 'bootstrap';
import * as luxon from 'ts-luxon';
import randomstring from 'randomstring';
import i18next, { t } from 'i18next';

// Custom console logging function
export function logConsole(message: string, type: 'debug' | 'error' | 'warning' | 'info' = 'debug', bypass: boolean = false): void {
    if ((debugMode || bypass) && type === 'debug') {
        console.log(`DEBUG - ${message}`);
    } else if (type === 'error') {
        console.error(`ERROR - ${message}`);
    } else if (type === 'warning') {
        console.warn(`WARNING - ${message}`);
    } else if ((debugMode || bypass) && type === 'info') {
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

// Menu theme function
export function setMenuTheme(theme: 'light' | 'dark' | 'auto' | 'toggle' , quiet: boolean = false): void {
    // Handle auto
    if (theme === 'auto') {
        theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // Handle toggle
    if (theme === 'toggle') {
        theme = menu.container.dataset.bsTheme === 'light' ? 'dark' : 'light';
    }

    // Menu container
    menu.container.dataset.bsTheme = theme;
    
    // Weather container
    weather.container.dataset.bsTheme = theme;
    weather.container.style.color = theme === 'light' ? '#212529' : '#fff';
    
    // Stopwatch container
    stopwatch.container.dataset.bsTheme = theme;
    stopwatch.container.style.backgroundColor = theme === 'light' ? '#ffffff' : '#313539';
    stopwatch.container.style.color = theme === 'light' ? '#212529' : '#fff';
    
    // Countdown container
    countdown.container.dataset.bsTheme = theme;
    countdown.container.style.backgroundColor = theme === 'light' ? '#ffffff' : '#313539';
    countdown.container.style.color = theme === 'light' ? '#212529' : '#fff';
    
    // Browser meta
    setMetaColor('theme', theme);
    
    logConsole(`Menu theme set to: ${theme}`, 'debug');
    if (!quiet) showToast(i18next.t(`toasts.global.theme${theme}`));
}

export function createBsModal(title: string, content: HTMLElement | string, buttons: ModalButton[] = [], timeoutDelay?: number) {
    return new Promise((resolve) => {
        // Set internal unique id
        const modalUID = `bs-modal-${randomstring.generate(8)}`;

        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.setAttribute('tabindex', '-1');
        modal.dataset.overlay = 'bs-modal-overlay';
        modal.style.wordBreak = 'break-word';
        modal.style.overflowWrap = 'anywhere';

        modal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered" id="${modalUID}">
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
                    { label: i18next.t('bsmodal.action.download'), className: 'btn btn-primary', value: 'download' },
                    { label: i18next.t('bsmodal.action.close'), className: 'btn btn-secondary', value: 'close' }
                ];
            } else if (typeof content === 'string') {
                buttons = [
                    { label: i18next.t('bsmodal.action.copy'), className: 'btn btn-primary', value: 'copy' },
                    { label: i18next.t('bsmodal.action.close'), className: 'btn btn-secondary', value: 'close' }
                ];
            } else {
                buttons = [
                    { label: i18next.t('bsmodal.action.close'), className: 'btn btn-secondary', value: 'close' }
                ];
            }
        }

        const footer = modal.querySelector('.modal-footer')!;
        const bootstrapModal = new bs.Modal(modal);
        
        // Timeout handling
        let bsModTimeout: number | undefined;
        
        // Basically, timeout can be disabled if 0, negative, or undefined
        if (timeoutDelay !== undefined && timeoutDelay > 0) {
            // Constrain between 5 and 60 seconds
            const constrainedDelay = Math.max(5, Math.min(60, timeoutDelay)) * 1000;
            
            const countdownEl = document.createElement('small');
            countdownEl.className = 'text-muted me-auto';
            countdownEl.textContent = i18next.t('bsmodal.action.countdownel', { 0: Math.round(constrainedDelay/1000) });
            countdownEl.style.cursor = 'pointer';
            modal.querySelector('.modal-footer')?.appendChild(countdownEl);
            
            const startTime = Date.now();
            const updateInterval = setInterval(() => {
                const remaining = Math.ceil((constrainedDelay - (Date.now() - startTime))/1000);
                if (remaining > 0) {
                    countdownEl.textContent = i18next.t('bsmodal.action.countdownel', { 0: remaining });
                } else {
                    clearInterval(updateInterval);
                }
            }, 1000);
            
            // Set the timeout to auto-close the modal
            bsModTimeout = window.setTimeout(() => {
                clearInterval(updateInterval);
                bootstrapModal.hide();
                resolve('timeout');
            }, constrainedDelay);

            // Click listener to cancel countdown
            countdownEl.addEventListener('click', () => {
                clearTimeout(bsModTimeout);
                clearTimeout(updateInterval);
                countdownEl.textContent = '';
                countdownEl.style.cursor = 'default';
                logConsole(`Modal ID ${modalUID} auto-close cancelled.`);
            });
        }

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
                    showToast(i18next.t('toasts.domutils.textcopied'), 'default', 'success');
                }
                
                // Clear the timeout if a button is clicked
                if (bsModTimeout) {
                    clearTimeout(bsModTimeout);
                }
                
                bootstrapModal.hide();
                resolve(btn.value);
            };
            footer.appendChild(button);
        });

        modal.addEventListener('hidden.bs.modal', () => {
            // Clear timeout
            if (bsModTimeout) {
                clearTimeout(bsModTimeout);
            }

            modal.remove();
            logConsole(`Modal ID ${modalUID} hidden.`, 'debug');
            resolve('dismissed');
        });

        document.body.appendChild(modal);
        bootstrapModal.show();
        logConsole(`Modal ID ${modalUID} created with content: ${content}`, 'debug');
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
        showToast(i18next.t('toasts.domutils.notificationsunsupported'), 'long', 'danger');
        return Promise.reject('Notifications not supported');
    }

    const permission = await Notification.requestPermission();
    logConsole(`Notification permission: ${permission}`, 'debug');
    return permission;
}

// Function to create an scanner overlay card element
export function createScannerOverlay() {
    // Set internal unique id
    const scannerUID = `scanner-overlay-${randomstring.generate(8)}`;

    // Create container
    const container = document.createElement('div');
    container.id = scannerUID;
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
        zIndex: '1055', // Same as Bootstrap modal
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
    logConsole(`Scanner overlay created with ID: ${scannerUID}`, 'debug');

    // Initialize QR scanner
    const html5QrCode = new Html5Qrcode('qr-reader');
    
    const qrCodeSuccessCallback = (decodedText: string) => {
        html5QrCode.stop();
        container.remove();
        logConsole(`Scanner overlay ID ${scannerUID} callback`, 'debug');
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
        closeButton.textContent = i18next.t('scanneroverlay.action.close');
        closeButton.onclick = () => {
            html5QrCode.stop();
            container.remove();
            logConsole(`Scanner overlay ID ${scannerUID} closed`, 'debug');
        };
        cardBody.appendChild(closeButton);
    }).catch((error) => {
        logConsole(error, 'error');
        showToast(i18next.t('toasts.domutils.qrscannerfailed', { 0: error }), 'long', 'danger');
        if (html5QrCode.isScanning) {
            html5QrCode.stop();
        }
        container.remove();
    });
}
