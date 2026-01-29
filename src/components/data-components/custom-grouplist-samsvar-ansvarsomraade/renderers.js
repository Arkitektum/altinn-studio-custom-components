// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement } from "../../../functions/helpers.js";

/**
 * Renders a custom group element for "samsvar-ansvarsomraade" data.
 *
 * @param {Object} samsvarAnsvarsomraade - The data to be rendered in the group.
 * @param {Object} component - The component configuration object.
 * @returns {HTMLElement} The custom group element for "samsvar-ansvarsomraade".
 */
export function renderSamsvarAnsvarsomraadeGroup(samsvarAnsvarsomraade, component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        resourceBindings: component?.resourceBindings,
        resourceValues: {
            data: samsvarAnsvarsomraade
        }
    });
    return createCustomElement("custom-group-samsvar-ansvarsomraade", htmlAttributes);
}

/**
 * Renders a custom paragraph element displaying the empty field text for a given component.
 *
 * @param {Object} component - The component object containing resource values.
 * @param {Object} [component.resourceValues] - Resource values for the component.
 * @param {string} [component.resourceValues.data] - The text to display as the empty field.
 * @returns {HTMLElement} The custom paragraph element with the specified attributes.
 */
export function renderEmptyFieldText(component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        resourceValues: {
            title: component?.resourceValues?.data
        }
    });
    return createCustomElement("custom-paragraph", htmlAttributes);
}
