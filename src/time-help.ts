import * as luxon from 'ts-luxon';
import { doc, menu, dtdisplay, panel } from './utils/dom-elements';
import { numberToWords } from './numberToWords.min';
import { logConsole } from './utils/dom-utils';
import { match } from 'ts-pattern';

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

// Countdown/time duration function
export function getCountdown(target: luxon.DateTime | number, eventName: string): [string, string, string, string] {
    const now = luxon.DateTime.now();
    const targetDateTime = typeof target === 'number' 
        ? luxon.DateTime.fromSeconds(target)
        : target;
    
    const diff = targetDateTime.diff(now, ['days', 'hours', 'minutes', 'seconds']);
    const dayhour = Math.abs(Math.floor(diff.days)) > 0 ? `${Math.abs(Math.floor(diff.days))}d:${Math.abs(Math.floor(diff.hours))}h` : `${Math.abs(Math.floor(diff.hours))}h`;
    const isPast = now > targetDateTime ? `since ${eventName}` : `until ${eventName}`;
    
    return [
        dayhour,
        `${Math.abs(Math.floor(diff.minutes))}m`,
        `${Math.abs(Math.floor(diff.seconds))}s`,
        isPast 
    ];
}

export function isItDate(dateType: 'christmas' | 'weekend' | 'leapyear'): [string, string, string, string] {
    const now = luxon.DateTime.now();
    let isMatch = false;
    
    return match(dateType)
        .returnType<[string, string, string, string]>()
        .with('christmas', () => {
            isMatch = now.month === 12 && now.day === 25;
            return ['', isMatch ? 'It\'s Christmas!' : 'Not Christmas', '', ''];
        })
        .with('weekend', () => {
            isMatch = now.weekday >= 6; // 6 = Saturday, 7 = Sunday
            return ['', isMatch ? 'It\'s the weekend!' : 'Not the weekend', '', ''];
        })
        .with('leapyear', () => {
            isMatch = now.isInLeapYear;
            return ['', isMatch ? 'It\'s a leap year!' : 'Not a leap year', '', ''];
        })
        .exhaustive();
}
// Element display
// Colon visibility function
export function colonVisibility([c1Vis, c2Vis]: (boolean | undefined)[]): void {
    if (c1Vis !== undefined) dtdisplay.colon1.style.display = c1Vis ? '' : 'none';
    if (c2Vis !== undefined) dtdisplay.colon2.style.display = c2Vis ? '' : 'none';
}

export function timeBarUtil(type: string, time: luxon.DateTime) {
    match(type)
        .with('tbarWeekday', () => { // Week progress
            dtdisplay.timeBar.style.width = (time.weekday / 7) * 100 + '%';
        })
        .with('tbarMonth', () => { // Month progress
            dtdisplay.timeBar.style.width = (time.day / time.daysInMonth) * 100 + '%';
        })
        .with('tbarDay', () => { // Day progress
            const minInDay = (time.hour * 60) + time.minute;
            dtdisplay.timeBar.style.width = (minInDay / 1439) * 100 + '%';
        })
        .with('tbarHour', () => { // Hour progress
            dtdisplay.timeBar.style.width = (time.minute / 59) * 100 + '%';
        })
        .with('tbarSec', () => { // Minute progress
            dtdisplay.timeBar.style.width = (time.second / 59) * 100 + '%';
        })
        .otherwise(() => {});
}

// DT listener
panel.section.dt.addEventListener('change', (e) => {
    const target = e.target as HTMLElement;
    
    match(target.tagName)
        .with('SELECT', () => {
            const selectelement = target as HTMLSelectElement;
            match(selectelement.id)
                .with('timeBarSelect', () => {
                    if (selectelement.value === 'tbarNone') {
                        dtdisplay.timeBar.style.display = 'none';
                        menu.bordertyperadio.forEach((btn) => {
                            btn.disabled = false;
                        });
                        logConsole('Time bar hidden', 'debug');
                    } else {
                        dtdisplay.timeBar.style.display = 'block';
                        menu.bordertyperadio.forEach((btn) => {
                            btn.disabled = true;
                            if (btn.id === 'btyD') {
                                btn.checked = true;
                                btn.dispatchEvent(new Event('change', { bubbles: true }));
                            }
                        });
                        logConsole(`Time bar set to: ${menu.timebarselect.value}`, 'debug');
                    }
                })
                .otherwise(() => {});
        })
        .with('INPUT', () => {
            const inputelement = target as HTMLInputElement;
            match([inputelement.type, inputelement.name])
                .with(['radio', 'seconds-vis-radio'], () => {
                    const value = String(inputelement.dataset.value);
                    colonVisibility([undefined, (value == 'none' ? false : true)]);
                    dtdisplay.secondSlot.style.display = value as string;
                    logConsole(`Seconds visibility set to: ${value == 'none' ? 'hidden' : 'visible'}`, 'debug');
                })
                .with(['radio', 'date-position-radio'], () => {
                    const value = inputelement.dataset.value;
                    dtdisplay.date.style.textAlign = value as string;
                    logConsole(`Date alignment set to: ${value}`, 'debug');
                })
                .otherwise(() => {});
        })
        .otherwise(() => {});
});
