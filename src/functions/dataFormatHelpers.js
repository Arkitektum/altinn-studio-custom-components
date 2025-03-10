import { dateTimeFormat, dateTimeLocale } from "../constants/dateTimeFormats.js";

/**
 * Formats a given date-time string according to the specified language or default locale.
 *
 * @param {string} dateTime - The date-time string to be formatted.
 * @param {string} [language="default"] - The language code to format the date-time string. Defaults to "default".
 * @returns {string} - The formatted date-time string.
 */
function formatDateTime(dateTime, language = "default") {
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
function formatDate(date, language = "default") {
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
function formatTime(time, language = "default") {
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
