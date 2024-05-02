import { Duration, DurationLike } from "./duration";
import { Interval } from "./interval";
import { Locale } from "./impl/locale";
import { Zone } from "./zone";
import { ToISOTimeOptions, ToISOFormat, ToSQLOptions, ToRelativeOptions, ToRelativeCalendarOptions, SetZoneOptions, GregorianDateTime, WeekDateTime, OrdinalDateTime, GenericDateTime, GenericDateTimePlurals, DateTimeOptions, ExplainedFormat } from "./types/datetime";
import { DurationUnit, DurationOptions, DurationObject } from "./types/duration";
import { LocaleOptions, CalendarSystem, NumberingSystem } from "./types/locale";
import { ZoneLike } from "./types/zone";
import { Invalid } from "./types/invalid";
import Intl from "./types/intl-next";
/**
 * A DateTime is an immutable data structure representing a specific date and time and accompanying methods. It contains class and instance methods for creating, parsing, interrogating, transforming, and formatting them.
 *
 * A DateTime consists of:
 * * A timestamp. Each DateTime instance refers to a specific millisecond of the Unix epoch.
 * * A time zone. Each instance is considered in the context of a specific zone (by default the system's time zone).
 * * Configuration properties that effect how output strings are formatted, such as `locale`, `numberingSystem`, and `outputCalendar`.
 *
 * Here is a brief overview of the most commonly used functionality it provides:
 *
 * * **Creation**: To create a DateTime from its components, use one of its factory class methods: {@link DateTime.local}, {@link DateTime.utc}, and (most flexibly) {@link DateTime.fromObject}. To create one from a standard string format, use {@link DateTime.fromISO}, {@link DateTime.fromHTTP}, and {@link DateTime.fromRFC2822}. To create one from a custom string format, use {@link DateTime.fromFormat}. To create one from a native JS date, use {@link DateTime.fromJSDate}.
 * * **Gregorian calendar and time**: To examine the Gregorian properties of a DateTime individually (i.e. as opposed to collectively through {@link DateTime#toObject}), use the {@link DateTime#year}, {@link DateTime#month},
 * {@link DateTime#day}, {@link DateTime#hour}, {@link DateTime#minute}, {@link DateTime#second}, {@link DateTime#millisecond} accessors.
 * * **Week calendar**: For ISO week calendar attributes, see the {@link DateTime#weekYear}, {@link DateTime#weekNumber}, and {@link DateTime#weekday} accessors.
 * * **Configuration** See the {@link DateTime#locale} and {@link DateTime#numberingSystem} accessors.
 * * **Transformation**: To transform the DateTime into other DateTimes, use {@link DateTime#set}, {@link DateTime#reconfigure}, {@link DateTime#setZone}, {@link DateTime#setLocale}, {@link DateTime.plus}, {@link DateTime#minus}, {@link DateTime#endOf}, {@link DateTime#startOf}, {@link DateTime#toUTC}, and {@link DateTime#toLocal}.
 * * **Output**: To convert the DateTime to other representations, use the {@link DateTime#toRelative}, {@link DateTime#toRelativeCalendar}, {@link DateTime#toJSON}, {@link DateTime#toISO}, {@link DateTime#toHTTP}, {@link DateTime#toObject}, {@link DateTime#toRFC2822}, {@link DateTime#toString}, {@link DateTime#toLocaleString}, {@link DateTime#toFormat}, {@link DateTime#toMillis} and {@link DateTime#toJSDate}.
 *
 * There's plenty others documented below. In addition, for more information on subtler topics like internationalization, time zones, alternative calendars, validity, and so on, see the external documentation.
 */
export declare class DateTime {
    /**
     * {@link DateTime#toLocaleString} format like 'October 14, 1983, 9:30 AM EDT'. Only 12-hour if the locale is.
     */
    static readonly DATETIME_FULL: Pick<Intl.DateTimeFormatOptions, "day" | "hour" | "minute" | "month" | "timeZoneName" | "year">;
    /**
     * {@link DateTime#toLocaleString} format like 'October 14, 1983, 9:30:33 AM EDT'. Only 12-hour if the locale is.
     */
    static readonly DATETIME_FULL_WITH_SECONDS: Pick<Intl.DateTimeFormatOptions, "day" | "hour" | "minute" | "month" | "second" | "timeZoneName" | "year">;
    /**
     * {@link DateTime#toLocaleString} format like 'Friday, October 14, 1983, 9:30 AM Eastern Daylight Time'. Only 12-hour if the locale is.
     */
    static readonly DATETIME_HUGE: Pick<Intl.DateTimeFormatOptions, "day" | "hour" | "minute" | "month" | "timeZoneName" | "weekday" | "year">;
    /**
     * {@link DateTime#toLocaleString} format like 'Friday, October 14, 1983, 9:30:33 AM Eastern Daylight Time'. Only 12-hour if the locale is.
     */
    static readonly DATETIME_HUGE_WITH_SECONDS: Pick<Intl.DateTimeFormatOptions, "day" | "hour" | "minute" | "month" | "second" | "timeZoneName" | "weekday" | "year">;
    /**
     * {@link DateTime#toLocaleString} format like 'Oct 14, 1983, 9:30 AM'. Only 12-hour if the locale is.
     */
    static readonly DATETIME_MED: Pick<Intl.DateTimeFormatOptions, "day" | "hour" | "minute" | "month" | "year">;
    /**
     * {@link DateTime#toLocaleString} format like 'Oct 14, 1983, 9:30:33 AM'. Only 12-hour if the locale is.
     */
    static readonly DATETIME_MED_WITH_SECONDS: Pick<Intl.DateTimeFormatOptions, "day" | "hour" | "minute" | "month" | "second" | "year">;
    /**
     * {@link DateTime#toLocaleString} format like 'Fri, 14 Oct 1983, 9:30 AM'. Only 12-hour if the locale is.
     */
    static readonly DATETIME_MED_WITH_WEEKDAY: Pick<Intl.DateTimeFormatOptions, "day" | "hour" | "minute" | "month" | "weekday" | "year">;
    /**
     * {@link DateTime#toLocaleString} format like "10/14/1983, 9:30 AM". Only 12-hour if the locale is.
     */
    static readonly DATETIME_SHORT: Pick<Intl.DateTimeFormatOptions, "day" | "hour" | "minute" | "month" | "year">;
    /**
     * {@link DateTime#toLocaleString} format like "10/14/1983, 9:30:33 AM". Only 12-hour if the locale is.
     */
    static readonly DATETIME_SHORT_WITH_SECONDS: Pick<Intl.DateTimeFormatOptions, "day" | "hour" | "minute" | "month" | "second" | "year">;
    /**
     * {@link DateTime#toLocaleString} format like 'October 14, 1983'
     */
    static readonly DATE_FULL: Pick<Intl.DateTimeFormatOptions, "day" | "month" | "year">;
    /**
     * {@link DateTime#toLocaleString} format like 'Friday, October 14, 1983'
     */
    static readonly DATE_HUGE: Pick<Intl.DateTimeFormatOptions, "day" | "month" | "weekday" | "year">;
    /**
     * {@link DateTime#toLocaleString} format like 'Oct 14, 1983'
     */
    static readonly DATE_MED: Pick<Intl.DateTimeFormatOptions, "day" | "month" | "year">;
    /**
     * {@link DateTime#toLocaleString} format like 'Fri, Oct 14, 1983'
     */
    static readonly DATE_MED_WITH_WEEKDAY: Pick<Intl.DateTimeFormatOptions, "day" | "month" | "weekday" | "year">;
    /**
     * {@link DateTime#toLocaleString} format like 10/14/1983
     */
    static readonly DATE_SHORT: Pick<Intl.DateTimeFormatOptions, "day" | "month" | "year">;
    /**
     * {@link DateTime#toLocaleString} format like "09:30", always 24-hour.
     */
    static readonly TIME_24_SIMPLE: Pick<Intl.DateTimeFormatOptions, "hour" | "minute" | "hourCycle">;
    /**
     * {@link DateTime#toLocaleString} format like "09:30:23 Eastern Daylight Time", always 24-hour.
     */
    static readonly TIME_24_WITH_LONG_OFFSET: Pick<Intl.DateTimeFormatOptions, "hour" | "minute" | "second" | "timeZoneName" | "hourCycle">;
    /**
     * {@link DateTime#toLocaleString} format like "09:30:23", always 24-hour.
     */
    static readonly TIME_24_WITH_SECONDS: Pick<Intl.DateTimeFormatOptions, "hour" | "minute" | "second" | "hourCycle">;
    /**
     * {@link DateTime#toLocaleString} format like "09:30:23 EDT", always 24-hour.
     */
    static readonly TIME_24_WITH_SHORT_OFFSET: Pick<Intl.DateTimeFormatOptions, "hour" | "minute" | "second" | "timeZoneName" | "hourCycle">;
    /**
     * {@link DateTime#toLocaleString} format like "09:30 AM". Only 12-hour if the locale is.
     */
    static readonly TIME_SIMPLE: Pick<Intl.DateTimeFormatOptions, "hour" | "minute">;
    /**
     * {@link DateTime#toLocaleString} format like "09:30:23 AM Eastern Daylight Time". Only 12-hour if the locale is.
     */
    static readonly TIME_WITH_LONG_OFFSET: Pick<Intl.DateTimeFormatOptions, "hour" | "minute" | "second" | "timeZoneName">;
    /**
     * {@link DateTime#toLocaleString} format like "09:30:23 AM". Only 12-hour if the locale is.
     */
    static readonly TIME_WITH_SECONDS: Pick<Intl.DateTimeFormatOptions, "hour" | "minute" | "second">;
    /**
     * {@link DateTime#toLocaleString} format like "09:30:23 AM EDT". Only 12-hour if the locale is.
     */
    static readonly TIME_WITH_SHORT_OFFSET: Pick<Intl.DateTimeFormatOptions, "hour" | "minute" | "second" | "timeZoneName">;
    /**
     * Get the day of the month (1-30ish).
     * @example DateTime.local(2017, 5, 25).day //=> 25
     */
    get day(): number;
    /**
     * Returns the number of days in this DateTime's month
     * @example DateTime.local(2016, 2).daysInMonth //=> 29
     * @example DateTime.local(2016, 3).daysInMonth //=> 31
     */
    get daysInMonth(): number;
    /**
     * Returns the number of days in this DateTime's year
     * @example DateTime.local(2016).daysInYear //=> 366
     * @example DateTime.local(2013).daysInYear //=> 365
     */
    get daysInYear(): number;
    /**
     * Get the hour of the day (0-23).
     * @example DateTime.local(2017, 5, 25, 9).hour //=> 9
     */
    get hour(): number;
    /**
     * Returns an explanation of why this Duration became invalid, or null if the Duration is valid
     */
    get invalidExplanation(): string | void;
    /**
     * Returns an error code if this Duration became invalid, or null if the Duration is valid
     */
    get invalidReason(): string | void;
    /**
     * Get whether the DateTime is in a DST.
     */
    get isInDST(): boolean;
    /**
     * Returns true if this DateTime is in a leap year, false otherwise
     * @example DateTime.local(2016).isInLeapYear //=> true
     * @example DateTime.local(2013).isInLeapYear //=> false
     */
    get isInLeapYear(): boolean;
    /**
     * Get whether this zone's offset ever changes, as in a DST.
     */
    get isOffsetFixed(): boolean;
    /**
     * Returns whether the DateTime is valid. Invalid DateTimes occur when:
     * * The DateTime was created from invalid calendar information, such as the 13th month or February 30
     * * The DateTime was created by an operation on another invalid date
     */
    get isValid(): boolean;
    /**
     * Returns true if this date is on a weekend according to the locale, false otherwise
     * @returns {boolean}
     */
    get isWeekend(): boolean;
    /**
     * Get a clone of the Locale instance of a DateTime.
     */
    get loc(): Locale;
    /**
     * Get the week number of the week year according to the locale. Different locales assign week numbers differently,
     * because the week can start on different days of the week (see localWeekday) and because a different number of days
     * is required for a week to count as the first week of a year.
     */
    get localWeekNumber(): number;
    /**
     * Get the week year according to the locale. Different locales assign week numbers (and therefor week years)
     * differently, see localWeekNumber.
     */
    get localWeekYear(): number;
    /**
     * Get the day of the week according to the locale.
     * 1 is the first day of the week and 7 is the last day of the week.
     * If the locale assigns Sunday as the first day of the week, then a date which is a Sunday will return 1,
     */
    get localWeekday(): number;
    /**
     * Get the locale of a DateTime, such 'en-GB'. The locale is used when formatting the DateTime
     */
    get locale(): string;
    /**
     * Get the millisecond of the second (0-999).
     * @example DateTime.local(2017, 5, 25, 9, 30, 52, 654).millisecond //=> 654
     */
    get millisecond(): number;
    /**
     * Get the minute of the hour (0-59).
     * @example DateTime.local(2017, 5, 25, 9, 30).minute //=> 30
     */
    get minute(): number;
    /**
     * Get the month (1-12).
     * @example DateTime.local(2017, 5, 25).month //=> 5
     */
    get month(): number;
    /**
     * Get the human-readable long month name, such as 'October'.
     * Defaults to the system's locale if no locale has been specified
     * @example DateTime.local(2017, 10, 30).monthLong //=> October
     */
    get monthLong(): string;
    /**
     * Get the human-readable short month name, such as 'Oct'.
     * Defaults to the system's locale if no locale has been specified
     * @example DateTime.local(2017, 10, 30).monthShort //=> Oct
     */
    get monthShort(): string;
    /**
     * Get the numbering system of a DateTime, such as "beng". The numbering system is used when formatting the DateTime
     */
    get numberingSystem(): Readonly<NumberingSystem>;
    /**
     * Get the UTC offset of this DateTime in minutes
     * @example DateTime.now().offset //=> -240
     * @example DateTime.utc().offset //=> 0
     */
    get offset(): number;
    /**
     * Get the long human name for the zone's current offset, for example "Eastern Standard Time" or "Eastern Daylight Time".
     * Defaults to the system's locale if no locale has been specified
     */
    get offsetNameLong(): string;
    /**
     * Get the short human name for the zone's current offset, for example "EST" or "EDT".
     * Defaults to the system's locale if no locale has been specified
     */
    get offsetNameShort(): string;
    /**
     * Get the ordinal (meaning the day of the year)
     * @example DateTime.local(2017, 5, 25).ordinal //=> 145
     */
    get ordinal(): number;
    /**
     * Get the output calendar of a DateTime, such 'islamic'. The output calendar is used when formatting the DateTime
     */
    get outputCalendar(): CalendarSystem | undefined;
    /**
     * Get the quarter
     * @example DateTime.local(2017, 5, 25).quarter //=> 2
     */
    get quarter(): number;
    /**
     * Get the second of the minute (0-59).
     * @example DateTime.local(2017, 5, 25, 9, 30, 52).second //=> 52
     */
    get second(): number;
    /**
     * Get the timestamp.
     * @example DateTime.local(1970, 1, 1, 0, 0, 0, 654).ts //=> 654
     */
    get ts(): number;
    /**
     * Get the week number of the week year (1-52ish).
     * @see https://en.wikipedia.org/wiki/ISO_week_date
     * @example DateTime.local(2017, 5, 25).weekNumber //=> 21
     */
    get weekNumber(): number;
    /**
     * Get the week year
     * @see https://en.wikipedia.org/wiki/ISO_week_date
     * @example DateTime.local(2014, 12, 31).weekYear //=> 2015
     */
    get weekYear(): number;
    /**
     * Get the day of the week.
     * 1 is Monday and 7 is Sunday
     * @see https://en.wikipedia.org/wiki/ISO_week_date
     * @example DateTime.local(2014, 11, 31).weekday //=> 4
     */
    get weekday(): number;
    /**
     * Get the human-readable long weekday, such as 'Monday'.
     * Defaults to the system's locale if no locale has been specified
     * @example DateTime.local(2017, 10, 30).weekdayLong //=> Monday
     */
    get weekdayLong(): string;
    /**
     * Get the human-readable short weekday, such as 'Mon'.
     * Defaults to the system's locale if no locale has been specified
     * @example DateTime.local(2017, 10, 30).weekdayShort //=> Mon
     */
    get weekdayShort(): string;
    /**
     * Returns the number of weeks in this DateTime's local week year
     * @example DateTime.local(2020, 6, {locale: 'en-US'}).weeksInLocalWeekYear //=> 52
     * @example DateTime.local(2020, 6, {locale: 'de-DE'}).weeksInLocalWeekYear //=> 53
     * @type {number}
     */
    get weeksInLocalWeekYear(): number;
    /**
     * Returns the number of weeks in this DateTime's year
     * @see https://en.wikipedia.org/wiki/ISO_week_date
     * @example DateTime.local(2004).weeksInWeekYear //=> 53
     * @example DateTime.local(2013).weeksInWeekYear //=> 52
     */
    get weeksInWeekYear(): number;
    /**
     * Get the year
     * @example DateTime.local(2017, 5, 25).year //=> 2017
     */
    get year(): number;
    /**
     * Get the time zone associated with this DateTime.
     */
    get zone(): Zone;
    /**
     * Get the name of the time zone.
     */
    get zoneName(): string;
    private _c;
    private readonly _invalid;
    private readonly _isLuxonDateTime;
    private _loc;
    private _localWeekData?;
    private readonly _o;
    private readonly _ts;
    private _weekData;
    private readonly _zone;
    /**
     * @access private
     */
    private constructor();
    /**
     * Produce the fully expanded format token for the locale
     * Does NOT quote characters, so quoted tokens will not round trip correctly
     * @param fmt
     * @param localeOpts
     */
    static expandFormat(fmt: string, localeOpts?: LocaleOptions): string;
    /**
     * Create a DateTime from an input string and format string.
     * Defaults to en-US if no locale has been specified, regardless of the system's locale.
     * @see https://moment.github.io/luxon/docs/manual/parsing.html#table-of-tokens
     * @param {string} text - the string to parse
     * @param {string} fmt - the format the string is expected to be in (see the link below for the formats)
     * @param {Object} opts - options to affect the creation
     * @param {string|Zone} [opts.zone="local"] - use this zone if no offset is specified in the input string itself. Will also convert the DateTime to this zone
     * @param {boolean} [opts.setZone=false] - override the zone with a zone specified in the string itself, if it specifies one
     * @param {string} [opts.locale='en-US'] - a locale string to use when parsing. Will also set the DateTime to this locale
     * @param {string} opts.numberingSystem - the numbering system to use when parsing. Will also set the resulting DateTime to this numbering system
     * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
     */
    static fromFormat(text: string, fmt: string, opts?: DateTimeOptions): DateTime;
    /**
     * Explain how a string would be parsed by fromFormat()
     * @param {string} text - the string to parse
     * @param {string} fmt - the format the string is expected to be in (see description)
     * @param {Object} options - options taken by fromFormat()
     */
    static fromFormatExplain(text: string, fmt: string, options?: DateTimeOptions): ExplainedFormat;
    /**
     * Create a DateTime from an HTTP header date
     * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec3.html#sec3.3.1
     * @param {string} text - the HTTP header date
     * @param {Object} opts - options to affect the creation
     * @param {string|Zone} [opts.zone="local"] - convert the time to this zone. Since HTTP dates are always in UTC, this has no effect on the interpretation of string, merely the zone the resulting DateTime is expressed in.
     * @param {boolean} [opts.setZone=false] - override the zone with the fixed-offset zone specified in the string. For HTTP dates, this is always UTC, so this option is equivalent to setting the `zone` option to 'utc', but this option is included for consistency with similar methods.
     * @param {string} [opts.locale="system's locale"] - a locale to set on the resulting DateTime instance
     * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
     * @param {string} opts.numberingSystem - the numbering system to set on the resulting DateTime instance
     * @example DateTime.fromHTTP('Sun, 06 Nov 1994 08:49:37 GMT')
     * @example DateTime.fromHTTP('Sunday, 06-Nov-94 08:49:37 GMT')
     * @example DateTime.fromHTTP('Sun Nov  6 08:49:37 1994')
     */
    static fromHTTP(text: string, opts?: DateTimeOptions): DateTime;
    /**
     * Create a DateTime from an ISO 8601 string
     * @param {string} text - the ISO string
     * @param {Object} opts - options to affect the creation
     * @param {string|Zone} [opts.zone="local"] - use this zone if no offset is specified in the input string itself. Will also convert the time to this zone
     * @param {boolean} [opts.setZone=false] - override the zone with a fixed-offset zone specified in the string itself, if it specifies one
     * @param {string} [opts.locale='system's locale'] - a locale to set on the resulting DateTime instance
     * @param {string} [opts.outputCalendar] - the output calendar to set on the resulting DateTime instance
     * @param {string} [opts.numberingSystem] - the numbering system to set on the resulting DateTime instance
     * @example DateTime.fromISO('2016-05-25T09:08:34.123')
     * @example DateTime.fromISO('2016-05-25T09:08:34.123+06:00')
     * @example DateTime.fromISO("2016-05-25T09:08:34.123+06:00", {setZone: true})
     * @example DateTime.fromISO('2016-05-25T09:08:34.123', {zone: 'utc'})
     * @example DateTime.fromISO('2016-W05-4')
     * @return {DateTime}
     */
    static fromISO(text: string, opts?: DateTimeOptions): DateTime;
    /**
     * Create a DateTime from a Javascript Date object. Uses the default zone.
     * @param {Date} date - a Javascript Date object
     * @param {Object} options - configuration options for the DateTime
     * @param {string|Zone} [options.zone="local"] - the zone to place the DateTime into
     * @return {DateTime}
     */
    static fromJSDate(date: Date, options?: DateTimeOptions): DateTime;
    /**
     * Create a DateTime from a number of milliseconds since the epoch (meaning since 1 January 1970 00:00:00 UTC). Uses the default zone.
     * @param {number} milliseconds - a number of milliseconds since 1970 UTC
     * @param {Object} options - configuration options for the DateTime
     * @param {string|Zone} [options.zone="local"] - the zone to place the DateTime into
     * @param {string} [options.locale] - a locale to set on the resulting DateTime instance
     * @param {string} [options.outputCalendar] - the output calendar to set on the resulting DateTime instance
     * @param {string} [options.numberingSystem] - the numbering system to set on the resulting DateTime instance
     * @return {DateTime}
     */
    static fromMillis(milliseconds: number, options?: DateTimeOptions): DateTime;
    /**
     * Create a DateTime from a JavaScript object with keys like 'year' and 'hour' with reasonable defaults.
     * @param {Object} obj - the object to create the DateTime from
     * @param {number} obj.year - a year, such as 1987
     * @param {number} obj.month - a month, 1-12
     * @param {number} obj.day - a day of the month, 1-31, depending on the month
     * @param {number} obj.ordinal - day of the year, 1-365 or 366
     * @param {number} obj.weekYear - an ISO week year
     * @param {number} obj.weekNumber - an ISO week number, between 1 and 52 or 53, depending on the year
     * @param {number} obj.weekday - an ISO weekday, 1-7, where 1 is Monday and 7 is Sunday
     * @param {number} obj.localWeekYear - a week year, according to the locale
     * @param {number} obj.localWeekNumber - a week number, between 1 and 52 or 53, depending on the year, according to the locale
     * @param {number} obj.localWeekday - a weekday, 1-7, where 1 is the first and 7 is the last day of the week, according to the locale
     * @param {number} obj.hour - hour of the day, 0-23
     * @param {number} obj.minute - minute of the hour, 0-59
     * @param {number} obj.second - second of the minute, 0-59
     * @param {number} obj.millisecond - millisecond of the second, 0-999
     * @param {Object} opts - options for creating this DateTime
     * @param {string|Zone} [opts.zone="local"] - interpret the numbers in the context of a particular zone. Can take any value taken as the first argument to setZone()
     * @param {string} [opts.locale="system's locale"] - a locale to set on the resulting DateTime instance
     * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
     * @param {string} opts.numberingSystem - the numbering system to set on the resulting DateTime instance
     * @example DateTime.fromObject({ year: 1982, month: 5, day: 25}).toISODate() //=> '1982-05-25'
     * @example DateTime.fromObject({ year: 1982 }).toISODate() //=> '1982-01-01'
     * @example DateTime.fromObject({ hour: 10, minute: 26, second: 6 }) //~> today at 10:26:06
     * @example DateTime.fromObject({ hour: 10, minute: 26, second: 6 }, { zone: 'utc' }),
     * @example DateTime.fromObject({ hour: 10, minute: 26, second: 6 }, { zone: 'local' })
     * @example DateTime.fromObject({ hour: 10, minute: 26, second: 6 }, { zone: 'America/New_York' })
     * @example DateTime.fromObject({ weekYear: 2016, weekNumber: 2, weekday: 3 }).toISODate() //=> '2016-01-13'
     * @example DateTime.fromObject({ localWeekYear: 2022, localWeekNumber: 1, localWeekday: 1 }, { locale: "en-US" }).toISODate() //=> '2021-12-26'
     * @return {DateTime}
     */
    static fromObject(obj?: DurationObject & GenericDateTime, opts?: DateTimeOptions): DateTime;
    /**
     * Create a DateTime from an RFC 2822 string
     * @param {string} text - the RFC 2822 string
     * @param {Object} opts - options to affect the creation
     * @param {string|Zone} [opts.zone="local"] - convert the time to this zone. Since the offset is always specified in the string itself, this has no effect on the interpretation of string, merely the zone the resulting DateTime is expressed in.
     * @param {boolean} [opts.setZone=false] - override the zone with a fixed-offset zone specified in the string itself, if it specifies one
     * @param {string} [opts.locale="system's locale"] - a locale to set on the resulting DateTime instance
     * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
     * @param {string} opts.numberingSystem - the numbering system to set on the resulting DateTime instance
     * @example DateTime.fromRFC2822('25 Nov 2016 13:23:12 GMT')
     * @example DateTime.fromRFC2822('Fri, 25 Nov 2016 13:23:12 +0600')
     * @example DateTime.fromRFC2822('25 Nov 2016 13:23 Z')
     */
    static fromRFC2822(text: string, opts?: DateTimeOptions): DateTime;
    /**
     * Create a DateTime from a SQL date, time, or datetime
     * Defaults to en-US if no locale has been specified, regardless of the system's locale
     * @param {string} text - the string to parse
     * @param {Object} opts - options to affect the creation
     * @param {string|Zone} [opts.zone="local"] - use this zone if no offset is specified in the input string itself. Will also convert the DateTime to this zone
     * @param {boolean} [opts.setZone=false] - override the zone with a zone specified in the string itself, if it specifies one
     * @param {string} [opts.locale='en-US'] - a locale string to use when parsing. Will also set the DateTime to this locale
     * @param {string} opts.numberingSystem - the numbering system to use when parsing. Will also set the resulting DateTime to this numbering system
     * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
     * @example DateTime.fromSQL('2017-05-15')
     * @example DateTime.fromSQL('2017-05-15 09:12:34')
     * @example DateTime.fromSQL('2017-05-15 09:12:34.342')
     * @example DateTime.fromSQL('2017-05-15 09:12:34.342+06:00')
     * @example DateTime.fromSQL('2017-05-15 09:12:34.342 America/Los_Angeles')
     * @example DateTime.fromSQL('2017-05-15 09:12:34.342 America/Los_Angeles', { setZone: true })
     * @example DateTime.fromSQL('2017-05-15 09:12:34.342', { zone: 'America/Los_Angeles' })
     * @example DateTime.fromSQL('09:12:34.342')
     */
    static fromSQL(text: string, opts?: DateTimeOptions): DateTime;
    /**
     * Create a DateTime from a number of seconds since the epoch (meaning since 1 January 1970 00:00:00 UTC). Uses the default zone.
     * @param {number} seconds - a number of seconds since 1970 UTC
     * @param {Object} options - configuration options for the DateTime
     * @param {string|Zone} [options.zone="local"] - the zone to place the DateTime into
     * @param {string} [options.locale] - a locale to set on the resulting DateTime instance
     * @param {string} [options.outputCalendar] - the output calendar to set on the resulting DateTime instance
     * @param {string} [options.numberingSystem] - the numbering system to set on the resulting DateTime instance
     * @return {DateTime}
     */
    static fromSeconds(seconds: number, options?: DateTimeOptions): DateTime;
    /**
     * @deprecated use fromFormat instead
     */
    static fromString(text: string, fmt: string, opts?: DateTimeOptions): DateTime;
    /**
     * @deprecated use fromFormatExplain instead
     */
    static fromStringExplain(text: string, fmt: string, options?: DateTimeOptions): ExplainedFormat;
    /**
     * Create an invalid DateTime.
     * @param {string} reason - simple string of why this DateTime is invalid. Should not contain parameters or anything else data-dependent.
     * @param {string} [explanation=null] - longer explanation, may include parameters and other useful debugging information
     */
    static invalid(reason: Invalid | string, explanation?: string): DateTime;
    /**
     * Check if an object is an instance of DateTime. Works across context boundaries
     * @param {Object} o
     */
    static isDateTime(o: unknown): o is DateTime;
    /**
     * Create a local DateTime
     * @param args - The date values (year, month, etc.) and/or the configuration options for the DateTime
     * @example {number} [year] - The calendar year. If omitted (as in, call `local()` with no arguments), the current time will be used
     * @example {number} [month=1] - The month, 1-indexed
     * @example {number} [day=1] - The day of the month, 1-indexed
     * @example {number} [hour=0] - The hour of the day, in 24-hour time
     * @example {number} [minute=0] - The minute of the hour, meaning a number between 0 and 59
     * @example {number} [second=0] - The second of the minute, meaning a number between 0 and 59
     * @example {number} [millisecond=0] - The millisecond of the second, meaning a number between 0 and 999
     * @example DateTime.local()                                //~> now
     * @example DateTime.local({ zone: "America/New_York" })    //~> now, in US east coast time
     * @example DateTime.local(2017)                            //~> 2017-01-01T00:00:00
     * @example DateTime.local(2017, 3)                         //~> 2017-03-01T00:00:00
     * @example DateTime.local(2017, 3, 12, { locale: "fr" })     //~> 2017-03-12T00:00:00, with a French locale
     * @example DateTime.local(2017, 3, 12, 5)                  //~> 2017-03-12T05:00:00
     * @example DateTime.local(2017, 3, 12, 5, { zone: "utc" }) //~> 2017-03-12T05:00:00, in UTC
     * @example DateTime.local(2017, 3, 12, 5, 45, 10)          //~> 2017-03-12T05:45:10
     * @example DateTime.local(2017, 3, 12, 5, 45, 10, 765)     //~> 2017-03-12T05:45:10.765
     * @return {DateTime}
     */
    static local(...args: [DateTimeOptions] | number[] | (number | DateTimeOptions)[]): DateTime;
    /**
     * Return the max of several date times
     * @param {...DateTime} dateTimes - the DateTimes from which to choose the maximum
     * @return {DateTime} the max DateTime, or undefined if called with no arguments
     */
    static max(...dateTimes: []): void;
    static max(...dateTimes: DateTime[]): DateTime;
    /**
     * Return the min of several date times
     * @param {...DateTime} dateTimes - the DateTimes from which to choose the minimum
     * @return {DateTime} the min DateTime, or undefined if called with no arguments
     */
    static min(...dateTimes: []): void;
    static min(...dateTimes: DateTime[]): DateTime;
    /**
     * Create a DateTime for the current instant, in the system's time zone.
     *
     * Use Settings to override these default values if needed.
     * @example DateTime.now().toISO() //~> now in the ISO format
     * @return {DateTime}
     */
    static now(): DateTime;
    /**
     * Produce the format string for a set of options
     * @param formatOpts
     * @param localeOpts
     * @returns {string}
     */
    static parseFormatForOpts(formatOpts: Intl.DateTimeFormatOptions, localeOpts?: LocaleOptions): string;
    /**
     * Create a DateTime in UTC
     * @param args - The date values (year, month, etc.) and/or the configuration options for the DateTime
     * @example {number} [year] - The calendar year. If omitted (as in, call `utc()` with no arguments), the current time will be used
     * @example {number} [month=1] - The month, 1-indexed
     * @example {number} [day=1] - The day of the month
     * @example {number} [hour=0] - The hour of the day, in 24-hour time
     * @example {number} [minute=0] - The minute of the hour, meaning a number between 0 and 59
     * @example {number} [second=0] - The second of the minute, meaning a number between 0 and 59
     * @example {number} [millisecond=0] - The millisecond of the second, meaning a number between 0 and 999
     * @example {Object} options - configuration options for the DateTime
     * @example {string} [options.locale] - a locale to set on the resulting DateTime instance
     * @example {string} [options.outputCalendar] - the output calendar to set on the resulting DateTime instance
     * @example {string} [options.numberingSystem] - the numbering system to set on the resulting DateTime instance
     * @example DateTime.utc()                            //~> now
     * @example DateTime.utc(2017)                        //~> 2017-01-01T00:00:00Z
     * @example DateTime.utc(2017, 3)                     //~> 2017-03-01T00:00:00Z
     * @example DateTime.utc(2017, 3, 12)                 //~> 2017-03-12T00:00:00Z
     * @example DateTime.utc(2017, 3, 12, 5)              //~> 2017-03-12T05:00:00Z
     * @example DateTime.utc(2017, 3, 12, 5, 45)          //~> 2017-03-12T05:45:00Z
     * @example DateTime.utc(2017, 3, 12, 5, 45, { locale: "fr" } )       //~> 2017-03-12T05:45:00Z with a French locale
     * @example DateTime.utc(2017, 3, 12, 5, 45, 10)      //~> 2017-03-12T05:45:10Z
     * @example DateTime.utc(2017, 3, 12, 5, 45, 10, 765, { locale: "fr }) //~> 2017-03-12T05:45:10.765Z
     * @return {DateTime}
     */
    static utc(...args: [DateTimeOptions] | number[] | (number | DateTimeOptions)[]): DateTime;
    /**
     * @private
     */
    private static _buildObject;
    /**
     * @private
     */
    private static _diffRelative;
    /**
     * @private
     */
    private static _lastOpts;
    /**
     * @private
     */
    private static _quickDT;
    /**
     * @private
     */
    private static _unsupportedZone;
    /**
     * Returns the difference between two DateTimes as a Duration.
     * @param {DateTime} otherDateTime - the DateTime to compare this one to
     * @param {string|string[]} [unit=['milliseconds']] - the unit or array of units (such as 'hours' or 'days') to include in the duration.
     * @param {Object} opts - options that affect the creation of the Duration
     * @param {string} [opts.conversionAccuracy='casual'] - the conversion system to use
     * @example
     * var i1 = DateTime.fromISO('1982-05-25T09:45'),
     *     i2 = DateTime.fromISO('1983-10-14T10:30');
     * i2.diff(i1).toObject() //=> { milliseconds: 43807500000 }
     * i2.diff(i1, 'hours').toObject() //=> { hours: 12168.75 }
     * i2.diff(i1, ['months', 'days']).toObject() //=> { months: 16, days: 19.03125 }
     * i2.diff(i1, ['months', 'days', 'hours']).toObject() //=> { months: 16, days: 19, hours: 0.75 }
     * @return {Duration}
     */
    diff(otherDateTime: DateTime, unit?: DurationUnit | DurationUnit[], opts?: DurationOptions): Duration;
    /**
     * Returns the difference between this DateTime and right now.
     * See {@link DateTime#diff}
     * @param {string|string[]} [unit=['milliseconds']] - the unit or units units (such as 'hours' or 'days') to include in the duration
     * @param {Object} opts - options that affect the creation of the Duration
     * @param {string} [opts.conversionAccuracy='casual'] - the conversion system to use
     * @return {Duration}
     */
    diffNow(unit?: DurationUnit | DurationUnit[], opts?: DurationOptions): Duration;
    /**
     * "Set" this DateTime to the end (meaning the last millisecond) of a unit of time
     * @param {string} unit - The unit to go to the end of. Can be 'year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', or 'millisecond'.
     * @param {Object} opts - options
     * @param {boolean} [opts.useLocaleWeeks=false] - If true, use weeks based on the locale, i.e. use the locale-dependent start of the week
     * @example DateTime.local(2014, 3, 3).endOf('month').toISO(); //=> '2014-03-31T23:59:59.999-05:00'
     * @example DateTime.local(2014, 3, 3).endOf('year').toISO(); //=> '2014-12-31T23:59:59.999-05:00'
     * @example DateTime.local(2014, 3, 3, 5, 30).endOf('day').toISO(); //=> '2014-03-03T23:59:59.999-05:00'
     * @example DateTime.local(2014, 3, 3, 5, 30).endOf('hour').toISO(); //=> '2014-03-03T05:59:59.999-05:00'
     * @return {DateTime}
     */
    endOf(unit: DurationUnit, { useLocaleWeeks }?: {
        useLocaleWeeks?: boolean;
    }): DateTime;
    /**
     * Equality check
     * Two DateTimes are equal if and only if they represent the same millisecond, have the same zone and location, and are both valid.
     * To compare just the millisecond values, use `+dt1 === +dt2`.
     * @param {DateTime} other - the other DateTime
     */
    equals(other: DateTime): boolean;
    /**
     * Get the value of unit.
     * @param {string} unit - a unit such as 'minute' or 'day'
     * @example DateTime.local(2017, 7, 4).get('month'); //=> 7
     * @example DateTime.local(2017, 7, 4).get('day'); //=> 4
     * @return {number}
     */
    get(unit: string): string | number | boolean | void | Zone | Locale | ((zone: ZoneLike, { keepLocalTime, keepCalendarTime }?: SetZoneOptions) => DateTime) | ((duration: number | DurationLike) => DateTime) | (() => Date) | (({ format, suppressSeconds, suppressMilliseconds, includeOffset, extendedZone }?: ToISOTimeOptions) => string) | (() => number) | ((duration: number | DurationLike) => DateTime) | ((unit: "day" | "hour" | "minute" | "month" | "second" | "year" | "years" | "quarter" | "quarters" | "months" | "week" | "weeks" | "days" | "hours" | "minutes" | "seconds" | "milliseconds" | keyof import("./types/datetime").LocalWeekDateTime | keyof import("./types/datetime").LocalWeekDateTimePlurals | "millisecond", { useLocaleWeeks }?: {
        useLocaleWeeks?: boolean;
    }) => DateTime) | ((options: LocaleOptions) => DateTime) | ((otherDateTime: DateTime, unit?: "day" | "hour" | "minute" | "month" | "second" | "year" | "years" | "quarter" | "quarters" | "months" | "week" | "weeks" | "days" | "hours" | "minutes" | "seconds" | "milliseconds" | keyof import("./types/datetime").LocalWeekDateTime | keyof import("./types/datetime").LocalWeekDateTimePlurals | "millisecond" | ("day" | "hour" | "minute" | "month" | "second" | "year" | "years" | "quarter" | "quarters" | "months" | "week" | "weeks" | "days" | "hours" | "minutes" | "seconds" | "milliseconds" | keyof import("./types/datetime").LocalWeekDateTime | keyof import("./types/datetime").LocalWeekDateTimePlurals | "millisecond")[], opts?: DurationOptions) => Duration) | ((other: DateTime) => boolean) | ((otherDateTime: DateTime, unit: "day" | "hour" | "minute" | "month" | "second" | "year" | "years" | "quarter" | "quarters" | "months" | "week" | "weeks" | "days" | "hours" | "minutes" | "seconds" | "milliseconds" | keyof import("./types/datetime").LocalWeekDateTime | keyof import("./types/datetime").LocalWeekDateTimePlurals | "millisecond", opts?: {
        useLocaleWeeks?: boolean;
    }) => boolean) | (() => number) | ((fmt: string, opts?: DateTimeOptions) => string) | (({ format }?: {
        format?: ToISOFormat;
    }) => string) | (({ suppressMilliseconds, suppressSeconds, includeOffset, includePrefix, extendedZone, format }?: ToISOTimeOptions) => string) | ((values: Partial<GregorianDateTime & WeekDateTime & OrdinalDateTime & DateTimeOptions & import("./types/datetime").LocalWeekDateTime> | Partial<import("./types/datetime").GregorianDateTimePlurals & import("./types/datetime").WeekDateTimePlurals & import("./types/datetime").LocalWeekDateTimePlurals & import("./types/datetime").OrdinalDateTimePlurals & DateTimeOptions>) => DateTime) | ((offset?: number, opts?: SetZoneOptions) => DateTime) | (() => string) | ((formatOpts?: Intl.DateTimeFormatOptions & LocaleOptions, opts?: DateTimeOptions) => string) | (() => string) | ((unit: string) => string | number | boolean | void | Zone | Locale | ((zone: ZoneLike, { keepLocalTime, keepCalendarTime }?: SetZoneOptions) => DateTime) | ((duration: number | DurationLike) => DateTime) | (() => Date) | (({ format, suppressSeconds, suppressMilliseconds, includeOffset, extendedZone }?: ToISOTimeOptions) => string) | (() => number) | ((duration: number | DurationLike) => DateTime) | ((unit: "day" | "hour" | "minute" | "month" | "second" | "year" | "years" | "quarter" | "quarters" | "months" | "week" | "weeks" | "days" | "hours" | "minutes" | "seconds" | "milliseconds" | keyof import("./types/datetime").LocalWeekDateTime | keyof import("./types/datetime").LocalWeekDateTimePlurals | "millisecond", { useLocaleWeeks }?: {
        useLocaleWeeks?: boolean;
    }) => DateTime) | ((options: LocaleOptions) => DateTime) | ((otherDateTime: DateTime, unit?: "day" | "hour" | "minute" | "month" | "second" | "year" | "years" | "quarter" | "quarters" | "months" | "week" | "weeks" | "days" | "hours" | "minutes" | "seconds" | "milliseconds" | keyof import("./types/datetime").LocalWeekDateTime | keyof import("./types/datetime").LocalWeekDateTimePlurals | "millisecond" | ("day" | "hour" | "minute" | "month" | "second" | "year" | "years" | "quarter" | "quarters" | "months" | "week" | "weeks" | "days" | "hours" | "minutes" | "seconds" | "milliseconds" | keyof import("./types/datetime").LocalWeekDateTime | keyof import("./types/datetime").LocalWeekDateTimePlurals | "millisecond")[], opts?: DurationOptions) => Duration) | ((other: DateTime) => boolean) | ((otherDateTime: DateTime, unit: "day" | "hour" | "minute" | "month" | "second" | "year" | "years" | "quarter" | "quarters" | "months" | "week" | "weeks" | "days" | "hours" | "minutes" | "seconds" | "milliseconds" | keyof import("./types/datetime").LocalWeekDateTime | keyof import("./types/datetime").LocalWeekDateTimePlurals | "millisecond", opts?: {
        useLocaleWeeks?: boolean;
    }) => boolean) | (() => number) | ((fmt: string, opts?: DateTimeOptions) => string) | (({ format }?: {
        format?: ToISOFormat;
    }) => string) | (({ suppressMilliseconds, suppressSeconds, includeOffset, includePrefix, extendedZone, format }?: ToISOTimeOptions) => string) | ((values: Partial<GregorianDateTime & WeekDateTime & OrdinalDateTime & DateTimeOptions & import("./types/datetime").LocalWeekDateTime> | Partial<import("./types/datetime").GregorianDateTimePlurals & import("./types/datetime").WeekDateTimePlurals & import("./types/datetime").LocalWeekDateTimePlurals & import("./types/datetime").OrdinalDateTimePlurals & DateTimeOptions>) => DateTime) | ((offset?: number, opts?: SetZoneOptions) => DateTime) | (() => string) | ((formatOpts?: Intl.DateTimeFormatOptions & LocaleOptions, opts?: DateTimeOptions) => string) | (() => string) | any | ((opts?: {
        includeConfig: boolean;
    }) => GregorianDateTime & Partial<LocaleOptions>) | ((unit?: "day" | "hour" | "minute" | "month" | "second" | "year" | "years" | "quarter" | "quarters" | "months" | "week" | "weeks" | "days" | "hours" | "minutes" | "seconds" | "milliseconds" | keyof import("./types/datetime").LocalWeekDateTime | keyof import("./types/datetime").LocalWeekDateTimePlurals | "millisecond" | ("day" | "hour" | "minute" | "month" | "second" | "year" | "years" | "quarter" | "quarters" | "months" | "week" | "weeks" | "days" | "hours" | "minutes" | "seconds" | "milliseconds" | keyof import("./types/datetime").LocalWeekDateTime | keyof import("./types/datetime").LocalWeekDateTimePlurals | "millisecond")[], opts?: DurationOptions) => Duration) | ((unit: "day" | "hour" | "minute" | "month" | "second" | "year" | "years" | "quarter" | "quarters" | "months" | "week" | "weeks" | "days" | "hours" | "minutes" | "seconds" | "milliseconds" | keyof import("./types/datetime").LocalWeekDateTime | keyof import("./types/datetime").LocalWeekDateTimePlurals | "millisecond", { useLocaleWeeks }?: {
        useLocaleWeeks?: boolean;
    }) => DateTime) | (() => DateTime[]) | ((opts?: {}) => {
        locale: string;
        numberingSystem: string;
        outputCalendar: string;
    }) | ((locale: string) => DateTime) | (() => Date) | (() => string) | (() => string) | (() => DateTime) | ((opts?: Intl.DateTimeFormatOptions & LocaleOptions) => Intl.DateTimeFormatPart[]) | (() => string) | ((options?: ToRelativeOptions) => string) | ((options?: ToRelativeCalendarOptions) => string) | ((opts?: ToSQLOptions) => string) | (() => string) | (({ includeOffset, includeZone, includeOffsetSpace }?: ToSQLOptions) => string) | (() => number) | (() => number) | ((other: DateTime) => Interval)) | ((opts?: {
        includeConfig: boolean;
    }) => GregorianDateTime & Partial<LocaleOptions>) | ((unit?: "day" | "hour" | "minute" | "month" | "second" | "year" | "years" | "quarter" | "quarters" | "months" | "week" | "weeks" | "days" | "hours" | "minutes" | "seconds" | "milliseconds" | keyof import("./types/datetime").LocalWeekDateTime | keyof import("./types/datetime").LocalWeekDateTimePlurals | "millisecond" | ("day" | "hour" | "minute" | "month" | "second" | "year" | "years" | "quarter" | "quarters" | "months" | "week" | "weeks" | "days" | "hours" | "minutes" | "seconds" | "milliseconds" | keyof import("./types/datetime").LocalWeekDateTime | keyof import("./types/datetime").LocalWeekDateTimePlurals | "millisecond")[], opts?: DurationOptions) => Duration) | ((unit: "day" | "hour" | "minute" | "month" | "second" | "year" | "years" | "quarter" | "quarters" | "months" | "week" | "weeks" | "days" | "hours" | "minutes" | "seconds" | "milliseconds" | keyof import("./types/datetime").LocalWeekDateTime | keyof import("./types/datetime").LocalWeekDateTimePlurals | "millisecond", { useLocaleWeeks }?: {
        useLocaleWeeks?: boolean;
    }) => DateTime) | (() => DateTime[]) | ((opts?: {}) => {
        locale: string;
        numberingSystem: string;
        outputCalendar: string;
    }) | ((locale: string) => DateTime) | (() => Date) | (() => string) | (() => string) | (() => DateTime) | ((opts?: Intl.DateTimeFormatOptions & LocaleOptions) => Intl.DateTimeFormatPart[]) | (() => string) | ((options?: ToRelativeOptions) => string) | ((options?: ToRelativeCalendarOptions) => string) | ((opts?: ToSQLOptions) => string) | (() => string) | (({ includeOffset, includeZone, includeOffsetSpace }?: ToSQLOptions) => string) | (() => number) | (() => number) | ((other: DateTime) => Interval);
    /**
     * Get those DateTimes which have the same local time as this DateTime, but a different offset from UTC
     * in this DateTime's zone. During DST changes local time can be ambiguous, for example
     * `2023-10-29T02:30:00` in `Europe/Berlin` can have offset `+01:00` or `+02:00`.
     * This method will return both possible DateTimes if this DateTime's local time is ambiguous.
     */
    getPossibleOffsets(): DateTime[];
    /**
     * Return whether this DateTime is in the same unit of time as another DateTime.
     * Higher-order units must also be identical for this function to return `true`.
     * Note that time zones are **ignored** in this comparison, which compares the **local** calendar time. Use {@link DateTime#setZone} to convert one of the dates if needed.
     * @param {DateTime} otherDateTime - the other DateTime
     * @param {string} unit - the unit of time to check sameness on
     * @param {Object} opts - options
     * @param {boolean} [opts.useLocaleWeeks=false] - If true, use weeks based on the locale, i.e. use the locale-dependent start of the week; only the locale of this DateTime is used
     * @example DateTime.now().hasSame(otherDT, 'day'); //~> true if otherDT is in the same current calendar day
     */
    hasSame(otherDateTime: DateTime, unit: DurationUnit, opts?: {
        useLocaleWeeks?: boolean;
    }): boolean;
    /**
     * Subtract a period of time to this DateTime and return the resulting DateTime
     * See {@link DateTime#plus}
     * @param {Duration|Object|number} duration - The amount to subtract. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
     @return {DateTime}
     */
    minus(duration: DurationLike | number): DateTime;
    /**
     * Add a period of time to this DateTime and return the resulting DateTime
     *
     * Adding hours, minutes, seconds, or milliseconds increases the timestamp by the right number of milliseconds. Adding days, months, or years shifts the calendar, accounting for DSTs and leap years along the way. Thus, `dt.plus({ hours: 24 })` may result in a different time than `dt.plus({ days: 1 })` if there's a DST shift in between.
     * @param {Duration|Object} duration - The amount to add. Either a Luxon Duration or the object argument to Duration.fromObject()
     * @example DateTime.now().plus(123) //~> in 123 milliseconds
     * @example DateTime.now().plus({ minutes: 15 }) //~> in 15 minutes
     * @example DateTime.now().plus({ days: 1 }) //~> this time tomorrow
     * @example DateTime.now().plus({ days: -1 }) //~> this time yesterday
     * @example DateTime.now().plus({ hours: 3, minutes: 13 }) //~> in 3 hr, 13 min
     * @example DateTime.now().plus(Duration.fromObject({ hours: 3, minutes: 13 })) //~> in 3 hr, 13 min
     * @return {DateTime}
     */
    plus(duration: DurationLike | number): DateTime;
    /**
     * "Set" the locale, numberingSystem, or outputCalendar. Returns a newly-constructed DateTime.
     * @param {Object} [options] - the options to set
     * @param {string} [options.locale] - ;
     * @param {CalendarSystem} [options.outputCalendar] - ;
     * @param {NumberingSystem} [options.numberingSystem] - ;
     * @example DateTime.local(2017, 5, 25).reconfigure({ locale: 'en-GB' })
     * @return {DateTime}
     */
    reconfigure(options: LocaleOptions): DateTime;
    /**
     * Returns the resolved Intl options for this DateTime.
     * This is useful in understanding the behavior of formatting methods
     * @param {Object} opts - the same options as toLocaleString
     * @return {Object}
     */
    resolvedLocaleOptions(opts?: {}): {
        locale: string;
        numberingSystem: string;
        outputCalendar: string;
    };
    /**
     * "Set" the values of specified units. Returns a newly-constructed DateTime.
     * You can only set units with this method; for "setting" metadata, see {@link DateTime#reconfigure} and {@link DateTime#setZone}.
     *
     * This method also supports setting locale-based week units, i.e. `localWeekday`, `localWeekNumber` and `localWeekYear`.
     * They cannot be mixed with ISO-week units like `weekday`.
     * @param {Object} values - a mapping of units to numbers
     * @example dt.set({ year: 2017 })
     * @example dt.set({ hour: 8, minute: 30 })
     * @example dt.set({ weekday: 5 })
     * @example dt.set({ year: 2005, ordinal: 234 })
     */
    set(values: GenericDateTime | GenericDateTimePlurals): DateTime;
    /**
     * "Set" the locale. Returns a newly-constructed DateTime.
     * Just a convenient alias for reconfigure({ locale })
     * @example DateTime.local(2017, 5, 25).setLocale('en-GB')
     * @return {DateTime}
     */
    setLocale(locale: string): DateTime;
    /**
     * "Set" the DateTime's zone to specified zone. Returns a newly-constructed DateTime.
     *
     * By default, the setter keeps the underlying time the same (as in, the same timestamp), but the new instance will report different local times and consider DSTs when making computations, as with {@link DateTime#plus}. You may wish to use {@link DateTime#toLocal} and {@link DateTime#toUTC} which provide simple convenience wrappers for commonly used zones.
     * @param {string|Zone} [zone="local"] - a zone identifier. As a string, that can be any IANA zone supported by the host environment, or a fixed-offset name of the form 'UTC+3', or the strings 'local' or 'utc'. You may also supply an instance of a {@link Zone} class.
     * @param {Object} opts - options
     * @param {boolean} [opts.keepLocalTime=false] - If true, adjust the underlying time so that the local time stays the same, but in the target zone. You should rarely need this.
     * @return {DateTime}
     */
    setZone(zone: ZoneLike, { keepLocalTime, keepCalendarTime }?: SetZoneOptions): DateTime;
    /**
     * "Set" this DateTime to the beginning of a unit of time.
     * @param {string} unit - The unit to go to the beginning of. Can be 'year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', or 'millisecond'.
     * @param {Object} opts - options
     * @param {boolean} [opts.useLocaleWeeks=false] - If true, use weeks based on the locale, i.e. use the locale-dependent start of the week
     * @example DateTime.local(2014, 3, 3).startOf('month').toISODate(); //=> '2014-03-01'
     * @example DateTime.local(2014, 3, 3).startOf('year').toISODate(); //=> '2014-01-01'
     * @example DateTime.local(2014, 3, 3, 5, 30).startOf('week').toISOTime(); //=> '2014-03-03', weeks always start on a Monday
     * @example DateTime.local(2014, 3, 3, 5, 30).startOf('day').toISOTime(); //=> '00:00.000-05:00'
     * @example DateTime.local(2014, 3, 3, 5, 30).startOf('hour').toISOTime(); //=> '05:00:00.000-05:00'
     */
    startOf(unit: DurationUnit, { useLocaleWeeks }?: {
        useLocaleWeeks?: boolean;
    }): DateTime;
    /**
     * Returns a BSON serializable equivalent to this DateTime.
     * @return {Date}
     */
    toBSON(): Date;
    /**
     * Returns a string representation of this DateTime formatted according to the specified format string.
     * **You may not want this.** See {@link DateTime#toLocaleString} for a more flexible formatting tool. For a table of tokens and their interpretations, see [here](https://moment.github.io/luxon/#/formatting?id=table-of-tokens).
     * Defaults to en-US if no locale has been specified, regardless of the system's locale.
     * @param {string} fmt - the format string
     * @param {Object} opts - opts to override the configuration options on this DateTime
     * @example DateTime.now().toFormat('yyyy LLL dd') //=> '2017 Apr 22'
     * @example DateTime.now().setLocale('fr').toFormat('yyyy LLL dd') //=> '2017 avr. 22'
     * @example DateTime.now().toFormat('yyyy LLL dd', { locale: "fr" }) //=> '2017 avr. 22'
     * @example DateTime.now().toFormat("HH 'hours and' mm 'minutes'") //=> '20 hours and 55 minutes'
     * @return {string}
     */
    toFormat(fmt: string, opts?: DateTimeOptions): string;
    /**
     * Returns a string representation of this DateTime appropriate for use in HTTP headers. The output is always expressed in GMT
     * Specifically, the string conforms to RFC 1123.
     * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec3.html#sec3.3.1
     * @example DateTime.utc(2014, 7, 13).toHTTP() //=> 'Sun, 13 Jul 2014 00:00:00 GMT'
     * @example DateTime.utc(2014, 7, 13, 19).toHTTP() //=> 'Sun, 13 Jul 2014 19:00:00 GMT'
     * @return {string}
     */
    toHTTP(): string;
    /**
     * Returns an ISO 8601-compliant string representation of this DateTime
     * @param {Object} options - options
     * @param {boolean} [options.suppressMilliseconds=false] - exclude milliseconds from the format if they're 0
     * @param {boolean} [options.suppressSeconds=false] - exclude seconds from the format if they're 0
     * @param {boolean} [options.includeOffset=true] - include the offset, such as 'Z' or '-04:00'
     * @param {boolean} [options.extendedZone=false] - add the time zone format extension
     * @param {string} [options.format='extended'] - choose between the basic and extended format
     * @example DateTime.utc(1983, 5, 25).toISO() //=> '1982-05-25T00:00:00.000Z'
     * @example DateTime.now().toISO() //=> '2017-04-22T20:47:05.335-04:00'
     * @example DateTime.now().toISO({ includeOffset: false }) //=> '2017-04-22T20:47:05.335'
     * @example DateTime.now().toISO({ format: 'basic' }) //=> '20170422T204705.335-0400'
     * @return {string}
     */
    toISO({ format, suppressSeconds, suppressMilliseconds, includeOffset, extendedZone }?: ToISOTimeOptions): string;
    /**
     * Returns an ISO 8601-compliant string representation of this DateTime's date component
     * @param {Object} options - options
     * @param {string} [options.format="extended"] - choose between the basic and extended (default) format
     * @example DateTime.utc(1982, 5, 25).toISODate() //=> '1982-05-25'
     * @example DateTime.utc(1982, 5, 25).toISODate({ format: 'basic' }) //=> '19820525'
     * @return {string}
     */
    toISODate({ format }?: {
        format?: ToISOFormat;
    }): string;
    /**
     * Returns an ISO 8601-compliant string representation of this DateTime's time component
     * @param {Object} opts - options
     * @param {boolean} [opts.suppressMilliseconds=false] - exclude milliseconds from the format if they're 0
     * @param {boolean} [opts.suppressSeconds=false] - exclude seconds from the format if they're 0
     * @param {boolean} [opts.includeOffset=true] - include the offset, such as 'Z' or '-04:00'
     * @param {boolean} [opts.extendedZone=true] - add the time zone format extension
     * @param {boolean} [opts.includePrefix=false] - include the `T` prefix
     * @param {string} [opts.format='extended'] - choose between the basic and extended format
     * @example DateTime.utc().set({ hour: 7, minute: 34 }).toISOTime() //=> '07:34:19.361Z'
     * @example DateTime.utc().set({ hour: 7, minute: 34, seconds: 0, milliseconds: 0 }).toISOTime({ suppressSeconds: true }) //=> '07:34Z'
     * @example DateTime.utc().set({ hour: 7, minute: 34 }).toISOTime({ format: 'basic' }) //=> '073419.361Z'
     * @example DateTime.utc().set({ hour: 7, minute: 34 }).toISOTime({ includePrefix: true }) //=> 'T07:34:19.361Z'
     * @return {string}
     */
    toISOTime({ suppressMilliseconds, suppressSeconds, includeOffset, includePrefix, extendedZone, format }?: ToISOTimeOptions): string;
    /**
     * Returns an ISO 8601-compliant string representation of this DateTime's week date
     * @example DateTime.utc(1982, 5, 25).toISOWeekDate() //=> '1982-W21-2'
     * @return {string}
     */
    toISOWeekDate(): string;
    /**
     * Returns a Javascript Date equivalent to this DateTime.
     * @return {Date}
     */
    toJSDate(): Date;
    /**
     * Returns an ISO 8601 representation of this DateTime appropriate for use in JSON.
     * @return {string}
     */
    toJSON(): string;
    /**
     * "Set" the DateTime's zone to the host's local zone. Returns a newly-constructed DateTime.
     *
     * Equivalent to `setZone('local')`
     * @return {DateTime}
     */
    toLocal(): DateTime;
    /**
     * Returns an array of format "parts", meaning individual tokens along with metadata. This allows callers to post-process individual sections of the formatted output.
     * Defaults to the system's locale if no locale has been specified
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat/formatToParts
     * @param opts {Object} - Intl.DateTimeFormat constructor options, same as `toLocaleString`.
     * @example DateTime.now().toLocaleParts(); //=> [
     *                                   //=>   { type: "day", value: "25" },
     *                                   //=>   { type: "literal", value: "/" },
     *                                   //=>   { type: 'month', value: '05' },
     *                                   //=>   { type: "literal", value: "/" },
     *                                   //=>   { type: "year", value: "1982" }
     *                                   //=> ]
     */
    toLocaleParts(opts?: Intl.DateTimeFormatOptions & LocaleOptions): Intl.DateTimeFormatPart[];
    /**
     * Returns a localized string representing this date. Accepts the same options as the Intl.DateTimeFormat constructor and any presets defined by Luxon, such as `DateTime.DATE_FULL` or `DateTime.TIME_SIMPLE`.
     * The exact behavior of this method is browser-specific, but in general it will return an appropriate representation
     * of the DateTime in the assigned locale.
     * Defaults to the system's locale if no locale has been specified
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
     * @param formatOpts {Object} - Intl.DateTimeFormat constructor options and configuration options
     * @param {Object} opts - opts to override the configuration options on this DateTime
     * @example DateTime.now().toLocaleString(); //=> 4/20/2017
     * @example DateTime.now().setLocale('en-gb').toLocaleString(); //=> '20/04/2017'
     * @example DateTime.now().toLocaleString(DateTime.DATE_FULL); //=> 'April 20, 2017'
     * @example DateTime.now().toLocaleString(DateTime.DATE_FULL, { locale: 'fr' }); //=> '28 août 2022'
     * @example DateTime.now().toLocaleString(DateTime.TIME_SIMPLE); //=> '11:32 AM'
     * @example DateTime.now().toLocaleString(DateTime.DATETIME_SHORT); //=> '4/20/2017, 11:32 AM'
     * @example DateTime.now().toLocaleString({ weekday: 'long', month: 'long', day: '2-digit' }); //=> 'Thursday, April 20'
     * @example DateTime.now().toLocaleString({ weekday: 'short', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }); //=> 'Thu, Apr 20, 11:27 AM'
     * @example DateTime.now().toLocaleString({ hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }); //=> '11:32'
     * @return {string}
     */
    toLocaleString(formatOpts?: Intl.DateTimeFormatOptions & LocaleOptions, opts?: DateTimeOptions): string;
    /**
     * Returns the epoch milliseconds of this DateTime.
     * @return {number}
     */
    toMillis(): number;
    /**
     * Returns a JavaScript object with this DateTime's year, month, day, and so on.
     * @param opts - options for generating the object
     * @param {boolean} [opts.includeConfig=false] - include configuration attributes in the output
     * @example DateTime.now().toObject() //=> { year: 2017, month: 4, day: 22, hour: 20, minute: 49, second: 42, millisecond: 268 }
     * @return {Object}
     */
    toObject(opts?: {
        includeConfig: boolean;
    }): GregorianDateTime & Partial<LocaleOptions>;
    /**
     * Returns an RFC 2822-compatible string representation of this DateTime
     * @example DateTime.utc(2014, 7, 13).toRFC2822() //=> 'Sun, 13 Jul 2014 00:00:00 +0000'
     * @example DateTime.local(2014, 7, 13).toRFC2822() //=> 'Sun, 13 Jul 2014 00:00:00 -0400'
     * @return {string}
     */
    toRFC2822(): string;
    /**
     * Returns a string representation of a time relative to now, such as "in two days". Can only internationalize if your
     * platform supports Intl.RelativeTimeFormat. Rounds down by default.
     * @param {Object} options - options that affect the output
     * @param {DateTime} [options.base=DateTime.now()] - the DateTime to use as the basis to which this time is compared. Defaults to now.
     * @param {string} [options.style="long"] - the style of units, must be "long", "short", or "narrow"
     * @param {string|string[]} options.unit - use a specific unit or array of units; if omitted, or an array, the method will pick the best unit. Use an array or one of "years", "quarters", "months", "weeks", "days", "hours", "minutes", or "seconds"     * @param {boolean} [options.round=true] - whether to round the numbers in the output.
     * @param {number} [options.padding=0] - padding in milliseconds. This allows you to round up the result if it fits inside the threshold. Don't use in combination with {round: false} because the decimal output will include the padding.
     * @param {string} [options.locale] - override the locale of this DateTime
     * @param {string} [options.numberingSystem] - override the numberingSystem of this DateTime. The Intl system may choose not to honor this
     * @example DateTime.now().plus({ days: 1 }).toRelative() //=> "in 1 day"
     * @example DateTime.now().setLocale("es").toRelative({ days: 1 }) //=> "dentro de 1 día"
     * @example DateTime.now().plus({ days: 1 }).toRelative({ locale: "fr" }) //=> "dans 23 heures"
     * @example DateTime.now().minus({ days: 2 }).toRelative() //=> "2 days ago"
     * @example DateTime.now().minus({ days: 2 }).toRelative({ unit: "hours" }) //=> "48 hours ago"
     * @example DateTime.now().minus({ hours: 36 }).toRelative({ round: false }) //=> "1.5 days ago"
     */
    toRelative(options?: ToRelativeOptions): string;
    /**
     * Returns a string representation of this date relative to today, such as "yesterday" or "next month".
     * Only internationalizes on platforms that supports Intl.RelativeTimeFormat.
     * @param {Object} options - options that affect the output
     * @param {DateTime} [options.base=DateTime.now()] - the DateTime to use as the basis to which this time is compared. Defaults to now.
     * @param {string} [options.locale] - override the locale of this DateTime
     * @param {string} [options.unit] - use a specific unit; if omitted, the method will pick the unit. Use one of "years", "quarters", "months", "weeks", or "days"
     * @param {string} [options.numberingSystem] - override the numberingSystem of this DateTime. The Intl system may choose not to honor this
     * @example DateTime.now().plus({ days: 1 }).toRelativeCalendar() //=> "tomorrow"
     * @example DateTime.now().setLocale("es").plus({ days: 1 }).toRelative() //=> ""mañana"
     * @example DateTime.now().plus({ days: 1 }).toRelativeCalendar({ locale: "fr" }) //=> "demain"
     * @example DateTime.now().minus({ days: 2 }).toRelativeCalendar() //=> "2 days ago"
     */
    toRelativeCalendar(options?: ToRelativeCalendarOptions): string;
    /**
     * Returns a string representation of this DateTime appropriate for use in SQL DateTime
     * @param {Object} opts - options
     * @param {boolean} [opts.includeZone=false] - include the zone, such as 'America/New_York'. Overrides includeOffset.
     * @param {boolean} [opts.includeOffset=true] - include the offset, such as 'Z' or '-04:00'
     * @param {boolean} [opts.includeOffsetSpace=true] - include the space between the time and the offset, such as '05:15:16.345 -04:00'
     * @example DateTime.utc(2014, 7, 13).toSQL() //=> '2014-07-13 00:00:00.000 Z'
     * @example DateTime.local(2014, 7, 13).toSQL() //=> '2014-07-13 00:00:00.000 -04:00'
     * @example DateTime.local(2014, 7, 13).toSQL({ includeOffset: false }) //=> '2014-07-13 00:00:00.000'
     * @example DateTime.local(2014, 7, 13).toSQL({ includeZone: true }) //=> '2014-07-13 00:00:00.000 America/New_York'
     * @return {string}
     */
    toSQL(opts?: ToSQLOptions): string;
    /**
     * Returns a string representation of this DateTime appropriate for use in SQL Date
     * @example DateTime.utc(2014, 7, 13).toSQLDate() //=> '2014-07-13'
     * @return {string}
     */
    toSQLDate(): string;
    /**
     * Returns a string representation of this DateTime appropriate for use in SQL Time
     * @param {Object} opts - options
     * @param {boolean} [opts.includeZone=false] - include the zone, such as 'America/New_York'. Overrides includeOffset.
     * @param {boolean} [opts.includeOffset=true] - include the offset, such as 'Z' or '-04:00'
     * @param {boolean} [opts.includeOffsetSpace=true] - include the space between the time and the offset, such as '05:15:16.345 -04:00'
     * @example DateTime.utc().toSQL() //=> '05:15:16.345'
     * @example DateTime.now().toSQL() //=> '05:15:16.345 -04:00'
     * @example DateTime.now().toSQL({ includeOffset: false }) //=> '05:15:16.345'
     * @example DateTime.now().toSQL({ includeZone: false }) //=> "05:15:16.345 America/New_York"
     * @return {string}
     */
    toSQLTime({ includeOffset, includeZone, includeOffsetSpace }?: ToSQLOptions): string;
    /**
     * Returns the epoch seconds of this DateTime.
     * @return {number}
     */
    toSeconds(): number;
    /**
     * Returns a string representation of this DateTime appropriate for debugging
     * @return {string}
     */
    toString(): string;
    /**
     * "Set" the DateTime's zone to UTC. Returns a newly-constructed DateTime.
     *
     * Equivalent to {@link setZone}('utc')
     * @param {number} [offset=0] - optionally, an offset from UTC in minutes
     * @param {Object} [opts={}] - options to pass to `setZone()`
     * @return {DateTime}
     */
    toUTC(offset?: number, opts?: SetZoneOptions): DateTime;
    /**
     * Returns the epoch seconds (as a whole number) of this DateTime.
     * @return {number}
     */
    toUnixInteger(): number;
    /**
     * Return an Interval spanning between this DateTime and another DateTime
     * @param {DateTime} other - the other end point of the Interval
     */
    until(other: DateTime): Interval;
    /**
     * Returns the epoch milliseconds of this DateTime. Alias of {@link DateTime#toMillis}
     * @return {number}
     */
    valueOf(): number;
    /**
     * @private
     */
    /**
     * create a new DT instance by adding a duration, adjusting for DSTs
     * Remember that compared to Luxon.js I don't need to pass the instance as argument here,
     * because it's a private member of the instance itself.
     * Honestly don't know why he didn't do this way!
     * @param dur
     * @private
     */
    private _adjustTime;
    /**
     * @private
     */
    private _clone;
    private _possiblyCachedLocalWeekData;
    /**
     * @private
     */
    private _possiblyCachedWeekData;
    private _toISODate;
    private _toISOTime;
}
export type DateTimeLike = DateTime | Date | GenericDateTime;
