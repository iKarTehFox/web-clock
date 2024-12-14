import { doc, dtdisplay } from './global';
import { numberToWords } from './numberToWords.min';
import { logConsole } from './utils/dom-utils';

// Change tab favicon function
export function updateFavicon(hour: string) {
    doc.favicon.href = `./icons/clock-time-${hour}.svg`;
}

// Time display method functions
// Radix
export function toRadix(value: string, radix: number): string {
    if (radix >= 2 && radix <= 36) {
        return parseInt(value, 10).toString(radix);
    } else {
        logConsole('Radix must be between 2 and 36, inclusive.', 'error');
        return 'ERR';
    }
}

// Words
export function toWords(value: string): string {
    const num = parseFloat(value);
    if (!isNaN(num) && isFinite(num)) {
        return numberToWords.toWords(num);
    } else {
        return 'Invalid number';
    }
}

// Unix epoch milliseconds
export function toUnixMillis() {
    return Date.now();
}

// Unix epoch seconds
export function toUnixSec() {
    return Math.floor(Date.now()/1000);
}

// Emoji block
export function convertToEmojiBlock(number: { toString: () => string; }) {
    const emojiBlocks = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
    const digits = number.toString().split('');
    const emojiDigits = digits.map((digit: string) => emojiBlocks[parseInt(digit, 10)]);
    return emojiDigits.join('');
}

// Roman numerals
export function convertToRomanNumerals(number: string | number): string {
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

// Colon visibility function
export function colonVisibility([c1Vis, c2Vis]: boolean[]): void {
    dtdisplay.colon1.style.display = c1Vis ? 'block' : 'none';
    dtdisplay.colon2.style.display = c2Vis ? 'inline' : 'none';
}