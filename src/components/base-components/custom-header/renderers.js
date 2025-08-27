// Global functions
import { isValidHeaderSize } from "../../../functions/dataFormatHelpers.js";
import { addStyle } from "../../../functions/helpers.js";

/**
 * Renders a header HTML element based on the provided component configuration.
 *
 * @param {Object} component - The component configuration object.
 * @param {Object} [component.resourceValues] - Resource values for the component.
 * @param {string} [component.resourceValues.title] - The text to display in the header.
 * @param {string} [component.size] - The desired header size (e.g., "h1", "h2", etc.).
 * @param {Object} [component.styleOverride] - Optional style overrides for the header element.
 * @returns {string} The outer HTML string of the rendered header element.
 */
export function renderHeaderElement(component) {
    const text = component?.resourceValues?.title;
    const defaultHeaderSize = "h2";
    const size = component?.size;
    const styleOverride = component?.styleOverride;
    const headerElement = document.createElement(isValidHeaderSize(size) ? size : defaultHeaderSize);
    headerElement.innerHTML = text;
    addStyle(headerElement, styleOverride);
    return headerElement.outerHTML;
}
