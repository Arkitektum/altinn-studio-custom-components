// Dependencies
import { CustomElementHtmlAttributes, createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";

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
