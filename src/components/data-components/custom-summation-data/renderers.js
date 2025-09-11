// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement } from "../../../functions/helpers.js";

/**
 * Renders a custom summation data element with specified HTML attributes.
 *
 * @param {Object} component - The component configuration object.
 * @param {Object} [component.resourceValues] - Optional resource values to be passed to the custom element.
 * @returns {HTMLElement} The created custom summation data element.
 */
export function renderSummationData(component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        size: "h3",
        hideIfEmpty: true,
        isChildComponent: true,
        resourceValues: component?.resourceValues
    });
    const summationDataElement = createCustomElement("custom-summation", htmlAttributes);
    return summationDataElement;
}
