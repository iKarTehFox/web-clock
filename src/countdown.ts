import { match } from 'ts-pattern';
import { countdown, menu, panel } from './utils/dom-elements';
import { logConsole, requestNotificationPermission, showToast } from './utils/dom-utils';
import * as luxon from 'ts-luxon';


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
                inputsState(false);
                btnState({
                    start: false,
                    pause: true,
                    reset: true,
                });
                if (countdown.notifcheckbox.checked && Notification.permission === 'granted') {
                    showToast('Countdown finished!', 'normal');
                    new Notification('Countdown finished!', {
                        body: `Your timer has elapsed. It is now ${luxon.DateTime.now().toFormat('tt')}`,
                        silent: false
                    });
                } else {
                    showToast('Countdown finished!', 'verylong');
                }
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
                showToast('Time set too long! Make sure it is less than 100 hours.', 'normal', 'danger');
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
        const isMenuRelated = menu.container.contains(target) || 
                                   panel.menubutton.contains(target) || 
                                   countdown.container.contains(target) || 
                                   countdown.obutton.contains(target);
        const isCountdownVisible = countdown.container.style.display !== 'none';
        const isTooltip = target.closest('.tooltip') !== null;
        const isBsModal = target.closest('[data-overlay="bs-modal-overlay"]') !== null;
        const isScannerOverlay = target.closest('[data-overlay="scanner-overlay"]') !== null;
        const isOffcanvasBackdrop = target.closest('.offcanvas-backdrop') !== null;

        if (!isMenuRelated && !isTooltip && !isBsModal && !isScannerOverlay && isCountdownVisible && !isOffcanvasBackdrop) {
            countdown.container.style.display = 'none';
            countdown.obutton.className = 'btn btn-secondary';
            logConsole('Countdown panel closed', 'info');
        }
    });
});

// Esc down to close countdown
document.addEventListener('keydown', function(e) {
    const isCountdownVisible = countdown.container.style.display !== 'none';
    const isBsModalVisible = document.querySelector('[data-overlay="bs-modal-overlay"]') !== null;
    const isScannerOverlayVisible = document.querySelector('[data-overlay="scanner-overlay"]') !== null;
    const isOffcanvasVisible = document.querySelector('.offcanvas.show, .offcanvas.showing') !== null;

    if (e.key === 'Escape' && isCountdownVisible && !isBsModalVisible && !isScannerOverlayVisible && !isOffcanvasVisible) {
        countdown.container.style.display = 'none';
        countdown.obutton.className = 'btn btn-secondary';
        logConsole('Countdown panel closed', 'info');
    }
});

// Event listeners for buttons
countdown.pausebtn.addEventListener('click', pauseCountdown);
countdown.resetbtn.addEventListener('click', resetCountdown);

// Notification functionality
countdown.notifcheckbox.addEventListener('change', async function() {
    if (this.checked && Notification.permission !== 'granted') {
        await requestNotificationPermission()
            .then(permission => {
                if (permission !== 'granted') {
                    countdown.notifcheckbox.checked = false;
                    showToast('Notification permission denied.', 'normal', 'danger');
                }
            })
            .catch(() => {
                countdown.notifcheckbox.checked = false;
            });
    }
});

if (Notification.permission === 'granted') { // Enable if already granted
    countdown.notifcheckbox.checked = true;
}

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
