import { doc, menu, dtdisplay, panel } from './utils/dom-elements';
import * as numberToWords from 'number-to-words';
import * as luxon from 'ts-luxon';
import { logConsole } from './utils/dom-utils';
import * as clock from './time-help';
import { timeRefresh } from './utils/debug';
import { match, P } from 'ts-pattern';
import i18next from 'i18next';
import Bowser from 'bowser';

// Default modes
export let cMode = '0';
export let dateFormat = 'D';
export let timeDisplayMethod: string;
let lastTime: Array<string>;
let lastDate: string;
const pageLoadTime = getLuxNow('sec');
type TimeFormat = 'sec' | 'millis' | 'obj';
const browserInfo = Bowser.parse(window.navigator.userAgent);

function getLuxNow(format: TimeFormat = 'sec'): number | luxon.DateTime {
    const now = luxon.DateTime.now();
    return {
        'sec': () => now.toUnixInteger(),
        'millis': () => now.toMillis(),
        'obj': () => now
    }[format]();
}

// Page duration
function updatePageDuration(): void {
    const currentTime = getLuxNow('obj') as luxon.DateTime;
    const duration = currentTime.diff(luxon.DateTime.fromSeconds(pageLoadTime as number), ['days', 'hours', 'minutes', 'seconds']);
    
    const days = Math.floor(duration.days);
    const hours = Math.floor(duration.hours);
    const minutes = Math.floor(duration.minutes);
    const seconds = Math.floor(duration.seconds);

    let durationText: string;
    if (days < 0 || hours < 0 || minutes < 0 || seconds < 0) {
        durationText = i18next.t('menu.misc.pageduration.negativetime');
    } else if (days > 0) { // Day counter
        durationText = i18next.t('menu.misc.pageduration.daycount', { 0: days, 1: hours, 2: minutes });
    } else if (hours > 0) { // Hour counter
        durationText = i18next.t('menu.misc.pageduration.hourcount', { 0: hours, 1: minutes, 2: seconds });
    } else if (minutes > 0) { // Minute counter
        durationText = i18next.t('menu.misc.pageduration.minutecount', { 0: minutes, 1: seconds });
    } else { // Second counter
        durationText = i18next.t('menu.misc.pageduration.secondcount', { 0: seconds });
    }
    
    menu.durationdisplay.textContent = durationText;
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

    // Handle time bar
    if (menu.timebarselect.value !== 'tbarNone') {
        clock.timeBarUtil(menu.timebarselect.value, time);
    } else {
        dtdisplay.timeBar.style.width = '0%';
    }

    let displayHour = '';
    let displayMinute = '';
    let displaySecond = '';
    let displayIndicator = '';

    if (timeDisplayMethod === 'unixmillis' || timeDisplayMethod === 'unixsec') {
        const unixTime = timeDisplayMethod === 'unixmillis' ? clock.toUnixMillis() : clock.toUnixSec();
        displayHour = String(unixTime);
        // Set colon visibility
        clock.colonVisibility([false, undefined]);
        menu.secondsvisradio.forEach((radio) => {
            if (radio.id === 'sviN') {
                radio.checked = true;
            } else {
                radio.checked = false;
            }
            radio.dispatchEvent(new Event('change', { bubbles: true }));
            radio.disabled = true;
        });
    } else {
        const timeFunction = {
            binary: (value: string) => clock.toRadix(value, 2),
            emoji: clock.convertToEmojiBlock,
            roman: clock.convertToRomanNumerals,
            hexa: (value: string) => clock.toRadix(value, 16),
            hexatri: (value: string) => clock.toRadix(value, 36),
            octal: (value: string) => clock.toRadix(value, 8),
            words: clock.toWords,
            unixcountdown: () => clock.getCountdown(2147483647, i18next.t('time.countdown.event.32bit')),
            se_valentines: () => clock.getCountdown(luxon.DateTime.fromObject({
                month: 2,
                day: 14
            }), i18next.t('time.countdown.event.valentines')),
            se_christmas: () => clock.getCountdown(luxon.DateTime.fromObject({ 
                month: 12, 
                day: 25 
            }), i18next.t('time.countdown.event.christmas')),
            se_newyears: () => clock.getCountdown(luxon.DateTime.fromObject({
                year: time.year + 1, // January 1st of the following year
                month: 1,
                day: 1
            }), i18next.t('time.countdown.event.newyear')),
            ii_christmas: () => clock.isItDate('christmas'),
            ii_weekend: () => clock.isItDate('weekend'),
            ii_leapyear: () => clock.isItDate('leapyear'),
        }[timeDisplayMethod];

        // Handle colon visibility
        const tdmNoColon: boolean = ['ii_christmas','ii_weekend','ii_leapyear'].includes(timeDisplayMethod);
        if (tdmNoColon) {
            clock.colonVisibility([false, undefined]);
            menu.secondsvisradio.forEach((radio) => {
                if (radio.id === 'sviN') {
                    radio.checked = true;
                } else {
                    radio.checked = false;
                }
                radio.dispatchEvent(new Event('change'));
                radio.disabled = true;
            });
        } else {
            clock.colonVisibility([true, undefined]);
            menu.secondsvisradio.forEach((radio) => {
                radio.disabled = false;
            });
        }

        if (timeFunction) {
            const result = timeFunction(hrs);
            if (Array.isArray(result)) {
                // Handle getCountdown arrays
                [displayHour, displayMinute, displaySecond, displayIndicator] = result;
            } else {
                displayHour = result;
                displayMinute = timeDisplayMethod === 'words' ? formatMinutesForWordsDisplay(min) : timeFunction(min) as string;
                displaySecond = timeFunction(sec) as string;
                displayIndicator = ind;
            }
        } else {
            displayHour = hrs;
            displayMinute = min;
            displaySecond = sec;
            displayIndicator = ind;
        }
        
    }

    setClockDisplay([displayHour, displayMinute, displaySecond, displayIndicator]);
    updateDate();
}

// Clock DOM update
function setClockDisplay([hour, minute, second, indicator]: [string, string, string, string]): void {
    // Prevent unnecessary updates
    if (lastTime && 
        hour === lastTime[0] && 
        minute === lastTime[1] && 
        second === lastTime[2] && 
        indicator === lastTime[3]) {
        return;
    }

    dtdisplay.hourSlot.textContent = hour;
    dtdisplay.minuteSlot.textContent = minute;
    dtdisplay.secondSlot.textContent = second;
    dtdisplay.indicatorSlot.textContent = indicator;

    lastTime = [hour, minute, second, indicator];
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

export function updateDate() {
    const time = getLuxNow('obj') as luxon.DateTime;
    const newDate = time.toFormat(dateFormat);
    if (lastDate === newDate) return;

    dtdisplay.date.textContent = newDate;
    lastDate = newDate;

    Array.from(menu.dateformselect.querySelectorAll('option')).forEach((option: HTMLOptionElement) => {
        if (option.value !== '') {
            option.textContent = time.toFormat(option.value);
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
        startExperimentalClock();
    }
}

// Function to start the new clock method
function startNewClock() {
    const timeToNextSecond = 1000 - Number(getLuxNow('millis')) % 1000;

    setTimeout(() => {
        updateTime();
        updatePageDuration();

        // Set initial reference point
        const startTime = performance.now();
        let expectedTime = startTime + 1000; // Next expected tick
        let lastExecutionTime = 0; // Track execution time

        clockInterval = setInterval(() => {
            // Measure drift before any operations
            const beforeExecution = performance.now();
            const drift = beforeExecution - expectedTime;

            // Update after calculation
            updateTime();
            updatePageDuration();
            logConsole('Time, date, and page duration updated...', 'info');

            // Calculate execution time
            const afterExecution = performance.now();
            const executionTime = afterExecution - beforeExecution;
            lastExecutionTime = executionTime;

            // Cap drift at ±1000ms
            const cappedDrift = Math.max(Math.min(drift, 1000), -1000);

            // Set browser-specific threshold
            const driftThreshold = browserInfo.engine.name?.includes('Blink') 
                ? 150 
                : Math.max(200, lastExecutionTime * 1.5);

            if (Math.abs(drift) > driftThreshold) {
                logConsole(`Time drift detected: ${drift > 0 ? '+':''}${drift}ms.${Math.abs(drift) > 1000 ? ` Capped to ${cappedDrift}ms` : ''} (Execution: ${executionTime.toFixed(2)}ms)`, 'debug');
                clearInterval(clockInterval!);
                
                // Adjust next start time by considering execution time
                // This helps prevent cascading drift
                const adjustedDelay = Math.max(0, 1000 - cappedDrift - Math.min(executionTime, 100));
                setTimeout(startNewClock, adjustedDelay);
            }

            // Update expected time for next tick
            expectedTime += 1000;
        }, 1000);
    }, timeToNextSecond);
}

// Function to start experimental clock
function startExperimentalClock() {
    // Initial update
    updateTime();
    updatePageDuration();
    logConsole('Experimental clock started...', 'info');
    
    // Function to schedule the next update
    function scheduleNextUpdate() {
        // Calculate time to next second
        const timeToNextSecond = 1000 - Number(getLuxNow('millis')) % 1000;
        
        // Schedule next update
        clockInterval = setTimeout(() => {
            // Update the clock
            updateTime();
            updatePageDuration();

            logConsole('Time, date, and page duration updated... (Experimental method)', 'debug');
            
            // Schedule the next update
            scheduleNextUpdate();
        }, timeToNextSecond);
    }
    
    // Start the scheduling loop
    scheduleNextUpdate();
}

// Function to start the old clock method
function startOldClock() {
    clockInterval = setInterval(() => {
        updateTime();
        updatePageDuration();
        logConsole('Time, date, and page duration updated... (Legacy method)', 'info');
    }, timeRefresh) as unknown as NodeJS.Timeout;
}

// DT listener
panel.section.dt.addEventListener('change', (e) => {
    const target = e.target as HTMLElement;
    
    match(target.tagName)
        .with('SELECT', () => {
            const selectelement = target as HTMLSelectElement;
            match(selectelement.id)
                .with('timeMethodSelect', () => {
                    const selectedValue = selectelement.value as unknown as number;
                    timeDisplayMethod = String(selectedValue);
                    logConsole(`Time display method set to: ${selectedValue}`, 'debug');
                    updateTime();
                })
                .with('timeZoneSelect', () => {
                    luxon.Settings.defaultZoneLike = selectelement.value;
                    logConsole(`Time zone set to: ${selectelement.value}`, 'debug');
                    updateTime();
                    updateDate();
                })
                .with('dateFormatSelect', () => {
                    dateFormat = selectelement.value;
                    logConsole(`Date format set to: ${selectelement.value}`, 'debug');
                    updateDate();
                })
                .otherwise(() => {});
        })
        .with('INPUT', () => {
            const inputelement = target as HTMLInputElement;
            match([inputelement.type, inputelement.name])
                .with(['radio', 'clock-mode-radio'], () => {
                    cMode = String(inputelement.dataset.value);
                    logConsole(`Clock mode set to: ${inputelement.dataset.value}`, 'debug');
                    updateTime();
                })
                .with(['checkbox', 'legacy-refresh-checkbox'], () => {
                    startClock();
                })
                .otherwise(() => {});
        })
        .otherwise(() => {});
});

startClock();
