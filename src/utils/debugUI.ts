import { debug } from '../global';
import { debugMode } from './debug';

export function initializeDebugUI(): void {
    if (debugMode) {
        // Enable debug container
        debug.container.style.display = '';

        // Fill debug info
        debug.uastring.textContent = navigator.userAgent;
    } else {
        console.log('Debug mode is off.');
    }
}