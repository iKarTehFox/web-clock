import { menu, countdown } from './global';
import { logConsole, showToast } from './utils/dom-utils';


let countdownInterval;
let totalSeconds = 0;
let isRunning = false;

function updateDisplay() {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    countdown.display.textContent = [hours, minutes, seconds]
        .map(v => v.toString().padStart(2, '0'))
        .join(':');
}

function inputsDisabled(disabled: boolean) {
    if (disabled === false) {
        countdown.hrsinput.disabled = false;
        countdown.mininput.disabled = false;
        countdown.secinput.disabled = false;
    } else {
        countdown.hrsinput.disabled = true;
        countdown.mininput.disabled = true;
        countdown.secinput.disabled = true;
    }
}

function startCountdown() {
    if (!isRunning) {
        isRunning = true;
        countdownInterval = setInterval(() => {
            if (totalSeconds > 0) {
                totalSeconds--;
                updateDisplay();
            } else {
                clearInterval(countdownInterval);
                isRunning = false;
                showToast('Countdown finished!', 30000, 'success');
                inputsDisabled(false);
            }
        }, 1000);
    }
}

function pauseCountdown() {
    isRunning = false;
    clearInterval(countdownInterval);
}

function resetCountdown() {
    isRunning = false;
    totalSeconds = 0;
    clearInterval(countdownInterval);
    updateDisplay();

    // Re-enable inputs
    inputsDisabled(false);
}

countdown.startbtn.addEventListener('click', () => {
    if (!isRunning) {
        if (totalSeconds === 0) {
            const hours = parseInt(countdown.hrsinput.value) || 0;
            const minutes = parseInt(countdown.mininput.value) || 0;
            const seconds = parseInt(countdown.secinput.value) || 0;
            
            if (hours === 0 && minutes === 0 && seconds === 0) {
                return;
            }
            
            totalSeconds = hours * 3600 + minutes * 60 + seconds;
            if (totalSeconds > 360000) {
                showToast('Time too long! Make sure it is less than 100 hours.', 5000, 'danger');
                return;
            }
        }
        updateDisplay();
        startCountdown();

        // Disable inputs
        inputsDisabled(true);
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
        if (!menu.options.contains((e.target as Node)) && !menu.obutton.contains((e.target as Node)) && !countdown.container.contains((e.target as Node)) && !countdown.obutton.contains((e.target as Node)) && !(countdown.container.style.display == 'none')) {
            countdown.container.style.display = 'none';
            countdown.obutton.className = 'btn btn-secondary';
            logConsole('Countdown panel closed', 'info');
        }
    });
});

// Esc down to close countdown
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !(countdown.container.style.display == 'none')) {
        countdown.container.style.display = 'none';
        countdown.obutton.className = 'btn btn-secondary';
        logConsole('Countdown panel closed', 'info');
    }
});

// Event listeners for buttons
countdown.pausebtn.addEventListener('click', pauseCountdown);
countdown.resetbtn.addEventListener('click', resetCountdown);

// Initialize display
updateDisplay();
