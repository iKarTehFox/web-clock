import { menu, stopwatch } from './global';
import { logConsole } from './utils/dom-utils';

let timeInterval: NodeJS.Timeout;
let running: boolean = false;
let startTime: number;
let elapsedTime: number = 0;

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

// Update the stopwatch display
function updateDisplay() {
    const currentTime = Date.now();
    const timeDiff = elapsedTime + (running ? currentTime - startTime : 0);
    stopwatch.display.textContent = formatTime(timeDiff);
}

// Start the stopwatch
function startStopwatch() {
    if (!running) {
        running = true;
        startTime = Date.now();
        timeInterval = setInterval(updateDisplay, 25);
        logConsole('Stopwatch started...', 'info');
    }
}

// Pause the timer
export function pauseStopwatch() {
    if (running) {
        running = false;
        elapsedTime += Date.now() - startTime;
        clearInterval(timeInterval);
        logConsole('Stopwatch paused...', 'info');
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
    }
}

// Stopwatch button listener
stopwatch.obutton.addEventListener('click', () => {
    if (stopwatch.container.style.display == 'block') {
        stopwatch.container.style.display = 'none';
        stopwatch.obutton.className = 'btn btn-secondary';
        logConsole('Stopwatch panel closed', 'info');
        pauseStopwatch();
        return;
    } else if (!(stopwatch.container.style.display == 'block')) {
        stopwatch.container.style.display = 'block';
        stopwatch.obutton.className = 'btn btn-danger';
        logConsole('Stopwatch panel opened', 'info');
    }
});

// Click outside to close stopwatch
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(e) {
        const target = e.target as HTMLElement;
        const isMenuRelated = menu.options.contains(target) || 
                                   menu.obutton.contains(target) || 
                                   stopwatch.container.contains(target) || 
                                   stopwatch.obutton.contains(target);

        if (!isMenuRelated && stopwatch.container.style.display !== 'none') {
            stopwatch.container.style.display = 'none';
            stopwatch.obutton.className = 'btn btn-secondary';
            logConsole('Stopwatch panel closed', 'info');
            pauseStopwatch();
        }
    });
});

// Esc down to close stopwatch
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && stopwatch.container.style.display !== 'none') {
        stopwatch.container.style.display = 'none';
        stopwatch.obutton.className = 'btn btn-secondary';
        logConsole('Stopwatch panel closed', 'info');
        pauseStopwatch();
    }
});

// Event listeners for buttons
stopwatch.startbtn.addEventListener('click', startStopwatch);
stopwatch.pausebtn.addEventListener('click', pauseStopwatch);
stopwatch.resetbtn.addEventListener('click', resetStopwatch);

// Initialize display
updateDisplay();
