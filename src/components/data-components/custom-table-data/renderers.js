// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement } from "../../../functions/helpers.js";

/**
 * Renders a custom table element using the provided component configuration.
 *
 * @param {Object} component - The component configuration object used to generate HTML attributes.
 * @returns {HTMLElement} The created custom table element.
 */
export function renderTableElement(component) {
    const htmlAttributes = new CustomElementHtmlAttributes(component);
    return createCustomElement("custom-table", htmlAttributes);
}
