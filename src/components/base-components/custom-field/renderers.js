// Global functions
import { addStyle, hasValue } from "../../../functions/helpers.js";

/**
 * Renders a field title element as a label.
 *
 * @param {string} fieldTitle - The title text to be displayed in the label.
 * @param {boolean} inline - A flag indicating whether the title should be displayed inline with a colon.
 * @returns {HTMLLabelElement} The created label element with the specified title.
 */
function renderFieldTitleElement(fieldTitle, inline) {
    const fieldTitleLabelElement = document.createElement("label");
    fieldTitleLabelElement.innerText = `${fieldTitle}${inline ? ":" : ""}`;
    return fieldTitleLabelElement;
}

/**
 * Renders a field value as a span element, formatting arrays and objects for display.
 *
 * - Arrays are joined into a comma-separated string.
 * - Objects are stringified as pretty-printed JSON.
 * - If the value is falsy or empty, the span will be empty.
 *
 * @param {*} fieldValue - The value to render. Can be of any type (string, number, array, object, etc.).
 * @returns {HTMLSpanElement} A span element containing the formatted field value.
 */
function renderFieldValueElement(fieldValue) {
    const fieldValueElement = document.createElement("span");
    if (Array.isArray(fieldValue)) {
        fieldValue = fieldValue.join(", ");
    }
    if (typeof fieldValue === "object") {
        fieldValue = JSON.stringify(fieldValue, null, 2);
    }
    const htmlContent = hasValue(fieldValue) ? injectAnchorElements(fieldValue) : "";
    fieldValueElement.innerHTML = htmlContent;
    return fieldValueElement;
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
function injectAnchorElements(text) {
    // One canonical URL pattern
    const urlPattern = "(?:https?:\\/\\/(?:www\\.)?[a-zA-Z0-9][a-zA-Z0-9-]*\\.[^\\s]{2,}|www\\.[a-zA-Z0-9][a-zA-Z0-9-]*\\.[^\\s]{2,})";

    // 1) Capturing group so split keeps the URL tokens
    const splitRegex = new RegExp(`(${urlPattern})`, "g");

    // 2) Non-global tester to avoid lastIndex issues
    const isUrl = new RegExp(`^${urlPattern}$`);

    // Optional: basic HTML escape for non-link parts
    const escapeHtml = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    return text
        .split(splitRegex)
        .map((part) => {
            if (!part) return "";
            if (isUrl.test(part)) {
                // Trim common trailing punctuation off the link and re-attach after the anchor
                const m = part.match(/^(.*?)([).,!?:;]+)?$/);
                const raw = m[1];
                const trail = m[2] ?? "";
                const href = raw.startsWith("http") ? raw : `https://${raw}`;
                return `<a href="${href}" target="_blank" rel="noopener noreferrer">${raw}</a>${escapeHtml(trail)}`;
            }
            return escapeHtml(part);
        })
        .join("");
}

/**
 * Renders a field element with a title and value.
 *
 * @param {string} fieldTitle - The title of the field.
 * @param {string} fieldValue - The value of the field.
 * @param {Object} [options] - Optional settings for rendering the field element.
 * @param {boolean} [options.returnHtml=true] - Whether to return the element as HTML string.
 * @param {boolean} [options.inline=false] - Whether to render the field inline.
 * @param {Object} [options.styleOverride={}] - Custom styles to apply to the field element.
 * @returns {HTMLElement|string} The rendered field element or its HTML string representation.
 */
export function renderFieldElement(fieldTitle, fieldValue, options) {
    options = {
        returnHtml: true,
        inline: false,
        styleOverride: {},
        ...options
    };
    const fieldElement = document.createElement("div");
    fieldElement.classList.add("field");
    if (fieldTitle?.length) {
        fieldElement.appendChild(renderFieldTitleElement(fieldTitle, options.inline));
    }
    if (options?.inline) {
        fieldElement.classList.add("inline");
    }
    const fieldValueElement = renderFieldValueElement(fieldValue);
    if (fieldTitle?.length) {
        fieldValueElement.classList.add("has-title");
    }
    fieldElement.appendChild(fieldValueElement);
    addStyle(fieldElement, {
        ...options.styleOverride
    });
    return options.returnHtml ? fieldElement.outerHTML : fieldElement;
}
