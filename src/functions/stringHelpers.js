/**
 * Escapes the HTML-special characters (`&`, `<`, `>`) so a value can be safely interpolated into HTML text content.
 *
 * @param {*} value - The value to escape (coerced to a string).
 * @returns {string} The escaped string.
 */
export function escapeHtml(value) {
    return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

/**
 * Escapes a value for safe use inside a double-quoted HTML attribute (everything {@link escapeHtml} handles, plus the
 * double-quote that would otherwise close the attribute).
 *
 * @param {*} value - The value to escape (coerced to a string).
 * @returns {string} The attribute-escaped string.
 */
export function escapeHtmlAttribute(value) {
    return escapeHtml(value).replaceAll('"', "&quot;");
}
