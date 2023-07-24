let cMode = '0';
var dateFormat = 'D';
var timeDisplayMethod = 0;

// Page duration elements
var durationElement = document.getElementById("time-duration");
var pageLoadTime = new Date();

menu.timeMethodSelect.addEventListener('change', () => {
    // Get the selected value from the select element
    const selectedValue = menu.timeMethodSelect.value;

    // Update the timeDisplayMethod variable with the selected value
    timeDisplayMethod = selectedValue;

    // Update the time display using updateTime()
    updateTime();
});

function updatePageDuration() {
    // Get the current time
    var currentTime = new Date();

    // Calculate the time difference in milliseconds
    var timeDiff = currentTime - pageLoadTime;

    // Convert the time difference to seconds, minutes, and hours
    var seconds = Math.floor(timeDiff / 1000) % 60;
    var minutes = Math.floor(timeDiff / (1000 * 60)) % 60;
    var hours = Math.floor(timeDiff / (1000 * 60 * 60));

    // Update the element with the duration
    var durationElement = document.getElementById("time-duration");
    durationElement.textContent = hours + "h, " + minutes + "m, and " + seconds + "s";
}

// Clock functions
const clockModeGroup = document.getElementById('clock-mode-group');

// Clock mode radio
menu.clockmoderadio.forEach((radio) => {
    radio.addEventListener('change', () => {
        const value = radio.dataset.value;
        cMode = value;
    });
});

// Date format selector listener
menu.dateformselect.addEventListener("change", function() {
    dateFormat = menu.dateformselect.value;
    updateDate();
});

function updateTime() {
    const time = luxon.DateTime.now();
    const hrs = cMode === '0' ? time.toFormat('h') : time.toFormat('HH');
    const min = time.toFormat('mm');
    const sec = time.toFormat('ss');
    const ind = cMode === '0' ? time.toFormat('a') : '';

    document.title = `Time: ${hrs}:${min}:${sec} ${ind}`;
    updateFavicon(time.toFormat('h'));
    
    // Seconds progress bar
    const secBarWidth = (sec / 59) * 100;
    
    dtdisplay.secondsBar.style.width = `${secBarWidth}%`;
    
    // Time display methods
    const timeDisplayFunctions = {
        binary: toBinary,
        emoji: convertToEmojiBlock,
        roman: convertToRomanNumerals,
        hexa: toHexadecimal,
        octal: toOctal,
        words: toWords,
    };

    if (timeDisplayFunctions.hasOwnProperty(timeDisplayMethod)) {
        const displayFunction = timeDisplayFunctions[timeDisplayMethod];
        dtdisplay.hourSlot.textContent = displayFunction(hrs);

        if (timeDisplayMethod === 'words') {
            dtdisplay.minuteSlot.textContent = formatMinutesForWordsDisplay(min);
        } else {
            dtdisplay.minuteSlot.textContent = displayFunction(min);
        }

        dtdisplay.secondSlot.textContent = displayFunction(sec);
    } else {
        dtdisplay.hourSlot.textContent = hrs;
        dtdisplay.minuteSlot.textContent = min;
        dtdisplay.secondSlot.textContent = sec;
    }

    dtdisplay.indicatorSlot.textContent = ind;
}

// Helper function for time display method 'words'
function formatMinutesForWordsDisplay(min) {
    const parsedMinutes = parseInt(min, 10);

    if (parsedMinutes === 0) {
        return 'o\'clock';
    } else if (parsedMinutes < 10) {
        return `oh ${numberToWords.toWords(parsedMinutes)}`;
    } else {
        return numberToWords.toWords(parsedMinutes);
    }
}


// Helper functions for time display methods
function toBinary(value) {
    return parseInt(value, 10).toString(2);
}

function toHexadecimal(value) {
    return parseInt(value, 10).toString(16);
}

function toOctal(value) {
    return parseInt(value, 10).toString(8);
}

function toWords(value) {
    return numberToWords.toWords(value);
}

function updateDate() {
    const time = luxon.DateTime.now();
    dtdisplay.date.innerHTML = time.toFormat(dateFormat);

    const dateVisOptions = ['dateVisOp1', 'dateVisOp2', 'dateVisOp3', 'dateVisOp4'];

    dateVisOptions.forEach((optionId) => {
        const optionElement = document.getElementById(optionId);
        optionElement.textContent = time.toFormat(optionElement.value);
    });
}

// Change tab favicon function
function updateFavicon(hour) {
    var faviconLink = document.getElementById('favicon');
    faviconLink.href = `./icons/clock-time-${hour}.svg`;
}

// Emoji block function
function convertToEmojiBlock(number) {
    const emojiBlocks = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
    const digits = number.toString().split('');
    const emojiDigits = digits.map((digit) => emojiBlocks[parseInt(digit, 10)]);
    return emojiDigits.join('');
}

// Roman numeral converter function
function convertToRomanNumerals(number) {
    if (isNaN(number))
        return NaN;
    if (number === 0 || number === '00')
        return number;
    var digits = String(+number).split(""),
        key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
            "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
            "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"
        ],
        roman = "",
        i = 3;
    while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
}

// Update on load, then start interval
updateTime();
updateDate();

setInterval(function() {
    updateTime();
    updatePageDuration();
}, 250);

setInterval(function() {
    updateDate();
}, 5000);