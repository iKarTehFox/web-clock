import { doc, menu, dtdisplay } from './utils/dom-elements';
import { numberToWords } from './numberToWords.min';
import * as luxon from 'ts-luxon';
import { logConsole } from './utils/dom-utils';
import * as clock from './time-help';
import { timeRefresh } from './utils/debug';
import { match, P } from 'ts-pattern';

// Default modes
export let cMode = '0';
export let dateFormat = 'D';
export let timeDisplayMethod: string;
const pageLoadTime = getLuxNow('sec');
type TimeFormat = 'sec' | 'millis' | 'obj';

function getLuxNow(format: TimeFormat = 'sec'): number | luxon.DateTime {
    const now = luxon.DateTime.now();
    return {
        'sec': () => now.toUnixInteger(),
        'millis': () => now.toMillis(),
        'obj': () => now
    }[format]();
}

// Clock mode radio
menu.clockmoderadio.forEach((radio) => {
    radio.addEventListener('change', () => {
        const value = String(radio.dataset.value);
        cMode = value;
        logConsole(`Clock mode set to: ${value}`, 'debug');
        updateTime();
    });
});

// Page duration
function updatePageDuration(): void {
    const currentTime = getLuxNow('obj') as luxon.DateTime;
    const duration = currentTime.diff(luxon.DateTime.fromSeconds(pageLoadTime as number), ['hours', 'minutes', 'seconds']);
    
    menu.durationdisplay.textContent = `${Math.floor(duration.hours)}h, ${Math.floor(duration.minutes)}m, and ${Math.floor(duration.seconds)}s`;
}

// Main update time
function updateTime(): void {
    const time = getLuxNow('obj') as luxon.DateTime;
    const hrs = cMode === '0' ? time.toFormat('h') : time.toFormat('HH');
    const min = time.toFormat('mm');
    const sec = time.toFormat('ss');
    const ind = cMode === '0' ? time.toFormat('a') : '';

    // Handle title and favicon updates
    if (menu.titlevischeckbox.checked) {
        clock.updateFavicon(time.toFormat('h'));
        document.title = `Time: ${hrs}:${min}:${sec} ${ind}`;
    } else if (document.title !== 'Online Web Clock' || !doc.favicon.href.endsWith('/icons/clock-time-3.svg')) {
        clock.updateFavicon('3');
        document.title = 'Online Web Clock';
        logConsole('Title and favicon reset...', 'info');
    }

    // Handle seconds progress bar
    if (menu.secondsbarradio[0].checked) {
        const secBarWidth = (Number(sec) / 59) * 100;
        dtdisplay.secondsBar.style.width = `${secBarWidth}%`;
    } else {
        dtdisplay.secondsBar.style.width = '0%';
    }

    let displayHour = '';
    let displayMinute = '';
    let displaySecond = '';
    let displayIndicator = '';

    if (timeDisplayMethod === 'unixmillis' || timeDisplayMethod === 'unixsec') {
        const unixTime = timeDisplayMethod === 'unixmillis' ? clock.toUnixMillis() : clock.toUnixSec();
        displayHour = String(unixTime);
    } else {
        const timeFunction = {
            binary: (value: string) => clock.toRadix(value, 2),
            emoji: clock.convertToEmojiBlock,
            roman: clock.convertToRomanNumerals,
            hexa: (value: string) => clock.toRadix(value, 16),
            hexatri: (value: string) => clock.toRadix(value, 36),
            octal: (value: string) => clock.toRadix(value, 8),
            words: clock.toWords,
            unixcountdown: () => clock.getCountdown(2147483647),
            se_valentines: () => clock.getCountdown(luxon.DateTime.fromObject({
                month: 2,
                day: 14
            })),
            se_christmas: () => clock.getCountdown(luxon.DateTime.fromObject({ 
                month: 12, 
                day: 25 
            })),
            se_newyears: () => clock.getCountdown(luxon.DateTime.fromObject({
                year: time.year + 1, // January 1st of the following year
                month: 1,
                day: 1
            })),
            ii_christmas: () => clock.isItDate('christmas'),
            ii_weekend: () => clock.isItDate('weekend'),
            ii_leapyear: () => clock.isItDate('leapyear'),
        }[timeDisplayMethod];

        // timeDisplayMethod types
        // Will improve in the future...
        const tdmIsIt: boolean = timeDisplayMethod?.startsWith('ii_');

        if (timeFunction) {
            const result = timeFunction(hrs);
            if (Array.isArray(result)) {
                // Handle getCountdown arrays
                [displayHour, displayMinute, displaySecond] = result;
                displayIndicator = '';
                if (tdmIsIt) clock.colonVisibility([false, undefined]);
            } else {
                displayHour = result;
                displayMinute = timeDisplayMethod === 'words' ? formatMinutesForWordsDisplay(min) : timeFunction(min) as string;
                displaySecond = timeFunction(sec) as string;
                displayIndicator = ind;
                clock.colonVisibility([true, undefined]);
            }
        } else {
            displayHour = hrs;
            displayMinute = min;
            displaySecond = sec;
            displayIndicator = ind;
            clock.colonVisibility([true, undefined]);
        }
        
    }

    setClockDisplay([displayHour, displayMinute, displaySecond, displayIndicator]);
}

// Clock DOM update
function setClockDisplay([hour, minute, second, indicator]: [string, string, string, string]): void {
    dtdisplay.hourSlot.textContent = hour;
    dtdisplay.minuteSlot.textContent = minute;
    dtdisplay.secondSlot.textContent = second;
    dtdisplay.indicatorSlot.textContent = indicator;
}

// Helper function for time display method 'words'
function formatMinutesForWordsDisplay(min: string) {
    const parsedMinutes = parseInt(min, 10);

    return match(parsedMinutes)
        .returnType<string>()
        .with(0, () => 'o\'clock')
        .with(P.number.lt(10), () => `oh ${numberToWords.toWords(parsedMinutes)}`)
        .otherwise(() => numberToWords.toWords(parsedMinutes));
}

menu.timemethodselect.addEventListener('change', () => {
    const selectedValue = menu.timemethodselect.value as unknown as number;
    timeDisplayMethod = String(selectedValue);
    logConsole(`Time display method set to: ${selectedValue}`, 'debug');
    updateTime();
});

// Timezone
// Function to get the list of time zones and group them by region
function getTimeZonesByRegion() {
    const timeZones = (Intl as any).supportedValuesOf('timeZone');
    const timeZoneGroups: { [key: string]: string[] } = {};
  
    timeZones.forEach((timeZone: string) => {
        const [region] = timeZone.split('/');
      
        if (!timeZoneGroups[region]) {
            timeZoneGroups[region] = [];
        }
  
        timeZoneGroups[region].push(timeZone);
    });
  
    return timeZoneGroups;
}

// Function to populate the existing select element with time zones
export function populateTimeZoneSelect() {
    const timeZoneGroups = getTimeZonesByRegion();
  
    // Populate the select element with optgroups and options
    Object.keys(timeZoneGroups).forEach((region) => {
        const optGroupElement = document.createElement('optgroup');
        optGroupElement.label = region;
  
        timeZoneGroups[region].forEach((timeZone) => {
            const optionElement = document.createElement('option');
            optionElement.value = timeZone;
            const timeZoneName = timeZone.replace(/_/g,' ');
            optionElement.textContent = timeZoneName;
            // Select current time zone
            if (luxon.DateTime.local().zoneName === timeZone) {
                optionElement.selected = true;
            }
            optGroupElement.appendChild(optionElement);
        });
  
        menu.timezoneselect.appendChild(optGroupElement);
    });
}

menu.timezoneselect.addEventListener('change', function() {
    const timeZone = menu.timezoneselect.value;
    logConsole(`Time zone set to: ${timeZone}`, 'debug');
    luxon.Settings.defaultZoneLike = timeZone;
    updateTime();
    updateDate();
});

// Date
// Date format selector listener
menu.dateformselect.addEventListener('change', function() {
    dateFormat = menu.dateformselect.value;
    logConsole(`Date format set to: ${menu.dateformselect.value}`, 'debug');
    updateDate();
});

export function updateDate() {
    const time = getLuxNow('obj') as luxon.DateTime;
    dtdisplay.date.textContent = time.toFormat(dateFormat);

    Array.from(menu.dateformselect.children).forEach((child: Element) => {
        if (child instanceof HTMLOptionElement && child.value !== '') {
            child.textContent = time.toFormat(child.value);
        }
    });
}

// Initial update, then start intervals
const time = getLuxNow('obj') as luxon.DateTime;
updateTime();
updateDate();
clock.updateFavicon(time.toFormat('h'));

// Sync clock to system time function
let clockInterval: NodeJS.Timeout | null = null; // Variable to store the interval ID

// Function to start the clock based on the selected method
function startClock() {
    // Clear any existing interval
    if (clockInterval) {
        clearInterval(clockInterval);
    }

    if (menu.legacyrefreshcheckbox.checked) {
        startOldClock();
    } else {
        startNewClock();
    }
}

// Function to start the new clock method
function startNewClock() {
    const timeToNextSecond = 1000 - Number(getLuxNow('millis')) % 1000;

    setTimeout(() => {
        updateTime();
        updatePageDuration();

        // Start the regular interval updates
        let lastUpdateTime = Date.now();

        clockInterval = setInterval(() => {
            updateTime();
            updatePageDuration();
            logConsole('Time and page duration updated...', 'info');

            const now = Date.now();
            const elapsed = now - lastUpdateTime;
            lastUpdateTime = now;

            const drift = elapsed - 1000;

            // Add a maximum drift threshold, e.g. 1000ms
            const cappedDrift = Math.max(Math.min(drift, 1000), -1000);

            if (Math.abs(drift) > 150) {
                logConsole(`Time drift detected: ${drift > 0 ? '+':''}${drift}ms.${Math.abs(drift) > 1000 ? ` Capped to ${cappedDrift}ms` : ''}`, 'debug');
                clearInterval(clockInterval!);
                setTimeout(startNewClock, 1000 - cappedDrift);
            }
        }, 1000);
    }, timeToNextSecond);
}

// Function to start the old clock method
function startOldClock() {
    clockInterval = setInterval(() => {
        updateTime();
        updatePageDuration();
        logConsole('Time and page duration updated (Legacy method)...', 'info');
    }, timeRefresh) as unknown as NodeJS.Timeout;
}

// Listener for the legacy refresh checkbox
menu.legacyrefreshcheckbox.addEventListener('change', startClock);

startClock();

setInterval(function() {
    updateDate();
    logConsole('Date updated...', 'info');
}, 15000);
