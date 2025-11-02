import { doc, menu, dtdisplay, panel } from './utils/dom-elements';
import * as numberToWords from 'number-to-words';
import * as luxon from 'ts-luxon';
import { logConsole } from './utils/dom-utils';
import * as clock from './time-help';
import { match, P } from 'ts-pattern';
import i18next from 'i18next';
import { on, once, emit, AppEvents } from './system/event-bus';

// Default modes
export let cMode = '0';
export let dateFormat = 'D';
export let timeDisplayMethod: string;
let lastTime: Array<string>;
let lastDate: string;
let lastTimeDisplayMethod: string;
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

// Cache for title/favicon state
let lastTitleVisState = false;

// Main update time
function updateTime(): void {
    const time = getLuxNow('obj') as luxon.DateTime;
    const hrs = cMode === '0' ? time.toFormat('h') : time.toFormat('HH');
    const min = time.toFormat('mm');
    const sec = time.toFormat('ss');
    const ind = cMode === '0' ? time.toFormat('a') : '';

    // Handle title and favicon updates
    const isTitleVisChecked = menu.titlevischeckbox.checked;
    if (isTitleVisChecked) {
        clock.updateFavicon(time.toFormat('h'));
        document.title = `Time: ${hrs}:${min}:${sec} ${ind}`;
    } else if (lastTitleVisState !== isTitleVisChecked) {
        // Only reset once when unchecked
        clock.updateFavicon('3');
        document.title = 'Online Web Clock';
        logConsole('Title and favicon reset...', 'info');
    }
    lastTitleVisState = isTitleVisChecked;

    // Handle time bar (cache value to avoid repeated property access)
    const timeBarValue = menu.timebarselect.value;
    if (timeBarValue !== 'tbarNone') {
        clock.timeBarUtil(timeBarValue, time);
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
        
        // Only update UI state when time display method changes
        if (lastTimeDisplayMethod !== timeDisplayMethod) {
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
        }
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

        // Only update UI state when time display method changes
        if (lastTimeDisplayMethod !== timeDisplayMethod) {
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
    updateDate(time);
    
    // Track last display method to avoid redundant UI updates
    lastTimeDisplayMethod = timeDisplayMethod;
    
    // Notify timezone windows to update
    emit(AppEvents.CLOCK_UPDATED, { time });
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
    // Get current zone before scheduling async work to avoid overhead
    const currentZone = luxon.DateTime.local().zoneName;
    
    // Use requestIdleCallback for better performance, fallback to setTimeout
    const scheduleWork = (callback: () => void) => {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(callback, { timeout: 2000 });
        } else {
            setTimeout(callback, 0);
        }
    };
    
    scheduleWork(() => {
        const timeZoneGroups = getTimeZonesByRegion();
        const fragment = document.createDocumentFragment();
      
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
                if (currentZone === timeZone) {
                    optionElement.selected = true;
                }
                optGroupElement.appendChild(optionElement);
            });
      
            fragment.appendChild(optGroupElement);
        });
        
        // Single DOM update
        menu.timezoneselect.appendChild(fragment);
        logConsole('Timezone select populated', 'debug');
    });
}

export function refreshDateFormatOptions(timeObj: luxon.DateTime = getLuxNow('obj') as luxon.DateTime) {
    Array.from(menu.dateformselect.querySelectorAll('option')).forEach((option: HTMLOptionElement) => {
        if (option.value !== '') {
            option.textContent = timeObj.toFormat(option.value);
        }
    });
}

export function updateDate(timeObj: luxon.DateTime = getLuxNow('obj') as luxon.DateTime): void {
    const newDate = timeObj.toFormat(dateFormat);
    if (lastDate === newDate) return;

    dtdisplay.date.textContent = newDate;
    lastDate = newDate;
    // Note: refreshDateFormatOptions is only called on language change or explicit updates
    // Removed from here to avoid unnecessary recalculations on every date change
}

// Initial update, then start intervals
const initTime = getLuxNow('obj') as luxon.DateTime;
clock.updateFavicon(initTime.toFormat('h'));
updateTime();

// Initial i18n listener for the first load
once('i18nFinishedUpdate', () => {
    refreshDateFormatOptions();
    logConsole('Initial date format options refreshed after i18n setup', 'debug');
});

// i18n listener
i18next.on('languageChanged', () => {
    // Wait for DOM updates from i18n first
    once('i18nFinishedUpdate', () => {
        // Update dateFormat to match the newly translated value of the selected option
        const selectedOption = menu.dateformselect.options[menu.dateformselect.selectedIndex];
        if (selectedOption && selectedOption.value !== '') {
            dateFormat = selectedOption.value;
            logConsole(`Updated dateFormat to translated value: ${dateFormat}`, 'debug');
        }
        
        refreshDateFormatOptions();
    });
});

// Clock interval management
let clockInterval: NodeJS.Timeout;

on('startClock', (data) => {
    if (!clockInterval) {
        startClock();
        logConsole(`Clock interval started. Source: ${data?.sourcereason}`, 'info');
    }
});

on('stopClock', (data) => {
    if (clockInterval) {
        clearTimeout(clockInterval);
        clockInterval = undefined;
        logConsole(`Clock interval stopped. Source: ${data?.sourcereason}`, 'info');
    }
});

// Function to start clock interval
function startClock() {
    // Initial update
    updateTime();
    updatePageDuration();
    logConsole('Clock interval started...', 'info');
    
    // Function to schedule the next update
    function scheduleNextUpdate() {
        // Calculate time to next second
        const timeToNextSecond = 1000 - Number(getLuxNow('millis')) % 1000;
        
        // Schedule next update
        clockInterval = setTimeout(() => {
            // Update the clock
            updateTime();
            updatePageDuration();

            logConsole('Time, date, and page duration updated...', 'debug', false, false);
            
            // Schedule the next update
            scheduleNextUpdate();
        }, timeToNextSecond);
    }
    
    // Start the scheduling loop
    scheduleNextUpdate();
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
                .otherwise(() => {});
        })
        .otherwise(() => {});
});

panel.section.dt.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const buttonElement = target.tagName === 'BUTTON' ? target : target.closest('button');

    if (buttonElement) {
        match(buttonElement.id)
            .with('resetTZBtn', () => {
                luxon.Settings.defaultZoneLike = 'system';
                menu.timezoneselect.value = luxon.DateTime.local().zoneName;
                logConsole('Time zone reset to system default', 'info');
                updateTime();
                updateDate();
            })
            .otherwise(() => {});
    }
});

startClock();
