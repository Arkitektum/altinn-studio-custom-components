// Global functions
import { getPartTableElement } from "../../../functions/tableHelpers.js";

/**
 * Renders a table for "tiltakshaver" using the provided part, text resources, and text resource bindings.
 *
 * @param {Object} part - The part object containing data to be rendered in the table.
 * @param {Object} textResources - An object containing text resources for localization.
 * @param {Object} [textResourceBindings] - An optional object containing specific text resource bindings.
 * @param {string} [textResourceBindings.tiltakshaver] - The text resource binding for "tiltakshaver".
 * @returns {HTMLElement} - The HTML element representing the rendered table.
 */
export function renderTiltakshaverTable(part, textResources, textResourceBindings) {
    return getPartTableElement(part, textResources, textResourceBindings?.tiltakshaver);
}
