// Global functions
import { isValidHeaderSize } from "../../../functions/dataFormatHelpers.js";

/**
 * Renders a header element with the specified text, size, and optional style overrides.
 *
 * @param {string} text - The text content to be displayed in the header element.
 * @param {string} [size] - The size of the header element (e.g., 'h1', 'h2'). Defaults to a predefined size if not provided.
 * @returns {string} The outer HTML of the created header element.
 */
export function renderHeaderElement(text, size) {
    const defaultHeaderSize = "h2";
    const headerElement = document.createElement(isValidHeaderSize(size) ? size : defaultHeaderSize);
    headerElement.innerHTML = text;
    return headerElement.outerHTML;
}
