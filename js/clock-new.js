let cMode = '0';
let dateFormat = 'D';
let timeDisplayMethod = 0;

menu.timeMethodSelect.addEventListener('change', () => {
    // Get the selected value from the select element
    const selectedValue = menu.timeMethodSelect.value;

    // Update the timeDisplayMethod variable with the selected value
    timeDisplayMethod = selectedValue;

    // Update the time display using updateTime()
    updateTime();
});

// Page duration elements
const pageLoadTime = Date.now();

function updatePageDuration() {
    const currentTime = Date.now();

    const timeDiff = currentTime - pageLoadTime;

    // Convert the time difference to seconds, minutes, and hours
    const seconds = Math.floor(timeDiff / 1000) % 60;
    const minutes = Math.floor(timeDiff / (1000 * 60)) % 60;
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));

    menu.durationdisplay.textContent = `${hours}h, ${minutes}m, and ${seconds}s`;
}

// Clock mode radio
menu.clockmoderadio.forEach((radio) => {
    radio.addEventListener('change', () => {
        const value = radio.dataset.value;
        cMode = value;
    });
});

// Date format selector listener
menu.dateformselect.addEventListener('change', function() {
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
    
    // Seconds progress bar
    const secBarWidth = (sec / 59) * 100;
    
    dtdisplay.secondsBar.style.width = `${secBarWidth}%`;
    
    // Time display methods
    const timeDisplayFunctions = {
        binary: toBinary,
        emoji: convertToEmojiBlock,
        roman: convertToRomanNumerals,
        hexa: toHexadecimal,
        hexatri: toHexatrigesimal,
        octal: toOctal,
        words: toWords,
        unixmillis: toUnixMillis,
        unixsec: toUnixSec,
        unixcountdown: toUnixMillis
    };

    if (Object.prototype.hasOwnProperty.call(timeDisplayFunctions, timeDisplayMethod)) {
        const displayFunction = timeDisplayFunctions[timeDisplayMethod];
        dtdisplay.hourSlot.textContent = displayFunction(hrs);

        // Hacky implementation... Will fix logic instead in future release.
        if (timeDisplayMethod === 'unixmillis' || timeDisplayMethod === 'unixsec') {
            dtdisplay.hourSlot.textContent = '';
            dtdisplay.minuteSlot.textContent = displayFunction();
            dtdisplay.secondSlot.textContent = '';

            dtdisplay.indicatorSlot.textContent = '';
            return;
        } else if (timeDisplayMethod === 'unixcountdown') {
            const secondsUntilY2K38 = 2147483647 - Math.floor(Date.now() / 1000);
            dtdisplay.hourSlot.textContent = `${Math.floor(secondsUntilY2K38 / 3600)}h`;
            dtdisplay.minuteSlot.textContent = `${Math.floor((secondsUntilY2K38 % 3600) / 60)}m`;
            dtdisplay.secondSlot.textContent = `${secondsUntilY2K38 % 60}s`;

            dtdisplay.indicatorSlot.textContent = '';
            return;
        }

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

function toOctal(value) {
    return parseInt(value, 10).toString(8);
}

function toHexadecimal(value) {
    return parseInt(value, 10).toString(16);
}

function toHexatrigesimal(value) {
    return parseInt(value, 10).toString(36);
}

function toWords(value) {
    return numberToWords.toWords(value);
}

// Unix timestamp functions
function toUnixMillis() {
    return Date.now();
}

function toUnixSec() {
    return Math.floor(Date.now()/1000);
}

function updateDate() {
    const time = luxon.DateTime.now();
    dtdisplay.date.textContent = time.toFormat(dateFormat);

    Array.from(menu.dateformselect.children).forEach((child) => {
        if (child.value !== '') {
            child.textContent = time.toFormat(child.value);
        }
    });
}


// Change tab favicon function
function updateFavicon(hour) {
    doc.favicon.href = `./icons/clock-time-${hour}.svg`;
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
    let digits = String(+number).split(''),
        key = ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM',
            '', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC',
            '', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'
        ],
        roman = '',
        i = 3;
    while (i--)
        roman = (key[+digits.pop() + (i * 10)] || '') + roman;
    return Array(+digits.join('') + 1).join('M') + roman;
}

// Update on load, then start intervals
const time = luxon.DateTime.now();
updateTime();
updateDate();
updateFavicon(time.toFormat('h'));

setInterval(function() {
    const time = luxon.DateTime.now();
    updateFavicon(time.toFormat('h'));
}, 25000);

setInterval(function() {
    updateTime();
    updatePageDuration();
}, 250);

setInterval(function() {
    updateDate();
}, 5000);