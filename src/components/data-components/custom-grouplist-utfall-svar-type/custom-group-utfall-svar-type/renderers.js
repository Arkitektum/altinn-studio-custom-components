// Classes
import CustomElementHtmlAttributes from "../../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement } from "../../../../functions/helpers.js";

/**
 * Renders a custom group list component for "Utfall Svar" type.
 *
 * @param {Object} component - The component configuration object.
 * @param {boolean} [component.enableLinks] - Flag to enable or disable links in the component.
 * @param {Object} [component.resourceBindings] - Resource bindings for the component.
 * @param {Object} [component.resourceValues] - Resource values for the component.
 * @param {*} [component.resourceValues.data] - Data resource value.
 * @param {*} [component.resourceValues.title] - Title resource value.
 * @returns {HTMLElement} The rendered custom group list element.
 */
export function renderUtfallSvarGroupList(component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        enableLinks: component?.enableLinks,
        resourceBindings: component?.resourceBindings,
        resourceValues: {
            data: component?.resourceValues?.data,
            title: component?.resourceValues?.title
        }
    });
    return createCustomElement("custom-grouplist-utfall-svar", htmlAttributes);
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
