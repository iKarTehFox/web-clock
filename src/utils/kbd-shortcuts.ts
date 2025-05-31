import { match, P } from 'ts-pattern';
import { toggleFullscreen } from '../global';
import { menu, countdown, stopwatch, panel } from './dom-elements';
import { createBsModal, setMenuTheme } from './dom-utils';
import { presetLocalJSON, resetSettings } from '../importExport';
import { debugMode, lockSettings } from './debug';
import { getPresetByHotkey } from '../assets//presets/presets';
import { debugConsole } from './debug-console';

function generateShortcutsHelp(): HTMLDivElement {
    const shortcuts = {
        '1-9': 'Load built-in presets 1-9',
        'c': 'Show/hide countdown',
        'f': 'Toggle fullscreen',
        'h': 'Show this help',
        'm': 'Toggle menu',
        'r': 'Reset settings to defaults',
        's': 'Show/hide stopwatch',
        't': 'Switch light/dark theme',
        'v': 'Toggle panel visibility',
    };

    const div = document.createElement('div');
    
    for (const [key, description] of Object.entries(shortcuts)) {
        const line = document.createElement('div');
        line.className = 'mb-1 d-flex justify-content-center';
        line.innerHTML = `<kbd>${key}</kbd>: ${description}`;
        div.appendChild(line);
    }

    const note = document.createElement('p');
    note.textContent = 'Keyboard shortcuts are ignored while help is open.';
    div.appendChild(note);
    
    return div;
}

document.addEventListener('keydown', (e) => {
    // Skip if text input is focused
    if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
    }

    // Skip if overlays visible
    if (document.querySelector('[data-overlay="bs-modal-overlay"]') || document.querySelector('[data-overlay="scanner-overlay"]')) {
        return;
    }

    // Skip if settings locked
    if (lockSettings) {
        return;
    }

    // Debouncing/ignore system shortcuts
    if (e.repeat || e.ctrlKey || e.altKey || e.metaKey || e.shiftKey) {
        return;
    }

    // Check key
    const key = e.key.toLowerCase();
    match(key)
        .with(P.when(k => /^[1-9]$/.test(k)), (k) => {
            const preset = getPresetByHotkey(parseInt(k));
            if (preset) presetLocalJSON(preset.filename);
        })
        .with('c', () => { // Show/hide countdown
            countdown.obutton.click();
        })
        .with('d', () => { // Toggle dev console
            if (debugMode) {
                // Prevent the 'd' character from being entered in the input
                e.preventDefault();
                // Use the existing toggle method from debug-console.ts
                debugConsole.toggle();
            }
        })
        .with('f', () => { // Toggle fullscreen
            toggleFullscreen();
        })
        .with('h', () => { // Show help
            createBsModal('Keyboard shortcuts', generateShortcutsHelp());
        })
        .with('m', () => { // Toggle menu
            panel.menubutton.click();
        })
        .with('r', () => {
            resetSettings();
        })
        .with('s', () => { // Show/hide stopwatch
            stopwatch.obutton.click();
        })
        .with('t', () => { // Toggle menu theme
            setMenuTheme('toggle');
        })
        .with('v', () => { // Toggle panel visibility
            menu.panelvischeckbox.click();
        })
        .otherwise(() => {});
});