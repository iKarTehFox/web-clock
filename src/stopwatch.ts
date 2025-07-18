import { match } from 'ts-pattern';
import { devcon, menu, panel, stopwatch } from './utils/dom-elements';
import { logConsole } from './utils/dom-utils';

let timeInterval: NodeJS.Timeout;
let running: boolean = false;
let startTime: number;
let elapsedTime: number = 0;
let counter: number = 0;
let lastLapTime;

// Format time to HH:MM:SS.mmm
function formatTime(totalMilliseconds: number) {
    const totalSeconds = Math.floor(totalMilliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const ms = totalMilliseconds % 1000;

    return [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        seconds.toString().padStart(2, '0')
    ].join(':') + '.' + ms.toString().padStart(3, '0');
}

// Update the stopwatch display (+ return current time if needed)
function updateDisplay(returnCurrent: boolean = false, isFormatted: boolean = false) {
    const currentTime = Date.now();
    const timeDiff = elapsedTime + (running ? currentTime - startTime : 0);
    if (returnCurrent && isFormatted) {
        return formatTime(timeDiff);
    } else if (returnCurrent && !isFormatted) {
        return timeDiff;
    }
    stopwatch.display.textContent = formatTime(timeDiff);
}

function btnState(buttons: { [key: string]: boolean }) {
    Object.entries(buttons).forEach(([button, disabled]) => {
        match(button)
            .with('start', () => {
                stopwatch.startbtn.disabled = disabled;
            })
            .with('pause', () => {
                stopwatch.pausebtn.disabled = disabled;
            })
            .with('reset', () => {
                stopwatch.resetbtn.disabled = disabled;
            })
            .with('lap', () => {
                stopwatch.lapbtn.disabled = disabled;
            })
            .otherwise(() => {
                logConsole(`Invalid stopwatch button: ${button}`, 'error');
            });
    });
}

// Start the stopwatch
function startStopwatch() {
    if (!running) {
        running = true;
        startTime = Date.now();
        timeInterval = setInterval(updateDisplay, 25);
        logConsole('Stopwatch started...', 'info');
        btnState({
            start: true,
            pause: false,
            reset: false,
            lap: false,
        });
    }
}

// Pause the timer
export function pauseStopwatch() {
    if (running) {
        running = false;
        elapsedTime += Date.now() - startTime;
        clearInterval(timeInterval);
        logConsole('Stopwatch paused...', 'info');
        btnState({
            start: false,
            pause: true,
            lap: true,
        });
    }
}

// Reset the timer
function resetStopwatch() {
    if (running || elapsedTime > 0) {
        running = false;
        clearInterval(timeInterval);
        elapsedTime = 0;
        updateDisplay();
        logConsole('Stopwatch reset...', 'info');
        btnState({
            start: false,
            pause: true,
            reset: true,
            lap: true,
        });

        // Reset display
        stopwatch.lapfield.value ='';
        counter = 0;
        lastLapTime = undefined;
    }
}

// Lap the stopwatch
function lapStopwatch() {
    if (running || elapsedTime > 0) {
        const currentTime = Number(updateDisplay(true, false));
        const laptxt = stopwatch.lapfield.value;
        counter++;
        
        let lapEntry = '';
        if (lastLapTime !== undefined) {
            const lapDifference = currentTime - lastLapTime;
            lapEntry = `#${counter}: ${formatTime(lapDifference)} - ${updateDisplay(true, true)}\n`;
        } else {
            lapEntry = `#${counter}: ${updateDisplay(true, true)} - ${updateDisplay(true, true)}\n`;
        }
        
        stopwatch.lapfield.value = lapEntry + laptxt;
        lastLapTime = currentTime;
        logConsole('Stopwatch lapped...', 'info');
    }
}

// External control
export function startStopwatchExternal(): Promise<void> {
    if (running) {
        return Promise.reject(new Error('Stopwatch is already running'));
    }

    startStopwatch();
    return Promise.resolve();
}

export function pauseStopwatchExternal(): Promise<void> {
    if (!running) {
        return Promise.reject(new Error('Stopwatch is not running'));
    }

    pauseStopwatch();
    return Promise.resolve();
}

export function resetStopwatchExternal(): Promise<void> {
    if (!running && elapsedTime === 0) {
        return Promise.reject(new Error('Stopwatch is already reset'));
    }

    resetStopwatch();
    return Promise.resolve();
}

export function lapStopwatchExternal(): Promise<void> {
    if (!running) {
        return Promise.reject(new Error('Stopwatch is not running'));
    }

    lapStopwatch();
    return Promise.resolve();
}

// Stopwatch button listener
stopwatch.obutton.addEventListener('click', () => {
    if (!stopwatch.container.classList.contains('d-none')) {
        stopwatch.container.classList.add('d-none');
        stopwatch.obutton.className = 'btn btn-secondary';
        logConsole('Stopwatch panel closed', 'info');
        pauseStopwatch();
        return;
    } else if (stopwatch.container.classList.contains('d-none')) {
        stopwatch.container.classList.remove('d-none');
        stopwatch.obutton.className = 'btn btn-danger';
        logConsole('Stopwatch panel opened', 'info');
    }
});

// Click outside to close stopwatch
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(e) {
        const target = e.target as HTMLElement;
        const isMenuRelated = menu.container.contains(target) || 
                                   panel.menubutton.contains(target) || 
                                   stopwatch.container.contains(target) || 
                                   stopwatch.obutton.contains(target) ||
                                   devcon.container.contains(target);
        const isStopwatchVisible = !stopwatch.container.classList.contains('d-none');
        const isTooltip = target.closest('.tooltip') !== null;
        const isBsModal = target.closest('[data-overlay="bs-modal-overlay"]') !== null;
        const isScannerOverlay = target.closest('[data-overlay="scanner-overlay"]') !== null;
        const isExportOverlay = target.closest('[data-overlay="export-modal-overlay"]') !== null;
        const isOffcanvasBackdrop = target.closest('.offcanvas-backdrop') !== null;
        const isInputFocused = document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement;

        if (!isMenuRelated && !isTooltip && !isBsModal && !isScannerOverlay && !isExportOverlay && isStopwatchVisible && !isOffcanvasBackdrop && !isInputFocused) {
            stopwatch.container.classList.add('d-none');
            stopwatch.obutton.className = 'btn btn-secondary';
            logConsole('Stopwatch panel closed', 'info');
            pauseStopwatch();
        }
    });
});

// Esc down to close stopwatch
document.addEventListener('keydown', function(e) {
    const isStopwatchVisible = !stopwatch.container.classList.contains('d-none');
    const isBsModalVisible = document.querySelector('[data-overlay="bs-modal-overlay"]') !== null;
    const isScannerOverlayVisible = document.querySelector('[data-overlay="scanner-overlay"]') !== null;
    const isExportOverlayVisible = document.querySelector('[data-overlay="export-modal-overlay"]') !== null;
    const isOffcanvasVisible = document.querySelector('.offcanvas.show, .offcanvas.showing') !== null;

    if (e.key === 'Escape' && isStopwatchVisible && !isBsModalVisible && !isScannerOverlayVisible && !isExportOverlayVisible && !isOffcanvasVisible) {
        stopwatch.container.classList.add('d-none');
        stopwatch.obutton.className = 'btn btn-secondary';
        logConsole('Stopwatch panel closed', 'info');
        pauseStopwatch();
    }
});

// Event listeners for buttons
stopwatch.startbtn.addEventListener('click', startStopwatch);
stopwatch.pausebtn.addEventListener('click', pauseStopwatch);
stopwatch.resetbtn.addEventListener('click', resetStopwatch);
stopwatch.lapbtn.addEventListener('click', lapStopwatch);

// Prevent close if running
window.addEventListener('beforeunload', function(e) {
    if (running) {
        e.preventDefault();
    }
});

// Initialize display
updateDisplay();
