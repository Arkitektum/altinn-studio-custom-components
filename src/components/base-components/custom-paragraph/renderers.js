// Dependencies
import { addStyle } from "@arkitektum/altinn-studio-custom-components-utils";

/**
 * Renders a paragraph HTML element with the specified text and style overrides.
 *
 * @param {Object} component - The component object containing paragraph data.
 * @param {Object} [component?.resourceValues] - Resource values for the component.
 * @param {string} [component?.resourceValues.title] - The text to display in the paragraph.
 * @param {Object} [component.styleOverride] - Optional style overrides to apply to the paragraph element.
 * @returns {string} The outer HTML string of the rendered paragraph element.
 */
export function renderParagraphElement(component) {
    const text = component?.resourceValues?.title;
    const styleOverride = component?.styleOverride;
    const paragraphElement = document.createElement("p");
    // The title reaches this renderer from a text resource or a resourceValues override: use textContent so any
    // HTML-like content is rendered as text, not interpreted (XSS-safe).
    paragraphElement.textContent = text;
    addStyle(paragraphElement, styleOverride);
    return paragraphElement.outerHTML;
}
