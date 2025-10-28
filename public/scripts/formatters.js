/**
 * Removes a leading or trailing comma from the given string value.
 *
 * @param {string} value - The string to process.
 * @returns {string} The string without leading or trailing commas.
 */
export function removeTrailingOrLeadingComma(value) {
    return value.replaceAll(/(^,)|(,$)/g, "");
}

/**
 * Beautifies a JSON string by parsing it and then stringifying it with indentation.
 * Removes any trailing or leading commas before parsing.
 *
 * @param {string} json - The JSON string to beautify.
 * @returns {string} - The beautified (pretty-printed) JSON string.
 * @throws {SyntaxError} - If the input is not valid JSON after removing commas.
 */
export function beautifyJson(json) {
    return JSON.stringify(JSON.parse(removeTrailingOrLeadingComma(json)), null, 2);
}
