/* eslint-disable @typescript-eslint/no-explicit-any */
/*!
 * Number-To-Words util
 * @version v1.2.4
 * @link https://github.com/marlun78/number-to-words
 * @author Martin Eneqvist (https://github.com/marlun78)
 * @contributors Aleksey Pilyugin (https://github.com/pilyugin),Jeremiah Hall (https://github.com/jeremiahrhall),Adriano Melo (https://github.com/adrianomelo),dmrzn (https://github.com/dmrzn)
 * @license MIT
 */
export const numberToWords = (() => {
    const maxSafeNumber = 9007199254740991;

    function isFiniteNumber(value: any): value is number {
        return typeof value === 'number' && isFinite(value);
    }

    function isSafeNumber(value: number): boolean {
        return Math.abs(value) <= maxSafeNumber;
    }

    const hundredPattern = /(hundred|thousand|(m|b|tr|quadr)illion)$/;
    const teenPattern = /teen$/;
    const yPattern = /y$/;
    const singleDigitsPattern = /(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)$/;
    const ordinalMap: { [key: string]: string } = {
        zero: 'zeroth',
        one: 'first',
        two: 'second',
        three: 'third',
        four: 'fourth',
        five: 'fifth',
        six: 'sixth',
        seven: 'seventh',
        eight: 'eighth',
        nine: 'ninth',
        ten: 'tenth',
        eleven: 'eleventh',
        twelve: 'twelfth'
    };

    function makeOrdinal(word: string): string {
        return hundredPattern.test(word) || teenPattern.test(word) ?
            word + 'th' :
            yPattern.test(word) ?
                word.replace(yPattern, 'ieth') :
                singleDigitsPattern.test(word) ?
                    word.replace(singleDigitsPattern, (match) => ordinalMap[match]) :
                    word;
    }

    const units = 10, hundreds = 100, thousands = 1000, millions = 1000000;
    const billions = 1000000000, trillions = 1000000000000, quadrillions = 1000000000000000;
    const numberWords = [
        'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
        'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
    ];
    const tensWords = [
        'zero', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
    ];

    function toWords(value: number, isOrdinal: boolean = false): string {
        if (!isFiniteNumber(value)) throw new TypeError('Not a finite number: ' + value + ' (' + typeof value + ')');
        if (!isSafeNumber(value)) throw new RangeError('Input is not a safe number, it’s either too large or too small.');
        let result = '';

        function innerToWords(num: number): string {
            if (num === 0) return 'zero';
            if (num < 0) return 'negative ' + innerToWords(-num);
            if (num < 20) return numberWords[num];
            if (num < hundreds) {
                const remainder = num % units;
                const word = tensWords[Math.floor(num / units)];
                return remainder ? word + '-' + numberWords[remainder] : word;
            }
            if (num < thousands) return innerToWords(Math.floor(num / hundreds)) + ' hundred' + (num % hundreds ? ' ' + innerToWords(num % hundreds) : '');
            if (num < millions) return processLargeNumber(num, thousands, 'thousand');
            if (num < billions) return processLargeNumber(num, millions, 'million');
            if (num < trillions) return processLargeNumber(num, billions, 'billion');
            if (num < quadrillions) return processLargeNumber(num, trillions, 'trillion');
            return processLargeNumber(num, quadrillions, 'quadrillion');
        }

        function processLargeNumber(num: number, divisor: number, name: string): string {
            const prefix = innerToWords(Math.floor(num / divisor));
            const remainder = num % divisor;
            return prefix + ' ' + name + (remainder ? ', ' + innerToWords(remainder) : '');
        }

        result = innerToWords(value);
        return isOrdinal ? makeOrdinal(result) : result;
    }

    function toOrdinal(value: number): string {
        if (!isFiniteNumber(value)) throw new TypeError('Not a finite number: ' + value + ' (' + typeof value + ')');
        if (!isSafeNumber(value)) throw new RangeError('Input is not a safe number, it’s either too large or too small.');
        const absValue = Math.abs(value);
        const lastTwoDigits = absValue % 100;
        const lastDigit = absValue % 10;
        if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
            return value + 'th';
        }
        switch (lastDigit) {
        case 1: return value + 'st';
        case 2: return value + 'nd';
        case 3: return value + 'rd';
        default: return value + 'th';
        }
    }

    function toWordsOrdinal(value: number): string {
        return makeOrdinal(toWords(value));
    }

    return { toWords, toOrdinal, toWordsOrdinal };
})();
