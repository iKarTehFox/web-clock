import { countdown, devcon, doc, menu, stopwatch, weather } from './dom-elements';
import { debugMode, isDevConInit } from './debug';
import { Html5Qrcode } from 'html5-qrcode';
import { processJSONSettings } from '../importExport';
import { match } from 'ts-pattern';
import { Modal, Toast } from 'bootstrap';
import * as luxon from 'ts-luxon';
import randomstring from 'randomstring';
import i18next from 'i18next';
import { toastPosition } from './debug';

// ID Generation
export function generateId(prefix: string = 'id'): string {
    return `${prefix}-${randomstring.generate(8)}`;
}

// Custom console logging function
export function logConsole(message: string, type: 'debug' | 'error' | 'warning' | 'info' = 'debug', bypass: boolean = false, appendDevCon: boolean = true): void {
    if ((debugMode || bypass) && type === 'debug') {
        console.log(`DEBUG - ${message}`);
    } else if (type === 'error') {
        console.error(`ERROR - ${message}`);
    } else if (type === 'warning') {
        console.warn(`WARNING - ${message}`);
    } else if ((debugMode || bypass) && type === 'info') {
        console.info(`INFO - ${message}`);
    }

    if (appendDevCon) {
        appendToLogs(message, type, true);
    }
}

export function appendToLogs(text: string, type: 'info' | 'warning' | 'error' | 'debug' = 'info', timestamp: boolean = true): void {
    if (!isDevConInit) return;

    // Create a new log entry
    const entry = document.createElement('div');
    
    // Add timestamp if requested
    const timeString = timestamp ? `[${new Date().toLocaleTimeString()}] ` : '';
    
    // Style based on log type
    match(type)
        .with('debug', () => {
            entry.dataset.logtype = 'debug';
            entry.style.color = '#6c757d'; // Gray for debug
        })
        .with('info', () => {
            entry.dataset.logtype = 'info';
            entry.style.color = '#0d6efd'; // Blue for info
        })
        .with('warning', () => {
            entry.dataset.logtype = 'warning';
            entry.style.color = '#ffc107'; // Yellow for warnings
        })
        .with('error', () => {
            entry.dataset.logtype = 'error';
            entry.style.color = '#dc3545'; // Red for errors
        })
        .otherwise(() => {});
    
    // Set the content with timestamp if enabled
    entry.textContent = `${timeString}${type.toUpperCase()}: ${text}`;
    devcon.logs.appendChild(entry);
    
    // Remove oldest entries if exceeding 500
    while (devcon.logs.children.length > 500) {
        devcon.logs.removeChild(devcon.logs.firstChild);
    }
    
    // Auto-scroll to bottom
    devcon.logs.scrollTop = devcon.logs.scrollHeight;
}

// Function to set toast theme
function getThemeInfo(colorTheme: string = 'auto') {
    const theme = colorTheme === 'auto' ? menu.container.dataset.bsTheme : colorTheme;

    const themes = {
        light: {
            bgColor: '#FFFFFF',
            textColor: '#212529',
            outline: 'rgba(255, 255, 255, 0.5) solid 2px',
            colorScheme: 'light'
        },
        dark: {
            bgColor: '#313539',
            textColor: '#FFFFFF',
            outline: 'rgba(49, 43, 57, 0.5) solid 2px',
            colorScheme: 'dark'
        },
        midnight: {
            bgColor: '#0d1525',
            textColor: '#e9ecef',
            outline: 'rgba(18, 27, 47, 0.5) solid 2px',
            colorScheme: 'dark'
        },
        amoled: {
            bgColor: '#000000',
            textColor: '#FFFFFF',
            outline: 'rgba(49, 49, 49, 0.5) solid 2px',
            colorScheme: 'dark'
        },
        danger: {
            bgColor: '#DC3545',
            textColor: '#FFFFFF',
            outline: 'rgba(220, 53, 69, 0.5) solid 2px',
            colorScheme: 'dark'
        },
        success: {
            bgColor: '#198754',
            textColor: '#FFFFFF',
            outline: 'rgba(25, 135, 84, 0.5) solid 2px',
            colorScheme: 'dark'
        },
        warning: {
            bgColor: '#FFC107',
            textColor: '#212529',
            outline: 'rgba(255, 193, 7, 0.5) solid 2px',
            colorScheme: 'light'
        }
    };

    return themes[theme] || themes.light;
}

interface ToastOptions {
    title: string;
    message: string;
    duration?: 'veryshort' | 'default' | 'normal' | 'long' | 'verylong';
    style?: string;
    icon?: string;
}

// Function to show a toast message using Bootstrap toasts
export function showToast(options: ToastOptions): void {
    const { title, message, duration = 'default', style = 'auto', icon } = options;
    const theme = getThemeInfo(style);
    
    // Map duration to proper ms values
    const durationMap = {
        'veryshort': 1000,
        'default': 3000,
        'normal': 5000,
        'long': 10000,
        'verylong': 30000,
        'manual': -1
    };

    const durationMs = durationMap[duration];

    // Map toast position to CSS classes and positioning
    const positionMap: Record<string, string> = {
        'topleft': 'position-fixed top-0 start-0 p-3' ,
        'topmiddle': 'position-fixed top-0 start-50 translate-middle-x p-3',
        'bottomleft': 'position-fixed bottom-0 start-0 p-3',
        'bottommiddle': 'position-fixed bottom-0 start-50 translate-middle-x p-3',
        'bottomright': 'position-fixed bottom-0 end-0 p-3'
    };
    
    const toastPos = positionMap[toastPosition];
    
    // Create toast container if it doesn't exist
    let toastContainer: HTMLElement = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = `toast-container ${toastPos}`;
        toastContainer.style.zIndex = '1090';
        document.body.appendChild(toastContainer);
    } else {
        // Update existing container position
        toastContainer.className = `toast-container ${toastPos}`;
    }
    
    // Generate unique ID for this toast
    const toastId = generateId('toast');
    
    // Create toast element
    const toastElement = document.createElement('div');
    toastElement.className = 'toast';
    toastElement.id = toastId;
    toastElement.setAttribute('role', 'alert');
    toastElement.setAttribute('aria-live', 'assertive');
    toastElement.setAttribute('aria-atomic', 'true');
    
    // Apply custom theme styles
    toastElement.style.backgroundColor = theme.bgColor;
    toastElement.style.color = theme.textColor;
    toastElement.style.border = theme.outline;
    
    // Create toast content with header and body
    toastElement.innerHTML = `
        <div class="toast-header">
            ${icon ? `<i class="bi ${icon} me-2"></i>` : ''}
            <strong class="me-auto">${title}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;
    
    // Apply theme to header and close button
    const toastHeader = toastElement.querySelector('.toast-header') as HTMLElement;
    if (toastHeader) {
        toastHeader.style.backgroundColor = theme.bgColor;
        toastHeader.style.color = theme.textColor;
        toastHeader.style.borderBottom = `1px solid ${theme.textColor}20`; // 20 for slight transparency
    }
    
    const closeButton = toastElement.querySelector('.btn-close') as HTMLElement;
    if (closeButton) {
        // Set close button theme to opposite of the theme's closeBtn property
        closeButton.setAttribute('data-bs-theme', theme.colorScheme);
    }

    // Add to container
    toastContainer.appendChild(toastElement);
    
    // Initialize Bootstrap toast
    const bsToast = new Toast(toastElement, {
        autohide: true,
        delay: durationMs
    });
    
    // Show the toast
    bsToast.show();
    
    // Clean up after toast is hidden
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
        
        // Remove container if no more toasts
        if (toastContainer && toastContainer.children.length === 0) {
            toastContainer.remove();
        }
    });
    
    logConsole(`Bootstrap toast shown: ${title} - ${message} (${duration}, ${style})`, 'debug');
}

// Theme config interface
interface ThemeConfig {
    textColor: string;
    metaTheme: string;
    backgroundColor?: string;
}

type ThemeKey = 'light' | 'dark' | 'midnight' | 'amoled';

const themes: Record<ThemeKey, ThemeConfig> = {
    'light': {
        textColor: '#212529',
        metaTheme: 'light'
    },
    'dark': {
        textColor: '#fff',
        metaTheme: 'dark'
    },
    'midnight': {
        textColor: '#e9ecef',
        metaTheme: 'dark',
        backgroundColor: '#121b2f'
    },
    'amoled': {
        textColor: '#ffffff',
        metaTheme: 'dark',
        backgroundColor: '#000000'
    }
};

// Menu theme function
export function setMenuTheme(theme: 'auto' | 'toggle' | ThemeKey, quiet: boolean = false): void {
    // Get current theme
    const currentTheme = menu.container.dataset.bsTheme || 'light';
    
    // Handle auto
    if (theme === 'auto') {
        const detectedTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        menu.themeselect.value = detectedTheme === 'light' ? 'lightthememode' : 'darkthememode';
        theme = detectedTheme as ThemeKey;
    }

    // Handle toggle (cycle through themes)
    if (theme === 'toggle') {
        const themeKeys = Object.keys(themes) as ThemeKey[];
        const currentIndex = themeKeys.indexOf(currentTheme as ThemeKey);
        const nextIndex = (currentIndex + 1) % themeKeys.length;
        theme = themeKeys[nextIndex];
        
        // Map theme to select option value
        const themeToOptionMap: Record<string, string> = {
            'light': 'lightthememode',
            'dark': 'darkthememode',
            'midnight': 'midnightthememode',
            'amoled': 'amoledthememode'
        };
        menu.themeselect.value = themeToOptionMap[theme] || 'lightthememode';
    }
    
    // Validate theme exists
    if (!themes[theme as ThemeKey]) {
        logConsole(`Invalid theme: ${theme}, defaulting to light`, 'error');
        theme = 'light';
    }

    const themeConfig = themes[theme as ThemeKey];
    
    // Apply theme to all containers
    const containers = [
        menu.container,
        weather.container,
        stopwatch.container,
        countdown.container,
        devcon.container
    ];
    
    containers.forEach(container => {
        // Set data-bs-theme attribute
        container.dataset.bsTheme = theme;
        
        // Set text color
        if (container !== menu.container) {
            container.style.color = themeConfig.textColor;
        }
        
        // Set background color for popup containers
        if (container === stopwatch.container || container === countdown.container) {
            container.style.backgroundColor = themeConfig.backgroundColor || 
                (theme === 'light' ? '#ffffff' : '#313539');
        }
    });
    
    // Browser meta
    setMetaColor('theme', themeConfig.metaTheme);
    
    logConsole(`Menu theme set to: ${theme}`, 'debug');
    if (!quiet) showToast({
        title: i18next.t('toasts.global.title'),
        message: i18next.t(`toasts.global.theme${theme}`)
    });
}

export function getMenuTheme(): string {
    return menu.container.dataset.bsTheme || 'light';
}

// Helper function to get available themes
export function getAvailableThemes(): string[] {
    return Object.keys(themes);
}

// Helper function to get current theme
export function getCurrentTheme(): string {
    return menu.container.dataset.bsTheme || 'light';
}

export interface ModalButton {
    label: string;
    className?: string;
    value?: any;
}

export interface ModalOptions {
    title: string;
    content: HTMLElement | string;
    buttons?: ModalButton[];
    timeoutDelay?: number;
}

export function createBsModal(options: ModalOptions) {
    return new Promise((resolve) => {
        const { title, content, timeoutDelay } = options;
        let buttons = options.buttons || [];
        
        // Set internal unique id
        const modalUID = generateId('bs-modal');

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
                    { label: i18next.t('bsmodal.button.download'), className: 'btn btn-primary', value: 'download' },
                    { label: i18next.t('bsmodal.button.close'), className: 'btn btn-secondary', value: 'close' }
                ];
            } else if (typeof content === 'string') {
                buttons = [
                    { label: i18next.t('bsmodal.button.copy'), className: 'btn btn-primary', value: 'copy' },
                    { label: i18next.t('bsmodal.button.close'), className: 'btn btn-secondary', value: 'close' }
                ];
            } else {
                buttons = [
                    { label: i18next.t('bsmodal.button.close'), className: 'btn btn-secondary', value: 'close' }
                ];
            }
        }

        const footer = modal.querySelector('.modal-footer')!;
        const bootstrapModal = new Modal(modal);
        
        // Timeout handling
        let bsModTimeout: number | undefined;
        
        // Basically, timeout can be disabled if 0, negative, or undefined
        if (timeoutDelay !== undefined && timeoutDelay > 0) {
            // Constrain between 5 and 60 seconds
            const constrainedDelay = Math.max(5, Math.min(60, timeoutDelay)) * 1000;
            
            const countdownEl = document.createElement('small');
            countdownEl.className = 'midnight-text-muted me-auto';
            countdownEl.textContent = i18next.t('bsmodal.button.countdownel', { 0: Math.round(constrainedDelay/1000) });
            countdownEl.style.cursor = 'pointer';
            modal.querySelector('.modal-footer')?.appendChild(countdownEl);
            
            const startTime = Date.now();
            const updateInterval = setInterval(() => {
                const remaining = Math.ceil((constrainedDelay - (Date.now() - startTime))/1000);
                if (remaining > 0) {
                    countdownEl.textContent = i18next.t('bsmodal.button.countdownel', { 0: remaining });
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
                    showToast({
                        title: i18next.t('toasts.domutils.title'),
                        message: i18next.t('toasts.domutils.textcopied'),
                        style: 'success',
                        icon: 'bi-clipboard-check'
                    });
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
        showToast({
            title: i18next.t('toasts.domutils.title'),
            message: i18next.t('toasts.domutils.notificationsunsupported'),
            duration: 'long',
            style: 'danger',
            icon: 'bi-exclamation-triangle-fill'
        });
        return Promise.reject('Notifications not supported');
    }

    const permission = await Notification.requestPermission();
    logConsole(`Notification permission: ${permission}`, 'debug');
    return permission;
}

// Function to create an scanner overlay card element
export function createScannerOverlay() {
    // Set internal unique id
    const scannerUID = generateId('scanner-overlay');

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
        showToast({
            title: i18next.t('toasts.domutils.title'),
            message: i18next.t('toasts.domutils.qrscannerfailed', { 0: error }),
            duration: 'long',
            style: 'danger',
            icon: 'bi-exclamation-triangle-fill'
        });
        if (html5QrCode.isScanning) {
            html5QrCode.stop();
        }
        container.remove();
    });
}

export function createExportModal(defaultFilename: string): Promise<{ filename: string; action: string }> {
    return new Promise((resolve) => {
        const modalUID = generateId('export-modal');

        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.setAttribute('tabindex', '-1');
        modal.dataset.overlay = 'export-modal-overlay';

        modal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered" id="${modalUID}">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${i18next.t('bsmodal.export.title')}</h5>
                    </div>
                    <div class="modal-body">
                        <form id="export-form-${modalUID}">
                            <div class="mb-3">
                                <label for="filename-input-${modalUID}" class="form-label">${i18next.t('bsmodal.export.filename')}</label>
                                <div class="input-group">
                                    <input type="text" class="form-control" id="filename-input-${modalUID}" placeholder="${defaultFilename}">
                                    <div class="input-group-text">.json</div>
                                </div>
                                <div class="form-text">${i18next.t('bsmodal.export.namehelp')}</div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-action="cancel">${i18next.t('bsmodal.button.cancel')}</button>
                        <button type="button" class="btn btn-primary" data-action="confirm">${i18next.t('bsmodal.button.export')}</button>
                    </div>
                </div>
            </div>
        `;

        // Apply theme
        modal.dataset.bsTheme = menu.container.dataset.bsTheme;

        const bootstrapModal = new Modal(modal);
        const filenameInput = modal.querySelector(`#filename-input-${modalUID}`) as HTMLInputElement;
        
        // Handle button clicks
        modal.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'BUTTON') {
                const action = target.dataset.action;
                if (action === 'confirm') {
                    const filename = filenameInput.value.trim();
                    bootstrapModal.hide();
                    resolve({ filename, action: 'confirm' });
                } else if (action === 'cancel') {
                    bootstrapModal.hide();
                    resolve({ filename: '', action: 'cancel' });
                }
            }
        });

        // Handle Enter key in form
        filenameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const filename = filenameInput.value.trim();
                if (filename) {
                    bootstrapModal.hide();
                    resolve({ filename, action: 'confirm' });
                }
            }
        });

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
            logConsole(`Export modal ID ${modalUID} hidden.`, 'debug');
        });

        document.body.appendChild(modal);
        bootstrapModal.show();
        
        // Focus and select the filename input
        setTimeout(() => {
            filenameInput.focus();
            filenameInput.select();
        }, 150);
        
        logConsole(`Export modal ID ${modalUID} created.`, 'debug');
    });
}
