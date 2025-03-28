import Part from "../../../classes/data-classes/Part.js";
import { hasValue } from "../../../functions/helpers.js";
import { getPartTableElement } from "../../../functions/tableHelpers.js";

/**
 * Retrieves a Part instance from the given component if it contains valid form data.
 *
 * @param {Object} component - The component object containing form data.
 * @param {Object} [component.formData] - The form data object within the component.
 * @param {any} [component.formData.data] - The data to be used for creating a Part instance.
 * @returns {Part|boolean} - A new Part instance if the data is valid, otherwise `false`.
 */
export function getPart(component) {
    return hasValue(component?.formData?.data) && new Part(component.formData.data);
}

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
