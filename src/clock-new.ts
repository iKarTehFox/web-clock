import { doc, menu, dtdisplay } from './global';
import { numberToWords } from './numberToWords.min';
import * as luxon from 'ts-luxon';

let cMode = '0';
let dateFormat = 'D';
let timeDisplayMethod: string;

menu.timeMethodSelect.addEventListener('change', () => {
    // Get the selected value from the select element
    const selectedValue = menu.timeMethodSelect.value as unknown as number;

    // Update the timeDisplayMethod variable with the selected value
    timeDisplayMethod = String(selectedValue);

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
        const value = String(radio.dataset.value);
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
    const secBarWidth = (Number(sec) / 59) * 100;

    dtdisplay.secondsBar.style.width = `${secBarWidth}%`;

    // Time display methods
    type TimeFunction = (value: string) => string;
    type UnixTimeFunction = () => number;

    interface TimeDisplayFunctions {
        binary: TimeFunction;
        emoji: TimeFunction;
        roman: TimeFunction;
        hexa: TimeFunction;
        hexatri: TimeFunction;
        octal: TimeFunction;
        words: TimeFunction;
        unixmillis: UnixTimeFunction;
        unixsec: UnixTimeFunction;
        unixcountdown: UnixTimeFunction;
        [key: string]: TimeFunction | UnixTimeFunction;
    }

    const timeDisplayFunctions: TimeDisplayFunctions = {
        binary: toBinary,
        emoji: convertToEmojiBlock,
        roman: convertToRomanNumerals,
        hexa: toHexadecimal,
        hexatri: toHexatrigesimal,
        octal: toOctal,
        words: toWords,
        unixmillis: toUnixMillis,
        unixsec: toUnixSec,
        unixcountdown: toUnixMillis,
    };

    if (timeDisplayMethod in timeDisplayFunctions) {
        if (timeDisplayMethod === 'unixmillis' || timeDisplayMethod === 'unixsec') {
            // Handle Unix time functions separately as they do not take parameters
            const unixFunction = timeDisplayFunctions[timeDisplayMethod] as UnixTimeFunction;
            const unixTime = unixFunction(); // call the function without parameters
            dtdisplay.hourSlot.textContent = String(unixTime);
            dtdisplay.minuteSlot.textContent = '';
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
        
        dtdisplay.hourSlot.textContent = String(timeDisplayFunctions[timeDisplayMethod](hrs));

        if (timeDisplayMethod === 'words') {
            dtdisplay.minuteSlot.textContent = formatMinutesForWordsDisplay(min);
        } else {
            dtdisplay.minuteSlot.textContent = String(timeDisplayFunctions[timeDisplayMethod](min));
        }

        dtdisplay.secondSlot.textContent = String(timeDisplayFunctions[timeDisplayMethod](sec));

    } else {
        dtdisplay.hourSlot.textContent = String(hrs);
        dtdisplay.minuteSlot.textContent = String(min);
        dtdisplay.secondSlot.textContent = String(sec);
    }

    dtdisplay.indicatorSlot.textContent = ind;


    // Helper function for time display method 'words'
    function formatMinutesForWordsDisplay(min: string) {
        const parsedMinutes = parseInt(min, 10);

        if (parsedMinutes === 0) {
            return 'o\'clock';
        } else if (parsedMinutes < 10) {
            return `oh ${numberToWords.toWords(parsedMinutes)}`;
        } else {
            return numberToWords.toWords(parsedMinutes);
        }
    }
}


// Helper functions for time display methods
function toBinary(value: string) {
    return parseInt(value, 10).toString(2);
}

function toOctal(value: string) {
    return parseInt(value, 10).toString(8);
}

function toHexadecimal(value: string) {
    return parseInt(value, 10).toString(16);
}

function toHexatrigesimal(value: string) {
    return parseInt(value, 10).toString(32);
}

function toWords(value: string): string {
    const num = parseFloat(value);
    if (!isNaN(num) && isFinite(num)) {
        return numberToWords.toWords(num);
    } else {
        return 'Invalid number';
    }
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

    Array.from(menu.dateformselect.children).forEach((child: Element) => {
        if (child instanceof HTMLOptionElement && child.value !== '') {
            child.textContent = time.toFormat(child.value);
        }
    });
}


// Change tab favicon function
function updateFavicon(hour: string) {
    doc.favicon.href = `./icons/clock-time-${hour}.svg`;
}

// Emoji block function
function convertToEmojiBlock(number: { toString: () => string; }) {
    const emojiBlocks = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
    const digits = number.toString().split('');
    const emojiDigits = digits.map((digit: string) => emojiBlocks[parseInt(digit, 10)]);
    return emojiDigits.join('');
}

// Roman numeral converter function
function convertToRomanNumerals(number: string | number): string {
    if (isNaN(Number(number)))
        return 'NaN';
    if (number === 0 || number === '00')
        return String(number);
    const digits = String(+number).split('');
    const key = ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM',
        '', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC',
        '', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'
    ];
    let roman = '',
        i = 3;
    while (i--)
        roman = (key[+digits.pop()! + (i * 10)] || '') + roman;
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