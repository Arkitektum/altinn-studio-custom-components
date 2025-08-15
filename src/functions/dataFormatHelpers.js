// Constants
import { availableDateTimeLanguages, dateTimeFormat, dateTimeLocale } from "../constants/dateTimeFormats.js";
import validSizeValues from "../constants/validSizeValues.js";

// Global functions
import { hasValue } from "./helpers.js";

/**
 * Returns the provided language if it is included in the list of available date-time languages.
 * Otherwise, returns the default language.
 *
 * @param {string} language - The language to check against the available date-time languages.
 * @returns {string} The provided language if available, or "default" if not.
 */
export function getAvailableDateTimeLanguageOrDefault(language) {
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
export function parseDateString(dateString) {
    // Match the string against the dd.mm.yyyy format
    const regex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
    const match = dateString.match(regex);

    if (!match) return null;

    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1; // JavaScript months are 0-based
    const year = parseInt(match[3], 10);

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
export function parseTimeString(timeString) {
    // Match the string against the hh:mm:ss format
    const regex = /^(\d{2}):(\d{2})(?::(\d{2}))?$/;
    const match = timeString.match(regex);
    if (!match) return null;
    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const seconds = match[3] ? parseInt(match[3], 10) : 0;
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
        return null; // Invalid time
    }
    const date = new Date(Date.UTC(1970, 0, 1, hours, minutes, seconds)); // Use a fixed date
    return date.toISOString(); // Return in ISO format
}

export function isValidDateString(dateString) {
    const date = new Date(dateString);
    return !!dateString && !isNaN(date.getTime());
}

/**
 * Formats a given date-time string into a localized string based on the specified language.
 *
 * @param {string} dateTime - The date-time string to format. Must be a valid date string.
 * @param {string} [language="default"] - The language code to use for localization. Defaults to "default".
 * @returns {string} - The formatted date-time string or an error message if the input is invalid.
 */
export function formatDateTime(dateTime, language = "default") {
    if (!isValidDateString(dateTime)) {
        return "Ugyldig datoformat"; // Return an error message for invalid date format
    }
    language = getAvailableDateTimeLanguageOrDefault(language);

    const dateTimeHasTime = dateTime.includes("T");
    if (!dateTimeHasTime) {
        dateTime = dateTime + "T00:00:00"; // Append time if not present
    }

    const locale = dateTimeLocale.dateTime[language];

    const options = dateTimeFormat.dateTime[locale] || dateTimeFormat.dateTime.default;
    return new Intl.DateTimeFormat(locale, options).format(new Date(dateTime));
}

/**
 * Formats a date string according to the specified language locale.
 *
 * @param {string|Date} date - The date string or Date object to format.
 * @param {string} [language="default"] - The language code for formatting (e.g., "en", "no"). Defaults to "default".
 * @returns {string} The formatted date string.
 */
export function formatDate(date, language = "default") {
    if (!isValidDateString(date)) {
        date = parseDateString(date);
    }
    language = getAvailableDateTimeLanguageOrDefault(language);
    const locale = dateTimeLocale.date[language];
    const options = dateTimeFormat.date[locale] || dateTimeFormat.date.default;
    return new Intl.DateTimeFormat(locale, options).format(new Date(date));
}

/**
 * Formats a time string according to the specified language/locale.
 *
 * If the input time string does not contain a date, a default date is prepended.
 * If the time string is not valid, it attempts to parse it.
 * The formatted time is returned using the appropriate locale and formatting options.
 *
 * @param {string} time - The time string to format (e.g., "12:34:56" or "1970-01-01T12:34:56").
 * @param {string} [language="default"] - The language/locale to use for formatting.
 * @returns {string} The formatted time string.
 */
export function formatTime(time, language = "default") {
    const timeHasDate = time.includes("T");
    if (!timeHasDate) {
        time = "1970-01-01T" + time; // Append date if not present
    }
    if (!isValidDateString(time)) {
        time = parseTimeString(time);
    }

    // Format the time string
    language = getAvailableDateTimeLanguageOrDefault(language);
    const locale = dateTimeLocale.time[language];
    const options = dateTimeFormat.time[locale] || dateTimeFormat.time.default;
    return new Intl.DateTimeFormat(locale, options).format(new Date(time));
}

/**
 * Formats a given string based on the specified format and language.
 *
 * @param {string} string - The string to be formatted.
 * @param {string} format - The format type ("dateTime", "date", "time").
 * @param {string} [language="default"] - The language to use for formatting (default is "default").
 * @returns {string} - The formatted string.
 */
export function formatString(string, format, language = "default") {
    switch (format) {
        case "dateTime":
            return formatDateTime(string, language);
        case "date":
            return formatDate(string, language);
        case "time":
            return formatTime(string, language);
        default:
            return string;
    }
}

/**
 * Checks if the provided header size is valid.
 *
 * @param {string} size - The header size to validate.
 * @returns {boolean} Returns `true` if the size is valid, otherwise `false`.
 */
export function isValidHeaderSize(size) {
    return hasValue(size) && validSizeValues.includes(size.toLowerCase());
}
