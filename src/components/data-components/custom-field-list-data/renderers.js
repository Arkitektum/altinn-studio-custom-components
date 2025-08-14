// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { addContainerElement, createCustomElement } from "../../../functions/helpers.js";

/**
 * Renders a custom field data element by creating a custom HTML element
 * with the provided resource values and wrapping it in a container element.
 *
 * @param {Object} resourceValues - The resource values to be passed to the custom element.
 * @returns {HTMLElement} The container element containing the custom field data element.
 */
function renderCustomFieldDataElement(resourceValues) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        resourceValues
    });
    return addContainerElement(createCustomElement("custom-field-data", htmlAttributes));
}

/**
 * Renders a list of custom field data elements into a container div.
 *
 * @param {Object} component - The component object containing resource values.
 * @param {Object} [component.resourceValues] - The resource values object.
 * @param {Array} [component.resourceValues.data] - The array of data items to render.
 * @returns {HTMLDivElement} A div element containing the rendered custom field data elements.
 */
export function renderListFieldElement(component) {
    const fieldListDataElement = document.createElement("div");
    component?.resourceValues?.data?.forEach((item) => {
        fieldListDataElement.appendChild(renderCustomFieldDataElement(item));
    });
    return fieldListDataElement;
}
