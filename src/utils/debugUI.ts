import { debug } from '../global';
import { showToast, makeCardOverlay } from './dom-utils';

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

    debug.cardoverlaybtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const title = btn.dataset.dbgcardtitle || '';
            const content = btn.dataset.dbgcardcontent || '';
            
            if (btn.dataset.dbgcardtype === 'image') {
                const img = document.createElement('img');
                img.src = content;
                Object.assign(img.style, {
                    maxWidth: '100%',
                    maxHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain'
                });
                makeCardOverlay(title, img);
            } else {
                makeCardOverlay(title, content);
            }
        });
    });
}

export function initializeloStUI(): void {
    // Enable localStorage export section
    debug.lostcontainer.style.display = '';
}