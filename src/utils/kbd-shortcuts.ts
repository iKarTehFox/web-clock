import { match } from 'ts-pattern';
import { toggleFullscreen } from '../global';
import { menu, countdown, stopwatch } from './dom-elements';
import { makeCardOverlay } from './dom-utils';
import { presetLocalJSON } from '../importExport';

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
    if (document.querySelector('[data-overlay="card-overlay"]') || document.querySelector('[data-overlay="scanner-overlay"]')) {
        return;
    }

    // Debouncing/ignore system shortcuts
    if (e.repeat || e.ctrlKey || e.altKey || e.metaKey || e.shiftKey) {
        return;
    }

    // Check key
    const key = e.key.toLowerCase();
    match(key)
        .with('c', () => { // Show/hide countdown
            countdown.obutton.click();
        })
        .with('f', () => { // Toggle fullscreen
            toggleFullscreen();
        })
        .with('h', () => { // Show help
            makeCardOverlay('Keyboard shortcuts', generateShortcutsHelp());
        })
        .with('m', () => { // Toggle menu
            if (menu.options.classList.contains('menu-options-show')) {
                menu.cbutton.click();
            } else {
                menu.obutton.click();
            }
        })
        .with('r', () => {
            if (window.confirm('Reset all clock settings to defaults?')) {
                presetLocalJSON('onlinewebclock-defaults'); // Clock settings
                menu.themeradio[0].click(); // Light theme
                menu.panelvischeckbox.checked = true;
                menu.panelvischeckbox.dispatchEvent(new Event('change'));
                if (menu.obutton.style.display === 'none' && menu.options.classList.contains('menu-options-fade')) {
                    menu.obutton.style.display = '';
                }
                if (menu.weatherstopbtn.disabled === false) menu.weatherstopbtn.click();
                menu.titlevischeckbox.checked = true;
            }
        })
        .with('s', () => { // Show/hide stopwatch
            stopwatch.obutton.click();
        })
        .with('t', () => { // Toggle menu theme
            if (menu.themeradio[0].checked) {
                menu.themeradio[1].click();
            } else {
                menu.themeradio[0].click();
            }
        })
        .with('v', () => { // Toggle panel visibility
            if (menu.obutton.style.display === 'none' && (menu.options.classList.contains('menu-options-fade') || menu.options.classList.contains('menu-options-initial'))) {
                menu.obutton.style.display = '';
            }
            menu.panelvischeckbox.click();
        })
        .otherwise(() => {});
});