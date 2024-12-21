import { debug } from '../global';
import { showToast } from './dom-utils';

export function initializeDebugUI(): void {
    // Enable debug container
    debug.container.style.display = '';

    // Fill debug info
    debug.uastring.textContent = navigator.userAgent;

    // Event listeners
    debug.toastbtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.dbgtoasttheme;
            const length = btn.dataset.dbgtoastlength as 'default' | 'normal' | 'long' | 'verylong' | undefined;

            showToast(`Test toast. Theme "${theme}"`, length, theme);
        });
    });
}