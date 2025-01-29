import { match } from 'ts-pattern';
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

            match(btn.dataset.dbgcardtype)
                .with('image', () => {
                    const img = document.createElement('img');
                    img.src = content;
                    makeCardOverlay(title, img);
                })
                .otherwise(() => {
                    makeCardOverlay(title, content);
                });
        });
    });
}