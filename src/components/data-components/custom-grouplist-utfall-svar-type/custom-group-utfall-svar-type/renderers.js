// Classes
import CustomElementHtmlAttributes from "../../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement } from "../../../../functions/helpers.js";

/**
 * Renders a custom group list element for "Utfall Svar" type.
 *
 * @param {Object} component - The component configuration object.
 * @param {boolean} [component.enableLinks] - Flag to enable links in the group list.
 * @param {Object} [component.resourceBindings] - Resource bindings for the component.
 * @param {string} [component.resourceBindings.title] - Title resource binding.
 * @param {Object} [component.resourceValues] - Resource values for the component.
 * @param {*} [component.resourceValues.data] - Data resource value.
 * @param {string} [component.resourceValues.title] - Title resource value.
 * @returns {HTMLElement} The custom group list element.
 */
export function renderUtfallSvarGroupList(component) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        isChildComponent: true,
        hideIfEmpty: true,
        enableLinks: component?.enableLinks,
        resourceBindings: {
            title: component?.resourceBindings?.title
        },
        resourceValues: {
            data: component?.resourceValues?.data,
            title: component?.resourceValues?.title
        }
    });
    return createCustomElement("custom-grouplist-utfall-svar", htmlAttributes);
}
