// Constants
import { availableDateTimeLanguages, dateTimeFormat, dateTimeLocale, dateTimeZone } from "../constants/dateTimeFormats.ts";

// Global functions
import { escapeHtml, escapeHtmlAttribute } from "./stringHelpers.ts";

/**
 * Returns the provided language if it is included in the list of available date-time languages.
 * Otherwise, returns the default language.
 *
 * @param {string} language - The language to check against the available date-time languages.
 * @returns {string} The provided language if available, or "default" if not.
 */
export function getAvailableDateTimeLanguageOrDefault(language: string): string {
    if (availableDateTimeLanguages.includes(language)) {
        return language;
    }
    return "default";
}

/**
 * Parses a date string in the format "dd.mm.yyyy" and returns the date in ISO format.
 * Returns null if the input is not a valid date or does not match the expected format.
 *
 * @param {string} dateString - The date string to parse (expected format: "dd.mm.yyyy").
 * @returns {string|null} The ISO formatted date string if valid, otherwise null.
 */
export function parseDateString(dateString: string): string | null {
    // Match the string against the dd.mm.yyyy format
    const regex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
    const match = regex.exec(dateString);

    if (!match) return null;

    const day = Number.parseInt(match[1]!, 10);
    const month = Number.parseInt(match[2]!, 10) - 1; // JavaScript months are 0-based
    const year = Number.parseInt(match[3]!, 10);

    const date = new Date(Date.UTC(year, month, day));

    // Check if the constructed date is valid and matches input (to avoid invalid ones like 32.01.2024)
    if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
        return date.toISOString(); // Return in ISO format
    }

    return null; // Not a valid date
}

/**
 * Parses a time string in the format "hh:mm" or "hh:mm:ss" and returns an ISO 8601 string.
 *
 * @param {string} timeString - The time string to parse (e.g., "13:45" or "13:45:30").
 * @returns {string|null} The ISO 8601 formatted string representing the time, or null if the input is invalid.
 */
export function parseTimeString(timeString: string) {
    // Match the string against the hh:mm:ss format
    const regex = /^(\d{2}):(\d{2})(?::(\d{2}))?$/;
    const match = regex.exec(timeString);
    if (!match) return null;
    const hours = Number.parseInt(match[1]!, 10);
    const minutes = Number.parseInt(match[2]!, 10);
    const seconds = match[3] ? Number.parseInt(match[3]!, 10) : 0;
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
        return null; // Invalid time
    }
    const date = new Date(Date.UTC(1970, 0, 1, hours, minutes, seconds)); // Use a fixed date
    return date.toISOString(); // Return in ISO format
}

/** The message shown in place of a date or time that cannot be read. */
const invalidDateText = "Ugyldig datoformat";

const dottedDatePattern = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/;
const isoDatePattern = /^(\d{4})-(\d{2})-(\d{2})$/;
const timePattern = /^(\d{2}):(\d{2})(?::(\d{2}))?$/;
/** A time of day followed by `Z` or a UTC offset, which makes the value a moment in time rather than a wall-clock value. */
const zonedTimePattern = /\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?\s*(?:Z|[+-]\d{2}(?::?\d{2})?)$/i;

/**
 * The time zone to format a value in.
 *
 * A value with an offset is a moment in time, shown as it reads in Norway. Anything else (a date, a bare time, a date
 * and time with no offset, a Date object) is a wall-clock value: it was read in the machine's own zone, so formatting
 * it in that same zone gives back what was written, wherever the machine is.
 *
 * @param {string|Date} value - The value as it was handed in.
 * @returns {string|undefined} The time zone, or undefined for the machine's own.
 */
function timeZoneOf(value: string | Date): string | undefined {
    return typeof value === "string" && zonedTimePattern.test(value.trim()) ? dateTimeZone : undefined;
}

/**
 * A local date for the given parts, or null when the parts do not name a real moment (31.02, 25:00).
 * The Date constructor rolls such parts over into the next month or day, so the parts are compared back.
 */
function localDate(year: number, month: number, day: number, hours = 0, minutes = 0, seconds = 0): Date | null {
    const date = new Date(year, month - 1, day, hours, minutes, seconds);
    const matches =
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day &&
        date.getHours() === hours &&
        date.getMinutes() === minutes &&
        date.getSeconds() === seconds;
    return matches ? date : null;
}

/**
 * Reads a date, a date and time, or a Date, and answers null for anything that cannot be read.
 *
 * A dotted date is always read day first, as Norwegian dates are written. It has to be matched before the Date constructor sees it, because V8 reads "05.01.2024" month first, as 1 May. A date with no time is read as local midnight rather than UTC midnight, so it is the same day in every time zone.
 *
 * @param {string|Date|null|undefined} value - The value to read.
 * @returns {Date|null} The date, or null if the value is not one.
 */
export function toDate(value?: string | Date | null): Date | null {
    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : value;
    }
    const text = typeof value === "string" ? value.trim() : "";
    if (!text) {
        return null;
    }
    const dotted = dottedDatePattern.exec(text);
    if (dotted) {
        return localDate(Number(dotted[3]), Number(dotted[2]), Number(dotted[1]));
    }
    const isoDate = isoDatePattern.exec(text);
    if (isoDate) {
        return localDate(Number(isoDate[1]), Number(isoDate[2]), Number(isoDate[3]));
    }
    const date = new Date(text);
    return Number.isNaN(date.getTime()) ? null : date;
}

export function isValidDateString(dateString?: string | Date | null): boolean {
    return toDate(dateString) !== null;
}

/**
 * Formats a given date-time string into a localized string based on the specified language.
 *
 * @param {string} dateTime - The date-time string to format. Must be a valid date string.
 * @param {string} [language="default"] - The language code to use for localization. Defaults to "default".
 * @returns {string} - The formatted date-time string or an error message if the input is invalid.
 */
export function formatDateTime(dateTime?: string | null, language = "default"): string {
    if (!dateTime) {
        return "";
    }
    const date = toDate(dateTime);
    if (!date) {
        return invalidDateText;
    }
    language = getAvailableDateTimeLanguageOrDefault(language);
    const locale = dateTimeLocale.dateTime[language]!;
    const options = dateTimeFormat.dateTime[locale] || dateTimeFormat.dateTime.default;
    return new Intl.DateTimeFormat(locale, { ...options, timeZone: timeZoneOf(dateTime) }).format(date);
}

/**
 * Formats a date string according to the specified language locale.
 *
 * @param {string|Date} date - The date string or Date object to format.
 * @param {string} [language="default"] - The language code for formatting (e.g., "en", "no"). Defaults to "default".
 * @returns {string} The formatted date string.
 */
export function formatDate(date?: string | Date | null, language = "default"): string {
    if (!date) {
        return "";
    }
    const parsed = toDate(date);
    if (!parsed) {
        return invalidDateText;
    }
    language = getAvailableDateTimeLanguageOrDefault(language);
    const locale = dateTimeLocale.date[language]!;
    const options = dateTimeFormat.date[locale] || dateTimeFormat.date.default;
    return new Intl.DateTimeFormat(locale, { ...options, timeZone: timeZoneOf(date) }).format(parsed);
}

/**
 * Formats a time string according to the specified language/locale.
 *
 * A bare time ("13:45" or "13:45:30") is read as a local time. Anything else is read as a date and time. A value that cannot be read answers the invalid-date message.
 *
 * @param {string} time - The time string to format (e.g., "12:34:56" or "1970-01-01T12:34:56").
 * @param {string} [language="default"] - The language/locale to use for formatting.
 * @returns {string} The formatted time string.
 */
export function formatTime(time?: string | null, language = "default"): string {
    if (!time) {
        return "";
    }
    const bareTime = timePattern.exec(time.trim());
    const date = bareTime ? localDate(1970, 1, 1, Number(bareTime[1]), Number(bareTime[2]), Number(bareTime[3] ?? 0)) : toDate(time);
    if (!date) {
        return invalidDateText;
    }
    language = getAvailableDateTimeLanguageOrDefault(language);
    const locale = dateTimeLocale.time[language]!;
    const options = dateTimeFormat.time[locale] || dateTimeFormat.time.default;
    return new Intl.DateTimeFormat(locale, { ...options, timeZone: timeZoneOf(time) }).format(date);
}

/**
 * Extracts and trims the substring from the input data after the last hyphen ("-").
 *
 * @param {string} data - The input string to format.
 * @returns {string|undefined} The trimmed substring after the last hyphen, or undefined if input is not provided.
 */
export function formatAR(data?: string): string | undefined {
    const splicedData = data?.substring(data?.lastIndexOf("-") + 1);
    return splicedData?.trim();
}

/** A number written as a string: digits, an optional minus and an optional decimal point, and no leading zero that would make it an identifier. */
const plainNumberPattern = /^-?(0|[1-9]\d*)(\.\d+)?$/;

/**
 * Formats a number the way a Norwegian document writes one, as "1 234,5": a no-break space between thousands, so a figure never splits across a line, and a decimal comma.
 *
 * Only a number, or a string that is plainly one, is formatted. Anything else is returned as it came, which keeps a kommunenummer or a postcode with its leading zero, and a figure that is already written the Norwegian way, from being read as something it is not. A string keeps every decimal it was written with, trailing zeros included, so "60.10" is "60,10" and not "60,1".
 *
 * @param {unknown} value - The value to format.
 * @returns {string} The formatted number, or the value as text when it is not a number.
 */
export function formatNumber(value: unknown): string {
    if (typeof value === "number") {
        // Ten decimals keeps every one a measurement carries and drops the floating point noise a computed sum can pick up, as 0.1 + 0.2 does.
        return Number.isFinite(value) ? new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 10 }).format(value) : String(value);
    }
    const text = typeof value === "string" ? value.trim() : "";
    if (!plainNumberPattern.test(text)) {
        return String(value);
    }
    const decimals = text.split(".")[1]?.length ?? 0;
    return new Intl.NumberFormat("nb-NO", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(Number(text));
}

/**
 * Formats a numeric value as square meters (m²), the number written the Norwegian way.
 *
 * @param {number|string} value - The value to format.
 * @returns {string} The formatted string with square meters unit.
 */
export function formatMeterSquared(value: unknown): string {
    if (value === null || value === undefined || value === "") {
        return "";
    }
    return `${formatNumber(value)} m²`;
}

/**
 * Formats a given string based on the specified format and language.
 *
 * @param {string} string - The string to be formatted.
 * @param {string} format - The format type ("dateTime", "date", "time", "AR", "meterSquared").
 * @param {string} [language="default"] - The language to use for formatting (default is "default").
 * @returns {string} - The formatted string.
 */
export function formatString(string: unknown, format?: string, language = "default"): unknown {
    switch (format) {
        case "dateTime":
            return formatDateTime(string as string, language);
        case "date":
            return formatDate(string as string, language);
        case "time":
            return formatTime(string as string, language);
        case "AR":
            return formatAR(string as string);
        case "meterSquared":
            return formatMeterSquared(string);
        default:
            return string;
    }
}

/**
 * Converts URLs in a given text string into HTML anchor elements.
 *
 * - Detects URLs starting with http(s):// or www.
 * - Splits the text to preserve URLs and non-URL parts.
 * - Escapes HTML in non-link text.
 * - Trims common trailing punctuation from URLs and reattaches it after the anchor.
 * - Ensures links open in a new tab with security attributes.
 *
 * @param {string} text - The input text potentially containing URLs.
 * @returns {string} The HTML string with URLs converted to anchor tags.
 */
export function injectAnchorElements(text: string): string {
    // One canonical URL pattern
    const urlPattern = String.raw`(?:https?:\/\/(?:www\.)?[a-zA-Z0-9][a-zA-Z0-9-]*\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]*\.[^\s]{2,})`;

    // 1) Capturing group so split keeps the URL tokens
    const splitRegex = new RegExp(`(${urlPattern})`, "g");

    // 2) Non-global tester to avoid lastIndex issues
    const isUrl = new RegExp(`^${urlPattern}$`);

    return text
        .toString()
        .split(splitRegex)
        .map((part) => {
            if (!part) return "";
            if (isUrl.test(part)) {
                // Trim common trailing punctuation off the link and re-attach after the anchor
                const regex = /^(.*?)([).,!?:;]+)?$/;
                const m = regex.exec(part);
                const raw = m![1]!;
                const trail = m![2] ?? "";
                const href = raw.startsWith("http") ? raw : `https://${raw}`;
                // The URL token can contain quotes/angle brackets (the pattern allows any non-whitespace),
                // so escape it before interpolating into the attribute and the link text to prevent HTML injection.
                return `<a href="${escapeHtmlAttribute(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(raw)}</a>${escapeHtml(trail)}`;
            }
            return escapeHtml(part);
        })
        .join("");
}
