// Dependencies
import { CustomElementHtmlAttributes, createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";

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
        hideIfEmpty: component?.hideIfEmpty,
        hideTitle: component?.hideTitle,
        isChildComponent: true,
        resourceValues: component?.resourceValues
    });
    const summationDataElement = createCustomElement("custom-summation", htmlAttributes);
    return summationDataElement;
}
