import { debug, dtdisplay } from './dom-elements';
import { showToast } from './dom-utils';

function addDbgInfo(text: string): void {
    const p = document.createElement('p');
    p.className = 'mb-1';
    p.textContent = text;
    debug.info.appendChild(p);
}

export function initializeDebugUI(): void {
    // Enable debug container
    debug.container.style.display = '';

    // Fill debug info
    addDbgInfo(`User Agent: ${navigator.userAgent}`); // User agent
    addDbgInfo(`Locale: ${navigator.language}`); // Locale
    addDbgInfo(`System Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`); // Timezone
    addDbgInfo(`Load time: ${new Date().toLocaleString()}`); // Load time
    addDbgInfo(`Screen Resolution: ${window.screen.width}x${window.screen.height}`); // Screen resolution
    addDbgInfo(`Color Depth: ${window.screen.colorDepth}-bit`); // Color depth
    addDbgInfo(`Online Status: ${navigator.onLine ? 'Online' : 'Offline'}`); // Online status

    // Event listeners
    debug.toastbtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.dbgtoasttheme;
            const length = btn.dataset.dbgtoastlength as 'default' | 'normal' | 'long' | 'verylong' | undefined;
            showToast(`Test toast. Theme "${theme}"`, length, theme);
        });
    });

    debug.rmclockbtn.addEventListener('click', () => {
        dtdisplay.ccontainer.remove();
    });
}