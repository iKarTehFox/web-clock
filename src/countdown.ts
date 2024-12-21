import { match } from 'ts-pattern';
import { menu, countdown } from './global';
import { logConsole, showToast } from './utils/dom-utils';


let countdownInterval: NodeJS.Timeout;
let totalSeconds: number = 0;
let running: boolean = false;

function updateDisplay() {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    countdown.display.textContent = [hours, minutes, seconds]
        .map(v => v.toString().padStart(2, '0'))
        .join(':');
}

function inputsState(disabled: boolean) {
    countdown.hrsinput.disabled = disabled;
    countdown.mininput.disabled = disabled;
    countdown.secinput.disabled = disabled;
}

function btnState(buttonStates: { [key: string]: boolean }) {
    Object.entries(buttonStates).forEach(([button, disabled]) => {
        match(button)
            .with('start', () => {
                countdown.startbtn.disabled = disabled;
            })
            .with('pause', () => {
                countdown.pausebtn.disabled = disabled;
            })
            .with('reset', () => {
                countdown.resetbtn.disabled = disabled;
            })
            .otherwise(() => {
                logConsole(`Unknown button: ${button}`, 'error');
            });
    });
}

function startCountdown() {
    if (!running) {
        running = true;
        countdownInterval = setInterval(() => {
            if (totalSeconds > 0) {
                totalSeconds--;
                updateDisplay();
            }
            // Check if reached 0, end immediately to avoid 1 second delay.
            if (totalSeconds === 0 || totalSeconds < 1) {
                clearInterval(countdownInterval);
                running = false;
                showToast('Countdown finished!', 30000, 'success');
                inputsState(false);
                btnState({
                    start: false,
                    pause: true,
                    reset: true,
                });
            }
        }, 1000);
        logConsole('Countdown started...', 'info');
        btnState({
            start: true,
            pause: false,
            reset: false,
        });
    }
}

function pauseCountdown() {
    if (running) {
        running = false;
        clearInterval(countdownInterval);
        logConsole('Countdown paused...', 'info');
        btnState({
            start: false,
            pause: true,
        });
    }
}

function resetCountdown() {
    if (running || totalSeconds > 0) {
        running = false;
        totalSeconds = 0;
        clearInterval(countdownInterval);
        updateDisplay();
    
        // Re-enable inputs
        inputsState(false);
        logConsole('Countdown reset...', 'info');
        btnState({
            start: false,
            pause: true,
            reset: true,
        });
    }
}

countdown.startbtn.addEventListener('click', () => {
    if (!running) {
        if (totalSeconds === 0) {
            const hours = parseInt(countdown.hrsinput.value) || 0;
            const minutes = parseInt(countdown.mininput.value) || 0;
            const seconds = parseInt(countdown.secinput.value) || 0;
            
            if (hours === 0 && minutes === 0 && seconds === 0) {
                return;
            }
            
            // Calculate total seconds
            totalSeconds = hours * 3600 + minutes * 60 + seconds;

            // Check if totalSeconds is too long (greater than 100 hours)
            if (totalSeconds > 360000) {
                showToast('Time set too long! Make sure it is less than 100 hours.', 5000, 'danger');
                totalSeconds = 0;
                return;
            }
        }
        updateDisplay();
        startCountdown();

        // Disable inputs
        inputsState(true);
    }
});

// Countdown button listener
countdown.obutton.addEventListener('click', () => {
    if (countdown.container.style.display == 'block') {
        countdown.container.style.display = 'none';
        countdown.obutton.className = 'btn btn-secondary';
        logConsole('Countdown panel closed', 'info');
        return;
    } else if (!(countdown.container.style.display == 'block')) {
        countdown.container.style.display = 'block';
        countdown.obutton.className = 'btn btn-danger';
        logConsole('Countdown panel opened', 'info');
    }
});

// Click outside to close countdown
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(e) {
        const target = e.target as HTMLElement;
        const isMenuRelated = menu.options.contains(target) || 
                                   menu.obutton.contains(target) || 
                                   countdown.container.contains(target) || 
                                   countdown.obutton.contains(target);
        const isTooltip = target.closest('.tooltip') !== null;
        const isCardOverlay = target.closest('[data-overlay="card-overlay"]') !== null;

        if (!isMenuRelated && !isTooltip && !isCardOverlay && countdown.container.style.display !== 'none') {
            countdown.container.style.display = 'none';
            countdown.obutton.className = 'btn btn-secondary';
            logConsole('Countdown panel closed', 'info');
        }
    });
});

// Esc down to close countdown
document.addEventListener('keydown', function(e) {
    const isCountdownVisible = countdown.container.style.display !== 'none';
    const isCardOverlayVisible = document.querySelector('[data-overlay="card-overlay"]') !== null;

    if (e.key === 'Escape' && isCountdownVisible && !isCardOverlayVisible) {
        countdown.container.style.display = 'none';
        countdown.obutton.className = 'btn btn-secondary';
        logConsole('Countdown panel closed', 'info');
    }
});

// Event listeners for buttons
countdown.pausebtn.addEventListener('click', pauseCountdown);
countdown.resetbtn.addEventListener('click', resetCountdown);

// Prevent close if running
window.addEventListener('beforeunload', function(e) {
    if (running) {
        e.preventDefault();

        // DEPRECATED: For compatibility only.
        e.returnValue = true;
    }
});

// Initialize display
updateDisplay();
