import { availableDateTimeLanguages, dateTimeFormat, dateTimeLocale } from "../constants/dateTimeFormats.js";

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
 * Checks if a given string is a valid date string.
 *
 * @param {string} dateString - The date string to validate.
 * @returns {boolean} - Returns `true` if the date string is valid, otherwise `false`.
 */
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

    const locale = dateTimeLocale.dateTime[language] || dateTimeLocale.dateTime.default;
    const options = dateTimeFormat.dateTime[locale] || dateTimeFormat.dateTime.default;
    return new Intl.DateTimeFormat(locale, options).format(new Date(dateTime));
}

/**
 * Formats a given date string according to the specified language or default locale.
 *
 * @param {string} date - The date string to format.
 * @param {string} [language="default"] - The language code to format the date in. Defaults to "default".
 * @returns {string} - The formatted date string.
 */
export function formatDate(date, language = "default") {
    if (!isValidDateString(date)) {
        throw new Error("Invalid date input");
    }
    language = getAvailableDateTimeLanguageOrDefault(language);
    const locale = dateTimeLocale.date[language] || dateTimeLocale.date.default;
    const options = dateTimeFormat.date[locale] || dateTimeFormat.date.default;
    return new Intl.DateTimeFormat(locale, options).format(new Date(date));
}

/**
 * Formats a given time string according to the specified language.
 *
 * @param {string} time - The time string to format.
 * @param {string} [language="default"] - The language code to use for formatting. Defaults to "default".
 * @returns {string} - The formatted time string.
 */
export function formatTime(time, language = "default") {
    const locale = dateTimeLocale.time[language] || dateTimeLocale.time.default;
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
